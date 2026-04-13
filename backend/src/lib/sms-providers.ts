import { MessagingSettings, SmsProvider } from "../models/MessagingSettings.js";

export interface SmsResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

interface ProviderSendFn {
  (settings: MessagingSettings, to: string, body: string): Promise<SmsResult>;
}

interface ProviderTestFn {
  (settings: MessagingSettings): Promise<{ ok: boolean; message: string }>;
}

function formEncode(params: Record<string, string>): string {
  return Object.entries(params).map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join("&");
}

const sendTwilio: ProviderSendFn = async (s, to, body) => {
  const accountSid = s.apiKey;
  const authToken = s.apiSecret;
  if (!accountSid || !authToken || !s.senderId) throw new Error("Twilio: Account SID, Auth Token, and Phone Number required");

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${accountSid}:${authToken}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formEncode({ From: s.senderId, To: to, Body: body }),
  });
  const data = await res.json() as Record<string, unknown>;
  if (!res.ok) return { success: false, error: (data.message ?? data.error_message ?? `HTTP ${res.status}`) as string };
  return { success: true, messageId: data.sid as string };
};

const testTwilio: ProviderTestFn = async (s) => {
  if (!s.apiKey || !s.apiSecret) return { ok: false, message: "Account SID and Auth Token are required" };
  const url = `https://api.twilio.com/2010-04-01/Accounts/${s.apiKey}.json`;
  const res = await fetch(url, {
    headers: { Authorization: "Basic " + Buffer.from(`${s.apiKey}:${s.apiSecret}`).toString("base64") },
  });
  if (!res.ok) return { ok: false, message: `Authentication failed (HTTP ${res.status})` };
  return { ok: true, message: "Twilio connection verified." };
};

const sendAfricasTalking: ProviderSendFn = async (s, to, body) => {
  if (!s.apiKey || !s.senderId) throw new Error("Africa's Talking: API Key and Username required");
  const username = s.senderId;
  const url = "https://api.africastalking.com/version1/messaging";

  const params: Record<string, string> = { username, to, message: body };
  const extra = s.extraConfig as Record<string, string> | null;
  if (extra?.from) params.from = extra.from;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      apiKey: s.apiKey,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "application/json",
    },
    body: formEncode(params),
  });
  const data = await res.json() as { SMSMessageData?: { Recipients?: Array<{ status: string; messageId: string; number: string }> }; message?: string };
  if (!res.ok) return { success: false, error: data.message ?? `HTTP ${res.status}` };
  const recipient = data.SMSMessageData?.Recipients?.[0];
  if (recipient && recipient.status === "Success") return { success: true, messageId: recipient.messageId };
  return { success: false, error: recipient?.status ?? "Unknown error" };
};

const testAfricasTalking: ProviderTestFn = async (s) => {
  if (!s.apiKey || !s.senderId) return { ok: false, message: "API Key and Username are required" };
  const url = `https://api.africastalking.com/version1/user?username=${encodeURIComponent(s.senderId)}`;
  const res = await fetch(url, { headers: { apiKey: s.apiKey, Accept: "application/json" } });
  if (!res.ok) return { ok: false, message: `Authentication failed (HTTP ${res.status})` };
  return { ok: true, message: "Africa's Talking connection verified." };
};

const sendTermii: ProviderSendFn = async (s, to, body) => {
  if (!s.apiKey) throw new Error("Termii: API Key required");
  const url = "https://api.ng.termii.com/api/sms/send";

  const payload: Record<string, unknown> = {
    api_key: s.apiKey,
    to,
    from: s.senderId || "CommsCRM",
    sms: body,
    type: "plain",
    channel: "generic",
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json() as { message_id?: string; message?: string; code?: string };
  if (!res.ok || data.code === "error") return { success: false, error: data.message ?? `HTTP ${res.status}` };
  return { success: true, messageId: data.message_id };
};

const testTermii: ProviderTestFn = async (s) => {
  if (!s.apiKey) return { ok: false, message: "API Key is required" };
  const url = `https://api.ng.termii.com/api/check/balance?api_key=${encodeURIComponent(s.apiKey)}`;
  const res = await fetch(url);
  if (!res.ok) return { ok: false, message: `Authentication failed (HTTP ${res.status})` };
  const data = await res.json() as { balance?: number; currency?: string };
  return { ok: true, message: `Termii verified. Balance: ${data.balance ?? "N/A"} ${data.currency ?? ""}` };
};

const sendVonage: ProviderSendFn = async (s, to, body) => {
  if (!s.apiKey || !s.apiSecret) throw new Error("Vonage: API Key and API Secret required");
  const url = "https://rest.nexmo.com/sms/json";

  const payload = {
    api_key: s.apiKey,
    api_secret: s.apiSecret,
    to,
    from: s.senderId || "CommsCRM",
    text: body,
  };

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json() as { messages?: Array<{ status: string; "message-id"?: string; "error-text"?: string }> };
  const msg = data.messages?.[0];
  if (msg?.status === "0") return { success: true, messageId: msg["message-id"] };
  return { success: false, error: msg?.["error-text"] ?? "Unknown Vonage error" };
};

const testVonage: ProviderTestFn = async (s) => {
  if (!s.apiKey || !s.apiSecret) return { ok: false, message: "API Key and API Secret are required" };
  const url = `https://rest.nexmo.com/account/get-balance?api_key=${encodeURIComponent(s.apiKey)}&api_secret=${encodeURIComponent(s.apiSecret)}`;
  const res = await fetch(url);
  if (!res.ok) return { ok: false, message: `Authentication failed (HTTP ${res.status})` };
  const data = await res.json() as { value?: number };
  return { ok: true, message: `Vonage verified. Balance: ${data.value?.toFixed(2) ?? "N/A"} EUR` };
};

const sendInfobip: ProviderSendFn = async (s, to, body) => {
  if (!s.apiKey || !s.baseUrl) throw new Error("Infobip: API Key and Base URL required");
  const url = `https://${s.baseUrl}/sms/2/text/advanced`;

  const payload = {
    messages: [{
      destinations: [{ to }],
      from: s.senderId || "CommsCRM",
      text: body,
    }],
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `App ${s.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const data = await res.json() as { messages?: Array<{ status?: { groupName?: string; description?: string }; messageId?: string }> };
  if (!res.ok) return { success: false, error: `HTTP ${res.status}` };
  const msg = data.messages?.[0];
  if (msg?.status?.groupName === "PENDING") return { success: true, messageId: msg.messageId };
  return { success: false, error: msg?.status?.description ?? "Unknown Infobip error" };
};

const testInfobip: ProviderTestFn = async (s) => {
  if (!s.apiKey || !s.baseUrl) return { ok: false, message: "API Key and Base URL are required" };
  const url = `https://${s.baseUrl}/sms/1/inbox/reports`;
  const res = await fetch(url, { headers: { Authorization: `App ${s.apiKey}` } });
  if (!res.ok) return { ok: false, message: `Authentication failed (HTTP ${res.status})` };
  return { ok: true, message: "Infobip connection verified." };
};

const sendCustom: ProviderSendFn = async (s, to, body) => {
  if (!s.baseUrl) throw new Error("Custom: API URL is required");
  const extra = (s.extraConfig ?? {}) as Record<string, string>;
  const method = extra.method || "POST";
  const authHeader = extra.authHeader || "";
  const bodyTemplate = extra.bodyTemplate || JSON.stringify({ to: "{{to}}", message: "{{message}}", from: "{{from}}" });

  const finalBody = bodyTemplate
    .replace(/\{\{to\}\}/g, to)
    .replace(/\{\{message\}\}/g, body)
    .replace(/\{\{from\}\}/g, s.senderId || "CommsCRM")
    .replace(/\{\{apiKey\}\}/g, s.apiKey || "");

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authHeader) {
    const resolved = authHeader
      .replace(/\{\{apiKey\}\}/g, s.apiKey || "")
      .replace(/\{\{apiSecret\}\}/g, s.apiSecret || "");
    headers.Authorization = resolved;
  }

  const res = await fetch(s.baseUrl, { method, headers, body: finalBody });
  if (!res.ok) {
    const text = await res.text();
    return { success: false, error: `HTTP ${res.status}: ${text.slice(0, 200)}` };
  }
  return { success: true, messageId: "custom" };
};

const testCustom: ProviderTestFn = async (s) => {
  if (!s.baseUrl) return { ok: false, message: "API URL is required" };
  return { ok: true, message: "Custom provider configured. Send a test campaign to verify." };
};

const PROVIDERS: Record<SmsProvider, { send: ProviderSendFn; test: ProviderTestFn }> = {
  twilio: { send: sendTwilio, test: testTwilio },
  africastalking: { send: sendAfricasTalking, test: testAfricasTalking },
  termii: { send: sendTermii, test: testTermii },
  vonage: { send: sendVonage, test: testVonage },
  infobip: { send: sendInfobip, test: testInfobip },
  custom: { send: sendCustom, test: testCustom },
};

export async function sendSms(settings: MessagingSettings, to: string, body: string): Promise<SmsResult> {
  const provider = PROVIDERS[settings.smsProvider];
  if (!provider) return { success: false, error: `Unknown SMS provider: ${settings.smsProvider}` };
  return provider.send(settings, to, body);
}

export async function testSmsProvider(settings: MessagingSettings): Promise<{ ok: boolean; message: string }> {
  const provider = PROVIDERS[settings.smsProvider];
  if (!provider) return { ok: false, message: `Unknown SMS provider: ${settings.smsProvider}` };
  return provider.test(settings);
}

export async function sendWhatsapp(settings: MessagingSettings, to: string, body: string): Promise<SmsResult> {
  if (!settings.apiKey || !settings.apiSecret || !settings.twilioWhatsappNumber) {
    return { success: false, error: "Twilio credentials and WhatsApp number required for WhatsApp" };
  }
  const from = settings.twilioWhatsappNumber.startsWith("whatsapp:") ? settings.twilioWhatsappNumber : `whatsapp:${settings.twilioWhatsappNumber}`;
  const toWa = to.startsWith("whatsapp:") ? to : `whatsapp:${to}`;
  const url = `https://api.twilio.com/2010-04-01/Accounts/${settings.apiKey}/Messages.json`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: "Basic " + Buffer.from(`${settings.apiKey}:${settings.apiSecret}`).toString("base64"),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formEncode({ From: from, To: toWa, Body: body }),
  });
  const data = await res.json() as Record<string, unknown>;
  if (!res.ok) return { success: false, error: (data.message ?? data.error_message ?? `HTTP ${res.status}`) as string };
  return { success: true, messageId: data.sid as string };
}

export async function getMessagingSettings(): Promise<MessagingSettings | null> {
  return MessagingSettings.findOne({ order: [["id", "ASC"]] });
}

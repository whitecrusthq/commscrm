import { Router } from "express";
import { MessagingSettings } from "../models/MessagingSettings.js";
import { requireAuth, requireAdmin, AuthRequest } from "../middlewares/auth.js";
import { testSmsProvider } from "../lib/sms-providers.js";

const router = Router();

router.get("/messaging-settings", requireAuth, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    let settings = await MessagingSettings.findOne({ order: [["id", "ASC"]] });
    if (!settings) {
      settings = await MessagingSettings.create({ smsProvider: "twilio" });
    }
    res.json({
      id: settings.id,
      smsProvider: settings.smsProvider,
      hasApiKey: !!settings.apiKey,
      hasApiSecret: !!settings.apiSecret,
      senderId: settings.senderId,
      baseUrl: settings.baseUrl,
      extraConfig: settings.extraConfig,
      twilioWhatsappNumber: settings.twilioWhatsappNumber,
      smsEnabled: settings.smsEnabled,
      whatsappEnabled: settings.whatsappEnabled,
    });
  } catch (err) {
    console.error("Get messaging settings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/messaging-settings", requireAuth, requireAdmin, async (req: AuthRequest, res) => {
  try {
    let settings = await MessagingSettings.findOne({ order: [["id", "ASC"]] });
    if (!settings) {
      settings = await MessagingSettings.create({ smsProvider: "twilio" });
    }

    const { smsProvider, apiKey, apiSecret, senderId, baseUrl, extraConfig, twilioWhatsappNumber, smsEnabled, whatsappEnabled } = req.body;

    if (smsProvider !== undefined) settings.smsProvider = smsProvider;
    if (apiKey !== undefined) settings.apiKey = apiKey || null;
    if (apiSecret !== undefined) settings.apiSecret = apiSecret || null;
    if (senderId !== undefined) settings.senderId = senderId || null;
    if (baseUrl !== undefined) settings.baseUrl = baseUrl || null;
    if (extraConfig !== undefined) settings.extraConfig = extraConfig || null;
    if (twilioWhatsappNumber !== undefined) settings.twilioWhatsappNumber = twilioWhatsappNumber || null;
    if (smsEnabled !== undefined) settings.smsEnabled = smsEnabled;
    if (whatsappEnabled !== undefined) settings.whatsappEnabled = whatsappEnabled;

    await settings.save();

    res.json({
      id: settings.id,
      smsProvider: settings.smsProvider,
      hasApiKey: !!settings.apiKey,
      hasApiSecret: !!settings.apiSecret,
      senderId: settings.senderId,
      baseUrl: settings.baseUrl,
      extraConfig: settings.extraConfig,
      twilioWhatsappNumber: settings.twilioWhatsappNumber,
      smsEnabled: settings.smsEnabled,
      whatsappEnabled: settings.whatsappEnabled,
    });
  } catch (err) {
    console.error("Update messaging settings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/messaging-settings/test", requireAuth, requireAdmin, async (_req: AuthRequest, res) => {
  try {
    const settings = await MessagingSettings.findOne({ order: [["id", "ASC"]] });
    if (!settings) {
      res.status(400).json({ error: "Messaging settings not configured" });
      return;
    }
    const result = await testSmsProvider(settings);
    res.json(result);
  } catch (err) {
    console.error("Test messaging settings error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;

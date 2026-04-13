import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../lib/database.js";

export type SmsProvider = "twilio" | "africastalking" | "termii" | "vonage" | "infobip" | "custom";

export interface MessagingSettingsAttributes {
  id: number;
  smsProvider: SmsProvider;
  smsEnabled: boolean;
  whatsappEnabled: boolean;
  apiKey: string | null;
  apiSecret: string | null;
  senderId: string | null;
  baseUrl: string | null;
  extraConfig: Record<string, unknown> | null;
  twilioWhatsappNumber: string | null;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface MessagingSettingsCreationAttributes
  extends Optional<MessagingSettingsAttributes, "id" | "smsProvider" | "apiKey" | "apiSecret" | "senderId" | "baseUrl" | "extraConfig" | "twilioWhatsappNumber" | "smsEnabled" | "whatsappEnabled"> {}

export class MessagingSettings extends Model<MessagingSettingsAttributes, MessagingSettingsCreationAttributes>
  implements MessagingSettingsAttributes {
  declare id: number;
  declare smsProvider: SmsProvider;
  declare smsEnabled: boolean;
  declare whatsappEnabled: boolean;
  declare apiKey: string | null;
  declare apiSecret: string | null;
  declare senderId: string | null;
  declare baseUrl: string | null;
  declare extraConfig: Record<string, unknown> | null;
  declare twilioWhatsappNumber: string | null;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

MessagingSettings.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    smsProvider: { type: DataTypes.STRING(50), allowNull: false, defaultValue: "twilio", field: "sms_provider" },
    smsEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "sms_enabled" },
    whatsappEnabled: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: "whatsapp_enabled" },
    apiKey: { type: DataTypes.TEXT, allowNull: true, field: "api_key" },
    apiSecret: { type: DataTypes.TEXT, allowNull: true, field: "api_secret" },
    senderId: { type: DataTypes.STRING(100), allowNull: true, field: "sender_id" },
    baseUrl: { type: DataTypes.TEXT, allowNull: true, field: "base_url" },
    extraConfig: { type: DataTypes.JSONB, allowNull: true, field: "extra_config" },
    twilioWhatsappNumber: { type: DataTypes.STRING(50), allowNull: true, field: "twilio_whatsapp_number" },
  },
  {
    sequelize,
    tableName: "crm_messaging_settings",
    underscored: true,
  }
);

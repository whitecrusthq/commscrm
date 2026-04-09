import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../lib/database.js";

export interface BrandingSettingsAttributes {
  id: number;
  appName: string;
  primaryColor: string;
  sidebarColor: string;
  logoData: string | null;
  backgroundData: string | null;
  defaultCurrency: string;
  updatedAt?: Date;
  createdAt?: Date;
}

export interface BrandingSettingsCreationAttributes
  extends Optional<BrandingSettingsAttributes, "id" | "logoData" | "backgroundData" | "defaultCurrency"> {}

export class BrandingSettings
  extends Model<BrandingSettingsAttributes, BrandingSettingsCreationAttributes>
  implements BrandingSettingsAttributes {
  declare id: number;
  declare appName: string;
  declare primaryColor: string;
  declare sidebarColor: string;
  declare logoData: string | null;
  declare backgroundData: string | null;
  declare defaultCurrency: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

BrandingSettings.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    appName: { type: DataTypes.STRING(100), allowNull: false, defaultValue: "CommsCRM", field: "app_name" },
    primaryColor: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#4F46E5", field: "primary_color" },
    sidebarColor: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "#3F0E40", field: "sidebar_color" },
    logoData: { type: DataTypes.TEXT("long"), allowNull: true, field: "logo_data" },
    backgroundData: { type: DataTypes.TEXT("long"), allowNull: true, field: "background_data" },
    defaultCurrency: { type: DataTypes.STRING(3), allowNull: false, defaultValue: "USD", field: "default_currency" },
  },
  {
    sequelize,
    tableName: "crm_branding_settings",
    underscored: true,
  }
);

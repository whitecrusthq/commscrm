import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../lib/database.js";

export type AiExceptionType = "exception" | "compliance";

export interface AiExceptionAttributes {
  id: number;
  type: AiExceptionType;
  phrase: string;
  reason: string | null;
  content: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AiExceptionCreationAttributes
  extends Optional<AiExceptionAttributes, "id" | "type" | "reason" | "content" | "isActive"> {}

export class AiException extends Model<AiExceptionAttributes, AiExceptionCreationAttributes> implements AiExceptionAttributes {
  declare id: number;
  declare type: AiExceptionType;
  declare phrase: string;
  declare reason: string | null;
  declare content: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AiException.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    type: { type: DataTypes.STRING(20), allowNull: false, defaultValue: "exception" },
    phrase: { type: DataTypes.TEXT, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" },
  },
  {
    sequelize,
    tableName: "crm_ai_exceptions",
    underscored: true,
  }
);

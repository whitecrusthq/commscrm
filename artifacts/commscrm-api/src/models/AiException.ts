import { DataTypes, Model, Optional } from "sequelize";
import { sequelize } from "../lib/database.js";

export interface AiExceptionAttributes {
  id: number;
  phrase: string;
  reason: string | null;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AiExceptionCreationAttributes
  extends Optional<AiExceptionAttributes, "id" | "reason" | "isActive"> {}

export class AiException extends Model<AiExceptionAttributes, AiExceptionCreationAttributes> implements AiExceptionAttributes {
  declare id: number;
  declare phrase: string;
  declare reason: string | null;
  declare isActive: boolean;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

AiException.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    phrase: { type: DataTypes.TEXT, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
    isActive: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true, field: "is_active" },
  },
  {
    sequelize,
    tableName: "crm_ai_exceptions",
    underscored: true,
  }
);

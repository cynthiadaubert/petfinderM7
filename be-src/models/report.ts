import { DataTypes, Model } from "sequelize";
import { sequelize } from "./connection";

export class Report extends Model {}

Report.init(
  {
    pet_name: DataTypes.STRING,
    phone: DataTypes.BIGINT,
    pet_info: DataTypes.TEXT,
  },
  {
    sequelize,
    modelName: "reports",
  }
);

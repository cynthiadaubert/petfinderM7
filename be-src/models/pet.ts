import { DataTypes, Model, Sequelize } from "sequelize";
import { sequelize } from "./connection";

export class Pet extends Model {}

Pet.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: DataTypes.STRING,
    lat: DataTypes.FLOAT,
    lng: DataTypes.FLOAT,
    pictureURL: DataTypes.TEXT,
    found: DataTypes.BOOLEAN,
    reportLocation: DataTypes.STRING,
    userId: DataTypes.INTEGER,
  },
  {
    sequelize,
    modelName: "pets",
  }
);

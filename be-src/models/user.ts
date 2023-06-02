import { DataTypes, Model } from "sequelize";
import { sequelize } from "./connection"; //importamos la conexion a la bd

export class User extends Model {}

//los modelos y archivos tienen que estar escritos en SINGULAR

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    name: DataTypes.STRING,
    location: DataTypes.STRING,
  },
  {
    sequelize,
    modelName: "user",
  }
);

// CUANDO MODIFICAMOS ESTOS MODELOS, CORTAMOS LA TERMINAL Y HACEMOS UN SYNC PARA QUE SE ACTUALICE

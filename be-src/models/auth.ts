import { DataTypes, Model } from "sequelize";
import { sequelize } from "./connection";

export class Auth extends Model {}

Auth.init(
  {
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    user_Id: DataTypes.INTEGER, // en el caso de user se genera solo, pero acá lo tenemos
    // que agregar para que se vinculen los dos campos (id)
  },
  {
    sequelize,
    modelName: "auths",
  }
);

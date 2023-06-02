"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("./connection");
class Auth extends sequelize_1.Model {
}
exports.Auth = Auth;
Auth.init({
    email: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    user_Id: sequelize_1.DataTypes.INTEGER, // en el caso de user se genera solo, pero acá lo tenemos
    // que agregar para que se vinculen los dos campos (id)
}, {
    sequelize: connection_1.sequelize,
    modelName: "auths",
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("./connection"); //importamos la conexion a la bd
class User extends sequelize_1.Model {
}
exports.User = User;
//los modelos y archivos tienen que estar escritos en SINGULAR
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    email: sequelize_1.DataTypes.STRING,
    password: sequelize_1.DataTypes.STRING,
    name: sequelize_1.DataTypes.STRING,
    location: sequelize_1.DataTypes.STRING,
}, {
    sequelize: connection_1.sequelize,
    modelName: "user",
});
// CUANDO MODIFICAMOS ESTOS MODELOS, CORTAMOS LA TERMINAL Y HACEMOS UN SYNC PARA QUE SE ACTUALICE

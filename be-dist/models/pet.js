"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pet = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("./connection");
class Pet extends sequelize_1.Model {
}
exports.Pet = Pet;
Pet.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: sequelize_1.DataTypes.STRING,
    lat: sequelize_1.DataTypes.FLOAT,
    lng: sequelize_1.DataTypes.FLOAT,
    pictureURL: sequelize_1.DataTypes.TEXT,
    found: sequelize_1.DataTypes.BOOLEAN,
    reportLocation: sequelize_1.DataTypes.STRING,
    userId: sequelize_1.DataTypes.INTEGER,
}, {
    sequelize: connection_1.sequelize,
    modelName: "pets",
});

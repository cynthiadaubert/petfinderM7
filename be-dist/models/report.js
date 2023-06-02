"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = void 0;
const sequelize_1 = require("sequelize");
const connection_1 = require("./connection");
class Report extends sequelize_1.Model {
}
exports.Report = Report;
Report.init({
    pet_name: sequelize_1.DataTypes.STRING,
    phone: sequelize_1.DataTypes.BIGINT,
    pet_info: sequelize_1.DataTypes.TEXT,
}, {
    sequelize: connection_1.sequelize,
    modelName: "reports",
});

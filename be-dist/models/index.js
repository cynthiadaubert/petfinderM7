"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Report = exports.Auth = exports.Pet = exports.User = void 0;
const user_1 = require("./user");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return user_1.User; } });
const pet_1 = require("./pet");
Object.defineProperty(exports, "Pet", { enumerable: true, get: function () { return pet_1.Pet; } });
const auth_1 = require("./auth");
Object.defineProperty(exports, "Auth", { enumerable: true, get: function () { return auth_1.Auth; } });
const report_1 = require("./report");
Object.defineProperty(exports, "Report", { enumerable: true, get: function () { return report_1.Report; } });
user_1.User.hasMany(pet_1.Pet);
pet_1.Pet.belongsTo(user_1.User);
pet_1.Pet.hasMany(report_1.Report);
report_1.Report.belongsTo(pet_1.Pet);

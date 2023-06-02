"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.getToken = exports.getSHA256ofString = void 0;
const models_1 = require("../models");
const crypto = __importStar(require("crypto"));
const jwt = __importStar(require("jsonwebtoken"));
require("dotenv/config");
const SECRET = process.env.SECRET;
function getSHA256ofString(text) {
    return crypto.createHash("sha256").update(text).digest("hex");
}
exports.getSHA256ofString = getSHA256ofString;
async function getToken(data) {
    const { email, password } = data;
    const hashed = getSHA256ofString(password);
    try {
        const auth = await models_1.Auth.findOne({
            where: {
                email,
                password: hashed,
            },
        });
        /*     console.log("soy auth", auth); */
        let token;
        if (auth) {
            token = jwt.sign({ id: auth.get("userId") }, SECRET);
            return token;
        }
        else {
            return null;
        }
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.getToken = getToken;
/* Toma el argumento que contiene el email y pass, y este pass es hasheada para
retornar el SHA. La función busca un record que coincida con email y el SHA.
El metodo findOne retorna una promesa que resuelve el record o devuelve null si
no hay uno.

Si se encuentra un record se genera un JWT token pasandole un objeto con el id del
usuario y el SECRET. Entonces se retorna el token */
async function updatePassword(newPassword, userId) {
    const hashed = getSHA256ofString(newPassword);
    try {
        return await models_1.Auth.update({ password: hashed }, { where: { user_Id: userId } } // <--- PUSE where userId y era user_Id WAAAAAAAAAAAHHHH
        );
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.updatePassword = updatePassword;

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
exports.checkBodyMiddleware = exports.authMiddleware = void 0;
const jwt = __importStar(require("jsonwebtoken")); // agregar @types para que se importe correctamente
function authMiddleware(req, res, next) {
    const token = req.headers.authorization.split(" ")[1]; // verifica que el token sea autentico separando el token del "bearer"
    try {
        const data = jwt.verify(token, process.env.SECRET);
        req._user = data; // si el verify funciona, nos guarda los datos en esta propiedad custom de req - después la podemos acceder con otro handler, o middleware
        next(); // se ejecuta el siguiente middleware
    }
    catch (err) {
        res.status(401).json({ error: true, message: "El token es inválido" });
    }
}
exports.authMiddleware = authMiddleware;
async function checkBodyMiddleware(req, res, next) {
    // chequea que nos pasen bien el body, porque si hay algún string vacío, el método createUser nos va a dar errores
    const hasValue = Object.values(req.body).filter((e) => {
        return e !== "";
    }).length >= 1;
    if (hasValue) {
        next();
    }
    else {
        res.status(401).send({ error: "El body está vacío o incompleto" });
    }
}
exports.checkBodyMiddleware = checkBodyMiddleware;
/* hasValue agarra el objeto reqbody y lo cambia a un array, después lo filtra para ver si el string no está vacío,
y chequea que el lenght sea igual o mayor a uno. Si es mayor a 1 quiere decir que hay data y que no está vacío,
entonces pasa a la siguiente función */

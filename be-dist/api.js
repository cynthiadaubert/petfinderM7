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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path = __importStar(require("path"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./lib/middleware");
const reports_controller_1 = require("./controllers/reports-controller");
const auth_controller_1 = require("./controllers/auth-controller");
const users_controller_1 = require("./controllers/users-controller");
const pets_controller_1 = require("./controllers/pets-controller");
const port = process.env.PORT || 5050;
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" })); //para parsear el body completo
app.use((0, cors_1.default)());
// Enable CORS for all routes
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:1234");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    next();
});
//////////////////// si hay algun error de CORS PROBAR PONER LOS HEADERS MANUALMENTE
//////////////////////////////////// ENDPOINTS
// SIGNUP
// vamos a usar try/catch para que se manejen mejor los errores y que el programa no se detenga
app.post("/signup", middleware_1.checkBodyMiddleware, async (req, res) => {
    const user = await (0, users_controller_1.createUser)(req.body);
    try {
        res.status(201).json(user);
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: "No se pudo crear el user" });
    }
});
// SIGN IN-LOGIN
app.post("/auth", middleware_1.checkBodyMiddleware, async (req, res) => {
    try {
        const token = await (0, auth_controller_1.getToken)(req.body);
        if (token === null) {
            res.status(400).send();
        }
        else {
            res.status(201).json(token);
        }
    }
    catch (error) {
        console.log(error);
    }
});
// FIND EMAIL
app.get("/check-email", async (req, res) => {
    try {
        const email = await (0, users_controller_1.findEmail)(req.query.email);
        if (email == null) {
            res.status(400).send({ error: "No se ha encontrado el email" });
        }
        else {
            res.status(201).json({ email, message: "Email verified" });
        }
    }
    catch (error) {
        console.log(error);
    }
});
// UPDATE USER DATA
app.patch("/users/update", middleware_1.checkBodyMiddleware, middleware_1.authMiddleware, async (req, res) => {
    const { userId } = req.query;
    try {
        const update = await (0, users_controller_1.updateUserData)(req.body, userId);
        res.status(201).json({ update, message: "User actualizado" });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: "No se pudo actualizar el user" });
    }
});
// GET PETS AROUND ME // el lat y lng van a venir del query string
app.get("/pets-around-me", async (req, res) => {
    const { lat, lng } = req.query;
    try {
        const found = await (0, pets_controller_1.getpetsAroundMe)(lat, lng);
        res
            .status(201)
            .json({ found, message: "Se han encontrado estos registros" });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({ error: "Hubo un error al recuperar los registros" });
    }
});
// CREATE PETS ---> /pet o /pet/:petId?
app.post("/pets", middleware_1.authMiddleware, async (req, res) => {
    try {
        const { userId } = req.body;
        /* const { userId } = req.query; */
        const petCreated = await (0, pets_controller_1.createPet)(userId, req.body); //RESPETAR EL ORDEN DE LOS ARGUMENTOS!!!!
        res.status(201).json({
            petCreated,
            message: "Se ha creado el registro de la mascota",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .send({ error: "No se pudo crear el registro de la mascota" });
    }
});
// CREATE REPORTS
app.post("/report-pet-info", async (req, res) => {
    try {
        const { petId } = req.query;
        const reportPetInfo = await (0, reports_controller_1.createReport)(petId, req.body);
        res.status(201).json({
            reportPetInfo,
            message: "Se ha enviado el reporte de la mascota",
        });
    }
    catch (error) {
        console.log(error);
        res
            .status(400)
            .send({ error: "No se pudo enviar el reporte de la mascota" });
    }
});
// UPDATE PET DATA
app.patch("/pets/update", middleware_1.authMiddleware, async (req, res) => {
    try {
        const { petId } = req.query;
        const update = await (0, pets_controller_1.updatePetData)(req.body, petId);
        res.status(200).send(update);
    }
    catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});
//REPORT PET AS FOUND
app.put("/pet-found", middleware_1.authMiddleware, async (req, res) => {
    const { petId } = req.query;
    try {
        const data = await (0, pets_controller_1.reportPetFound)(petId);
        res.json({ data, message: "Sucessfully updated to: FOUND" });
    }
    catch (error) {
        res.status(400);
        console.log(error);
    }
});
// DELETE PET REPORTS BY ID
app.delete("/pets", middleware_1.authMiddleware, async (req, res) => {
    try {
        const { petId } = req.query;
        if (!petId) {
            console.log("invalid");
            return res.status(400).json({ message: "invalid petId" });
        }
        const data = await (0, pets_controller_1.deletePetById)(petId);
        res.json({ data, message: "Resource sucessfully deleted" });
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});
//GET ALL PETS FROM USER
app.get("/pets", async (req, res) => {
    const userId = req.query.userId;
    const allPetsFromUser = await (0, pets_controller_1.getAllPetsByUser)(userId);
    res.json(allPetsFromUser);
});
//GET PETS BY ID
app.get("/get-pet-by-id", async (req, res) => {
    const petId = req.query.petId;
    const petData = await (0, pets_controller_1.getPetsById)(petId);
    res.json(petData);
});
// GET ALL USERS
app.get("/get-all-users", async (req, res) => {
    const allUsers = await (0, users_controller_1.getAllUsers)();
    res.json(allUsers);
});
// GET ALL PETS
app.get("/get-all-pets", async (req, res) => {
    const allPets = await (0, pets_controller_1.getAllPets)();
    res.json(allPets);
});
///////////////////// PATH AND LISTEN PORT /////////////////////////////
app.use(express_1.default.static("dist"));
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "../dist/index.html"));
});
app.listen(port, () => {
    console.log(`Server connected at 'http://localhost:${port}'`);
});
/*  PARA QUE SIRVA EL INDEX.HTML PERO TAMBIÉN TENGA EN CUENTA APARTE EL INDEX.JS */
const staticDirPath = path.resolve(__dirname, "../fe-dist");
app.use(express_1.default.static(staticDirPath));
app.get("*", function (req, res) {
    res.sendFile(staticDirPath + "/index.html");
});

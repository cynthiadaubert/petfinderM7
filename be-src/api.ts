import express from "express";
import * as path from "path";
import cors from "cors";
import { authMiddleware, checkBodyMiddleware } from "./lib/middleware";
import { createReport } from "./controllers/reports-controller";
import { getToken } from "./controllers/auth-controller";
import {
  createUser,
  findEmail,
  updateUserData,
  getAllUsers,
} from "./controllers/users-controller";
import {
  createPet,
  updatePetData,
  getAllPets,
  getAllPetsByUser,
  getpetsAroundMe,
  reportPetFound,
  deletePetById,
  getPetsById,
} from "./controllers/pets-controller";

const port = process.env.PORT || 5050;
const app = express();
app.use(express.json({ limit: "50mb" })); //para parsear el body completo
app.use(cors());

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

app.post("/signup", checkBodyMiddleware, async (req, res) => {
  const user = await createUser(req.body);
  try {
    res.status(201).json(user);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "No se pudo crear el user" });
  }
});

// SIGN IN-LOGIN

app.post("/auth", checkBodyMiddleware, async (req, res) => {
  try {
    const token = await getToken(req.body);
    if (token === null) {
      res.status(400).send();
    } else {
      res.status(201).json(token);
    }
  } catch (error) {
    console.log(error);
  }
});

// FIND EMAIL

app.get("/check-email", async (req, res) => {
  try {
    const email = await findEmail(req.query.email);
    if (email == null) {
      res.status(400).send({ error: "No se ha encontrado el email" });
    } else {
      res.status(201).json({ email, message: "Email verified" });
    }
  } catch (error) {
    console.log(error);
  }
});

// UPDATE USER DATA
app.patch(
  "/users/update",
  checkBodyMiddleware,
  authMiddleware,
  async (req, res) => {
    const { userId } = req.query;
    try {
      const update = await updateUserData(req.body, userId);
      res.status(201).json({ update, message: "User actualizado" });
    } catch (error) {
      console.log(error);
      res.status(400).send({ error: "No se pudo actualizar el user" });
    }
  }
);

// GET PETS AROUND ME // el lat y lng van a venir del query string
app.get("/pets-around-me", async (req, res) => {
  const { lat, lng } = req.query;
  try {
    const found = await getpetsAroundMe(lat, lng);
    res
      .status(201)
      .json({ found, message: "Se han encontrado estos registros" });
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Hubo un error al recuperar los registros" });
  }
});

// CREATE PETS ---> /pet o /pet/:petId?
app.post("/pets", authMiddleware, async (req, res) => {
  try {
    const { userId } = req.body;
    /* const { userId } = req.query; */
    const petCreated = await createPet(userId, req.body); //RESPETAR EL ORDEN DE LOS ARGUMENTOS!!!!
    res.status(201).json({
      petCreated,
      message: "Se ha creado el registro de la mascota",
    });
  } catch (error) {
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
    const reportPetInfo = await createReport(petId, req.body);
    res.status(201).json({
      reportPetInfo,
      message: "Se ha enviado el reporte de la mascota",
    });
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send({ error: "No se pudo enviar el reporte de la mascota" });
  }
});

// UPDATE PET DATA
app.patch("/pets/update", authMiddleware, async (req, res) => {
  try {
    const { petId } = req.query;
    const update = await updatePetData(req.body, petId);
    res.status(200).send(update);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

//REPORT PET AS FOUND
app.put("/pet-found", authMiddleware, async (req, res) => {
  const { petId } = req.query;
  try {
    const data = await reportPetFound(petId);
    res.json({ data, message: "Sucessfully updated to: FOUND" });
  } catch (error) {
    res.status(400);
    console.log(error);
  }
});

// DELETE PET REPORTS BY ID
app.delete("/pets", authMiddleware, async (req, res) => {
  try {
    const { petId } = req.query;
    if (!petId) {
      console.log("invalid");
      return res.status(400).json({ message: "invalid petId" });
    }
    const data = await deletePetById(petId);
    res.json({ data, message: "Resource sucessfully deleted" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//GET ALL PETS FROM USER
app.get("/pets", async (req, res) => {
  const userId = req.query.userId;
  const allPetsFromUser = await getAllPetsByUser(userId);
  res.json(allPetsFromUser);
});

//GET PETS BY ID
app.get("/get-pet-by-id", async (req, res) => {
  const petId = req.query.petId;
  const petData = await getPetsById(petId);
  res.json(petData);
});

// GET ALL USERS
app.get("/get-all-users", async (req, res) => {
  const allUsers = await getAllUsers();
  res.json(allUsers);
});
// GET ALL PETS
app.get("/get-all-pets", async (req, res) => {
  const allPets = await getAllPets();
  res.json(allPets);
});

///////////////////// PATH AND LISTEN PORT /////////////////////////////

app.use(express.static("dist"));

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log(`Server connected at 'http://localhost:${port}'`);
});

/*  PARA QUE SIRVA EL INDEX.HTML PERO TAMBIÉN TENGA EN CUENTA APARTE EL INDEX.JS */
const staticDirPath = path.resolve(__dirname, "../fe-dist");

app.use(express.static(staticDirPath));

app.get("*", function (req, res) {
  res.sendFile(staticDirPath + "/index.html");
});

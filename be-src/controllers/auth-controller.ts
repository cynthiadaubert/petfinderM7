import { Auth } from "../models";
import * as crypto from "crypto";
import * as jwt from "jsonwebtoken";
import "dotenv/config";
import { where } from "sequelize";
import { findEmail } from "./users-controller";

const SECRET = process.env.SECRET;

export function getSHA256ofString(text) {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export async function getToken(data) {
  const { email, password } = data;
  const hashed = getSHA256ofString(password);

  try {
    const auth = await Auth.findOne({
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
    } else {
      return null;
    }
  } catch (err) {
    console.log(err);
    throw err;
  }
}

/* Toma el argumento que contiene el email y pass, y este pass es hasheada para 
retornar el SHA. La función busca un record que coincida con email y el SHA.
El metodo findOne retorna una promesa que resuelve el record o devuelve null si
no hay uno. 

Si se encuentra un record se genera un JWT token pasandole un objeto con el id del
usuario y el SECRET. Entonces se retorna el token */

export async function updatePassword(newPassword, userId) {
  const hashed = getSHA256ofString(newPassword);
  try {
    return await Auth.update(
      { password: hashed },
      { where: { user_Id: userId } } // <--- PUSE where userId y era user_Id WAAAAAAAAAAAHHHH
    );
  } catch (err) {
    console.log(err);
    throw err;
  }
}

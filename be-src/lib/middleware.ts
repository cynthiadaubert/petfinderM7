import * as jwt from "jsonwebtoken"; // agregar @types para que se importe correctamente

export function authMiddleware(req, res, next) {
  const token = req.headers.authorization.split(" ")[1]; // verifica que el token sea autentico separando el token del "bearer"
  try {
    const data = jwt.verify(token, process.env.SECRET);
    req._user = data; // si el verify funciona, nos guarda los datos en esta propiedad custom de req - después la podemos acceder con otro handler, o middleware
    next(); // se ejecuta el siguiente middleware
  } catch (err) {
    res.status(401).json({ error: true, message: "El token es inválido" });
  }
}

export async function checkBodyMiddleware(req, res, next) {
  // chequea que nos pasen bien el body, porque si hay algún string vacío, el método createUser nos va a dar errores
  const hasValue =
    Object.values(req.body).filter((e) => {
      return e !== "";
    }).length >= 1;

  if (hasValue) {
    next();
  } else {
    res.status(401).send({ error: "El body está vacío o incompleto" });
  }
}

/* hasValue agarra el objeto reqbody y lo cambia a un array, después lo filtra para ver si el string no está vacío,
y chequea que el lenght sea igual o mayor a uno. Si es mayor a 1 quiere decir que hay data y que no está vacío,
entonces pasa a la siguiente función */

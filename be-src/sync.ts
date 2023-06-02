import { sequelize } from "./models/connection";
import { User, Pet, Auth, Report } from "./models";

/* sequelize.sync({ alter: true }).then((res) => console.log(res)); */

// podemos usar el force si necesitamos resetear la base por completo
// sequelize.sync({ force: true }).then((res) => console.log(res));
/* 
User.sync({ alter: true })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
  })
  .catch((error) => {
    console.log("Error al sincronizar la base de datos:", error);
  }); */
/*  
Auth.sync({ alter: true })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
  })
  .catch((error) => {
    console.log("Error al sincronizar la base de datos:", error);
  });
 */

Pet.sync({ alter: true })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
  })
  .catch((error) => {
    console.log("Error al sincronizar la base de datos:", error);
  });

/* 
Report.sync({ alter: true })
  .then(() => {
    console.log("Base de datos sincronizada correctamente.");
  })
  .catch((error) => {
    console.log("Error al sincronizar la base de datos:", error);
  }); 
 */
// Eliminar la tabla existente
/* sequelize
  .drop()
  .then(() => {
    // Crear la tabla con la nueva definición del modelo
    User.sync({ force: true });
    return sequelize.sync({ force: true });
  })
  .then(() => {
    console.log("Tabla creada correctamente");
  })
  .catch((error) => {
    console.error("Error al crear la tabla:", error);
  }); */

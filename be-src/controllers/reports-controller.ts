import { Report, Pet, User } from "../models";

import { sgMail } from "../lib/sendgrid";

export async function createReport(petId: number, data: any) {
  try {
    const petReport = await Pet.findByPk(petId);
    let userId = petReport.get("userId") as any;
    let userFromPet = await User.findByPk(userId);
    const recipient =
      /* "cynthiaperezdaubert@gmail.com"; */ userFromPet.get("email");
    const sender = "cynthia-g1993@hotmail.com";
    console.log("RECIPIENT DEL REPORT CONTROLLER", recipient);
    const createdReport = await Report.create({
      petId,
      username: data.username,
      phone: data.phone,
      comments: data.comments,
    }); // el reporte se va a crear en la database, después se le van a entregar esos datos al text para el método .send()
    console.log("REPORTE CREADO", createdReport);
    const message = {
      to: `${recipient}`, ////MODIFICAR EL FORMATO HTML Y OBTENER EL NOMBRE DEL PET CORRESPONDIENTE
      from: `${sender}`,
      subject: `PETFINDER APP: Se ha reportado información de ${data.petname}.`,
      html: `<h1 style="font-size: 16px;"><strong>De:</strong> ${data.username}</h1>
          <h1 style="font-size: 16px;"><strong>Teléfono:</strong> ${data.phone}</h1>
          <h1 style="font-size: 16px;"><strong>Reporte:</strong> ${data.comments}</h1>
         `,
    };
    sgMail
      .send(message)
      .then(() => {
        console.log("Se ha enviado el email");
      })
      .catch((error) => {
        console.error(error);
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

export async function getReports() {
  return Report.findAll({});
}

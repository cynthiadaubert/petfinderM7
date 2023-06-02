"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReports = exports.createReport = void 0;
const models_1 = require("../models");
const sendgrid_1 = require("../lib/sendgrid");
async function createReport(petId, data) {
    try {
        const petReport = await models_1.Pet.findByPk(petId);
        let userId = petReport.get("userId");
        let userFromPet = await models_1.User.findByPk(userId);
        const recipient = 
        /* "cynthiaperezdaubert@gmail.com"; */ userFromPet.get("email");
        const sender = "cynthia-g1993@hotmail.com";
        console.log("RECIPIENT DEL REPORT CONTROLLER", recipient);
        const createdReport = await models_1.Report.create({
            petId,
            username: data.username,
            phone: data.phone,
            comments: data.comments,
        }); // el reporte se va a crear en la database, después se le van a entregar esos datos al text para el método .send()
        console.log("REPORTE CREADO", createdReport);
        const message = {
            to: `${recipient}`,
            from: `${sender}`,
            subject: `PETFINDER APP: Se ha reportado información de ${data.petname}.`,
            html: `<h1 style="font-size: 16px;"><strong>De:</strong> ${data.username}</h1>
          <h1 style="font-size: 16px;"><strong>Teléfono:</strong> ${data.phone}</h1>
          <h1 style="font-size: 16px;"><strong>Reporte:</strong> ${data.comments}</h1>
         `,
        };
        sendgrid_1.sgMail
            .send(message)
            .then(() => {
            console.log("Se ha enviado el email");
        })
            .catch((error) => {
            console.error(error);
        });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.createReport = createReport;
async function getReports() {
    return models_1.Report.findAll({});
}
exports.getReports = getReports;

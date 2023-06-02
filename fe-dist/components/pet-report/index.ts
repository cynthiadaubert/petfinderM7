import { Router } from "@vaadin/router";
import { sgMail } from "../../../be-src/lib/sendgrid";
import { state } from "../../../be-src/state";

const crossImg = require("url:../../img/cross.png");

export class ReportFormComp extends HTMLElement {
  shadow: ShadowRoot;
  id: string;
  name: string;
  static outerHTML: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const cs = state.getState();

    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "pet_report_card";

    const petname = localStorage.getItem("current-pet");

    div.innerHTML = `
  
    <img  class="cross" src=${crossImg}>
    <div class="report_title">Reportar info de ${petname}</div>

    <form id="report-form">
      <label for="name">NOMBRE</label>
      <input type="text" id="name" name="name" required>

      <label for="phone">TELÉFONO</label>
      <input type="tel" id="phone" name="phone" required>

      <label for="comments">¿DÓNDE LO VISTE?</label>
      <textarea id="comments" name="comments"></textarea>

      <button type="submit">Enviar información</button>
    </form>
     `;

    style.innerHTML = `
    
    .pet_report_card {
      position: fixed;
      width: 314px;
      height: max-content;
      background-color: #26302E;
      border-radius: 10px;
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin: 35px 0px 0px 35px;
      top: 0;
      left: 0;
    }

    .report_title {
      font-style: bolder;
      font-weight: 800px;
      font-size: 36px;
      color: #ffffff;
      text-align: center;
      margin: 0 auto;
      padding-top: 35px;
    }

    form {
      display: flex;
      flex-direction: column;
      margin: 0 auto;

    }

    button {
      background-color: #00A884;
      border-radius: 4px;
      width: 276px;
      height: 50px;
      color: #ffffff;
      font-size: 20px;
      border: none;
      font-style: bolder;
      font-weight: 700px;
      margin-bottom: 30px;
    }

    input {
      background-color: #4A5553;
      width: 275px;
      height: 50px;
      border-radius: 4px;
      border: none;
    }

    textarea {
      background-color: #4A5553;
      width: 275px;
      height: 130px;
      border-radius: 4px;
      border: none;
      margin-bottom: 20px;
    }

    label {
      color: #ffffff;
      font-size: 16px;
      text-align: left;
      margin-top: 25px; 
    }
            
    .cross {
      width: 16px;
      height: 16px;
      margin: 15px 15px 15px 15px;
      padding: 0;
      position: absolute; 
      top: 0; 
      right: 0;
    }

          `;

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);

    //CERRAR VENTANA
    /*     const crossButton = div.querySelector(".cross");
    const petReport = div.querySelector(".pet_report_card");

    crossButton?.addEventListener("click", function () {
      div.style.display = "none";
    }); */

    // ENVIAR EMAIL --- ignorar este snippet, el mail lo envia pets around me card
    /* 
    const form = document.getElementById("report-form") as HTMLFormElement;
    form?.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target["name"].value;
      const phone = target["phone"].value;
      const comments = target["comments"].value;

      let data = {
        petName: this.name,
        userName: name,
        userPhone: phone,
        reportComments: comments,
      };

      if (data.userName && data.userPhone && data.reportComments) {
        try {
          state.createReport(data, this.id).then(() => {
            console.log("Gracias por aportar información");
          });
        } catch (err) {
          console.error("Error al enviar el mensaje", err);
        }
      } else {
        alert("Por favor, complete los datos faltantes");
        return;
      }
      console.log(name, phone, comments);
    }); */
  }
}
customElements.define("reportform-comp" as any, ReportFormComp);

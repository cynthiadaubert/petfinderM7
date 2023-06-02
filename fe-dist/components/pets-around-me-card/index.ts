import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

const report = require("url:../../img/report-button.png");
const noImage = require("url:../../img/no_image.png");
const crossImg = require("url:../../img/cross.png");
const foundImage = require("url:../../img/pet-found.png");

export class PetsAroundMeComp extends HTMLElement {
  shadow: ShadowRoot;
  static outerHTML: any;
  petData: any; // seteamos esta propiedad para que exista primero y Typescript la pueda manipular después
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();

    const cs = state.getState();
    const array = cs.petsAroundMeList.found;
    const newArray = array.sort((a, b) => a.id - b.id); // le hacemos un sort para que ordene el array según el id, osea, según el orden de creación
    const arrayByStatus = newArray.sort((a, b) => a.found - b.found);

    this.petData = arrayByStatus;

    const petList = this.petData
      .map((pet) => {
        const { name, pictureURL, reportLocation, id } = pet;

        let imageSrc = pictureURL || noImage; // va a usar pictureURL si está disponible, sino va a usar noImage

        let options; // va a chequear si muestra el botón editar o encontrado:

        let f;

        if (pet.found == true) {
          options = foundImage;
          f = `<img src=${options}>`;
        } else {
          options = report;
          f = `<img class="button_report" src=${options}>`;
        }

        return `
        <div class="pet_info">
        <img class="pet_img" src=${imageSrc}>
        <div class="container">
          <div class="text_container">
            <div id="pet_name_id" class="pet_name">${name}</div>
            <div class="pet_location">${reportLocation}</div>
          </div>
          ${f}
        </div> 
        
          
      <div class="report_main" style="display:none;">
        <img  class="cross" src=${crossImg}>
        <div class="report_title">Reportar info de ${name}</div>
  
        <form id="report-form">
          <div id="petnum" class="petid" style="display:none;">${id}</div>
          <div class="petname" style="display:none;">${name}</div>
          <label for="name">NOMBRE</label>
          <input type="text" id="name" name="name" required>
  
          <label for="phone">TELÉFONO</label>
          <input type="tel" id="phone" name="phone" required>
  
          <label for="comments">¿DÓNDE LO VISTE?</label>
          <textarea id="comments" name="comments"></textarea>
  
          <button type="submit">Enviar información</button>
        </form>
      </div>
  
     
        </div>
         `;
      })
      .join("");

    // en el report form comp, si usamos un id en lugar de un class, solamente va a tomar el primer elemento porque es un identificador único

    this.shadow.innerHTML = `
        
          ${petList}
       
        `;

    const style = document.createElement("style");

    style.innerHTML = `
        
        .pet_info {
            width: 335px;
            height: max-content;
            background-color: #26302E;
            display: flex;
            flex-direction: column;
            align-items: center;
            margin: 25px 0px 25px 0px;
            padding: 0;
            box-shadow: 0px 1px 4px 0px #00000040;
            border-radius: 4px;
          }
    
          .button_report {
            width: 120px;
            height: 40px;
          }
    
          .pet_img {
            width: 320px;
            height: 220px;
            background-color: red;
            margin: 7px 8px 0px 8px;
            object-fit: cover;
          }
    
          .container {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            width: 305px;
            height: max-content;
            padding-top: 15px;
          }
                
          .pet_name {
            font-size: 36px;
            color: #ffffff;
            font-weight: 700px;
            font-style: bolder;
          }
    
          .pet_location {
            font-size: 16px;
            color: #ffffff;
            font-weight: 700px;
            font-style: bolder;
            margin-bottom: 10px;
          }
  
          .report_main {
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
            margin-left: 20px; 
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
  
          input, textarea {
            font-size: 20px;
          }
  
  
              `;

    this.shadow.appendChild(style);

    //ABRIR Y CERRAR VENTANA DE REPORTE

    const crossButtons = this.shadow.querySelectorAll(".cross") as any;
    const repButtons = this.shadow.querySelectorAll(".button_report") as any;
    const reportForms = this.shadow.querySelectorAll(".report_main") as any;

    crossButtons.forEach((button, i) => {
      button.addEventListener("click", () => {
        reportForms[i].style.display = "none";
      });
    });

    if (repButtons) {
      repButtons.forEach((button, i) => {
        button.addEventListener("click", () => {
          reportForms[i].style.display = "block";
        });
      });
    }

    // Por cada elemento button_report le agregamos un addeventlistener para el evento click
    // pasamos el parámetro button e index, o sea, el índice del elemento button report actual
    // el [i] nos sirve para matchear cada boton con su correspondiente componente report-form

    // ENVIAR EMAIL
    // como genero múltiples instancias del form dentro del loop dinámicamente, necesito appendear el event listener a cada from individual separadamente.

    const forms = this.shadow.querySelectorAll(
      "#report-form"
    ) as NodeListOf<HTMLFormElement>;

    forms.forEach((form) => {
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const target = e.target as any;
        const name = target["name"].value;
        const phone = target["phone"].value;
        const comments = target["comments"].value;
        const petIdElem = target.querySelector(".petid");
        const petName = target.querySelector(".petname").textContent;

        const id = petIdElem ? petIdElem.textContent : "";

        const data = {
          id: id,
          petname: petName,
          username: name,
          phone: phone,
          comments: comments,
        };

        if (data.username && data.phone && data.comments) {
          try {
            state.createReport(data, data.id).then(() => {
              alert("Gracias por aportar información");
              location.reload();
            });
          } catch (err) {
            console.error("Error al enviar el mensaje", err);
          }
        } else {
          alert("Por favor, complete los datos faltantes");
          return;
        }

        console.log("DATOS DEL FORM ENVIADO", data, petName);
      });
    });
  }

  render() {}
}
customElements.define("petsaroundme-comp" as any, PetsAroundMeComp);

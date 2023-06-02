import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

const edit = require("url:../../img/edit_button.png");
const noImage = require("url:../../img/no_image.png");
const foundImage = require("url:../../img/pet-found.png");

export class myReportsComp extends HTMLElement {
  shadow: ShadowRoot;
  static outerHTML: any;
  petData: any; // seteamos esta propiedad para que exista primero y Typescript la pueda manipular después
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const cs = state.getState();
    const array = cs.petsFromUser;
    const newArray = array.sort((a, b) => a.id - b.id);
    this.petData = newArray;

    const petList = this.petData
      .map((pet) => {
        const { name, pictureURL, reportLocation, id } = pet;

        let imageSrc = pictureURL || noImage;

        let options;

        let f;

        if (pet.found == true) {
          options = foundImage;
          f = `<img src=${options}>`;
        } else {
          options = edit;
          f = `<img class="button_edit" src=${options}>`;
        }

        return `
      <div class="pet_info">
      <img class="pet_img" src=${imageSrc}>
      <div class="container">
        <div class="text_container">
          <div class="pet_name">${name}</div>
          <div class="pet_location">${reportLocation}</div>
        </div>
        ${f}
        <div class="petid" style="display:none;">${id}</div>
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
  
        .button_edit {
          width: 110px;
          height: 40px;
        }
  
        .pet_img {
          width: 320px;
          height: 126px;
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

    /*  this.shadow.appendChild(div); */
    this.shadow.appendChild(style);

    //MOSTRAR FORM

    const containers = this.shadow.querySelectorAll(".container") as any;

    if (containers) {
      containers.forEach((container) => {
        const editButtons = container.querySelector(".button_edit") as any;
        const petId = container.querySelector(".petid").textContent;
        if (editButtons) {
          editButtons.addEventListener("click", async () => {
            try {
              await state.getPetDataById(petId);
              Router.go("/reports/edit");
            } catch (error) {
              console.error("Error fetching pet data:", error);
            }
          });
        }
      });
    }
  }

  render() {}
}
customElements.define("myreports-comp" as any, myReportsComp);

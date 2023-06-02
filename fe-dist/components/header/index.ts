import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

const logo = require("url:../../img/logo_pets.png");
const lines = require("url:../../img/menu.png");
const cross = require("url:../../img/cross.png");

export class headerComp extends HTMLElement {
  shadow: ShadowRoot;
  static outerHTML: any;
  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const userEmail = state.data.userEmail;

    const div = document.createElement("div");
    const style = document.createElement("style");
    div.className = "petlogo";

    div.innerHTML = `
  
          <img class="logo" src=${logo}>
          <img class="lines" src=${lines}>
          

          <div class="nav-hamburger">
            <img  class="cross_close" src=${cross}>
            <div class="links">
              <a href="" class="my-data-link">Mis datos</a>
              <a href="" class="my-pets-link">Mis mascotas reportadas</a>
             <a href="" class="report-link">Reportar mascota</a>
             <h2 class="userEmail">${userEmail}<h2>
             <a href="#" class="logout">CERRAR SESIÓN</a>
             </div>
          </div>
  
     `;

    style.innerHTML = `
    
    .petlogo {
        width: 335px;
        height: 60px;
        background-color: #26302E;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 10px 20px;
        margin: 0;
      }

    .logo {
            width: 50px;
            height: 50px;
            margin: 0;
            padding: 0;
    }

    .lines {
            width: 30px;
            height: 30px;
            margin: 0;
            padding: 0;
    }

    .cross_close {
            width: 25px;
            height: 25px;
            margin: 25px 25px;
            padding: 0;
           position: absolute;
           top: 0;
           right: 0;
    }

    .nav-hamburger {
      display: none;
      background-color: #26302E;
      width: 375px;
      height: 732px;
      position: absolute;
      justify-content: center;
      padding: 0;
      margin: 0;
      top: 0;
      bottom: 0;
      left: 0;
      z-index: 9999; 
    }

    .links {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 150px 0px 150px 0px;
    }

    a {
      text-decoration: none;
      font-size: 32px;
      text-align: center;
      font-weight: 700px;
      font-style: bolder;
      color: #EEEEEE;
      margin: 50px; 0px 50px; 0px;
    }

    .userEmail {
      color: #ffffff;
    }

    .logout{
      color: #3B97D3;
      font-size: 16px;
      text-decoration-line: underline;
    }
            
          `;

    const linesElem = div.querySelector(".lines"); // no encontraba el elemento porque estaba haciendo document.querySelector
    const menuElem = div.querySelector(".nav-hamburger") as any;
    const crossElem = div.querySelector(".cross_close") as any;
    const logoElem = div.querySelector(".logo") as any;
    const logoutElem = div.querySelector(".logout") as any;
    const myData = div.querySelector(".my-data-link") as any;
    const myPets = div.querySelector(".my-pets-link") as any;
    const reportLink = div.querySelector(".report-link") as any;

    myData.addEventListener("click", () => {
      if (userEmail) {
        Router.go("/profile");
      } else {
        Router.go("/signin");
      }
    });

    myPets.addEventListener("click", () => {
      if (userEmail) {
        Router.go("/my-reports");
      } else {
        Router.go("/signin");
      }
    });
    reportLink.addEventListener("click", () => {
      if (userEmail) {
        Router.go("/reports");
      } else {
        Router.go("/signin");
      }
    });

    if (!userEmail) {
      logoutElem.style.display = "none";
    }

    if (linesElem) {
      linesElem.addEventListener("click", () => {
        menuElem.style.display = "inherit";
      });
    }

    if (crossElem) {
      crossElem.addEventListener("click", () => {
        menuElem.style.display = "none";
      });
    }

    logoElem.addEventListener("click", () => {
      Router.go("./home");
    });

    logoutElem.addEventListener("click", () => {
      localStorage.removeItem("pets-state");
      Router.go("/home");
      setTimeout(() => {
        location.reload();
        console.log("listo");
      }, 1000);
    });

    this.shadow.appendChild(div);
    this.shadow.appendChild(style);
  }
}
customElements.define("header-comp" as any, headerComp);

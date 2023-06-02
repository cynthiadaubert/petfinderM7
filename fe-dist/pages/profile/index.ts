import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

export class ProfilePage extends HTMLElement {
  connectedCallback() {
    this.render();

    const cs = state.getState();

    if (cs.authenticated == false) {
      Router.go("/signin");
    }
  }

  render() {
    this.innerHTML = `
    <div class="box">
    <header-comp></header-comp>
      <h1 class="title">Mis datos</h1>
        <button type="submit" class="data">Modificar datos personales</button>
        <button type="submit" class="pass">Modificar contraseña</button>
        </p><div class="link">CERRAR SESIÓN</div>
     </div>
      `;

    //////// ESTILOS //////////

    const style = document.createElement("style");
    style.innerHTML = `

    .box {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: max-content;
    }

    .title {
      font-size: 42px;
      text-align: center;
      width: 287px;
      height: 48px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #000000;
      margin-top: 50px;
      padding-bottom: 20px;
    }

    .label-txt {
        text-align: left;
        width: 335px;
        margin-top: 25px;
    }

    .email-input {
        width: 335px;
        height: 50px;
        background-color: #FFFFFF;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        border: none;
        border-radius: 4px;
    }

    .submit {
        background-color: #5A8FEC;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 25px 0px 25px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    .data {
        background-color: #5A8FEC;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 170px 0px 25px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    .pass {
        background-color: #5A8FEC;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 0px 0px 100px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    .link {
        color: #5A8FEC;
        text-decoration: underline;
        margin: 25px 0px 80px 3px;
    }

    `;

    this.appendChild(style);

    const dataButton = document.querySelector(".data");
    const passButton = document.querySelector(".pass");
    const logoutElem = document.querySelector(".link") as any;

    dataButton?.addEventListener("click", () => {
      Router.go("/profile/account");
    });
    passButton?.addEventListener("click", () => {
      Router.go("/profile/password");
    });

    logoutElem.addEventListener("click", () => {
      localStorage.removeItem("pets-state");
      Router.go("/home");
      setTimeout(() => {
        location.reload();
        console.log("listo");
      }, 1000);
    });
  }
}
customElements.define("profile-menu", ProfilePage);

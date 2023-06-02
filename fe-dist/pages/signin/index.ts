import { Router } from "@vaadin/router";
const img = require("url:../../img/login.png");
import { state } from "../../../be-src/state";

export class SigninPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="box">
      <header-comp></header-comp>
          <img class="login" src=${img}>
          <h1 class="title">Ingresar</h1>
          <p class="subtitle">Ingresá tu email para continuar.</p>
       
            <form class="form">
                <label for="email-input" class="label"><div class="label-txt">EMAIL</div></label>
                <input type="email" class="email-input" name="email" required>
                <button type="submit" class="submit">Siguiente</button>
            </form>
            <div class="register"><p>¿Aún no tenés cuenta? </p><div class="link"><a href="/signup">Registrate.</a></div></div>
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
      height: 100vh;
    }

    .login{
      padding: 44px 0px 30px 0px;
    }

    .title {
      font-size: 36px;
      text-align: center;
      width: 287px;
      height: 48px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #000000;
      padding-bottom: 25px;
    }

    .subtitle {
      font-size: 16px;
      font-family: Roboto;
      margin: 0;
      padding-bottom: 34px;
      text-align: center;
    }

    form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        text-align: left;
    }

    .label-txt {
        text-align: left;
        width: 335px;
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

    .register {
        display: inherit;
        width: 250px;
        margin-bottom: 30px;
    }

    .link {
        margin-left: 3px;
        color: #5A8FEC;
        text-decoration: underline;
    }

    `;

    this.appendChild(style);

    const form = this.querySelector(".form") as any;
    const cs = state.getState();

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const emailData = target["email"].value;
      /*       cs.userEmail = emailData;
      state.setState(cs); */

      state.checkEmail(emailData);
    });
  }
}
customElements.define("signin-page", SigninPage);

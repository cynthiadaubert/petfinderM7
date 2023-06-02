import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

export class Auth2Page extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="box">
      <header-comp></header-comp>
      <h1 class="title">Iniciar sesión</h1>
      <p class="subtitle">Ingresá los siguientes datos para iniciar sesión</p>
   
        <form class="form">
            <label for="email-input" class="label"><div class="label-txt">EMAIL</div></label>
            <input type="email" id="email" class="email-input" name="email" required>
            <label for="password-input" class="label"><div class="label-txt">CONTRASEÑA</div></label>
            <input type="password" id="pass" class="pass-input" name="password" required>
            <button type="submit" class="enviar">Acceder</button>
        </form>
        </p><div class="link">Olvidé mi contraseña</div>
        
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

    .login{
      padding: 44px 0px 30px 0px;
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
      padding-bottom: 25px;
    }

    .subtitle {
      font-size: 16px;
      font-family: Roboto;
      margin-top: 25px;
      padding-bottom: 70px;
      text-align: center;
      width: 266px;
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
        margin-top: 25px;
    }

    .email-input, 
    .pass-input {
        width: 335px;
        height: 50px;
        background-color: #FFFFFF;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        border: none;
        border-radius: 4px;
    }

    .enviar {
        background-color: #5A8FEC;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 50px 0px 25px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    .sign {
        display: inherit;
        width: fit-content;
        margin: 30px 0px 30px 0px;
    }

    .link {
        color: #5A8FEC;
        text-decoration: underline;
        margin: 25px 0px 30px 3px;
    }

    `;

    this.appendChild(style);

    // AUTOFILL PARA EL EMAIL
    const emailInput = document.getElementById("email") as any;
    if (state.data.userEmail) {
      emailInput.value = state.data.userEmail;
    }

    // CHEQUEA LA CONTRASEÑA

    const form = this.querySelector(".form") as any; // LO VA A BUSCAR DENTRO DEL SCOPE DEL CONTEXTO "THIS"

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const password = target["password"].value;
      const cs = state.getState();

      if (!password) {
        alert("Por favor, ingrese la contraseña");
        return;
      } else {
        state.signIn(password);
      }
    });
  }
}
customElements.define("auth2-page", Auth2Page);

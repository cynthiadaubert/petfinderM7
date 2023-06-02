import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

export class SignupPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
    <div class="box">
    <header-comp></header-comp>
      <h1 class="title">Registrarse</h1>
      <p class="subtitle">Ingresá los siguientes datos para realizar el registro</p>
   
        <form class="form">
            <label for="email-input" class="label"><div class="label-txt">EMAIL</div></label>
            <input type="email" class="email-input" name="email" required>
            <label for="password-input" class="label"><div class="label-txt">CONTRASEÑA</div></label>
            <input type="password" class="email-input" name="password" required>
            <label for="password-input" class="label"><div class="label-txt">CONFIRMAR CONTRASEÑA</div></label>
            <input type="password" class="email-input" name="repeat-password" required>
            <button type="submit" class="submit">Siguiente</button>
        </form>
        <div class="sign"><p>¿Ya tenés una cuenta? </p><div class="link"><a href="/signin">Iniciar sesión</a>.</div></div>
        
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
      padding-bottom: 34px;
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

    .sign {
        display: inherit;
        width: fit-content;
        margin: 30px 0px 30px 0px;
    }

    .link {
        margin-left: 3px;
        color: #5A8FEC;
        text-decoration: underline;
    }

    `;

    this.appendChild(style);

    const form = this.querySelector(".form") as any;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const emailData = target["email"].value;
      const passwordData = target["password"].value;
      const confirmPasswordData = target["repeat-password"].value;

      const data = {
        email: emailData,
        password: passwordData
      } 

     if (passwordData !== confirmPasswordData) { 
        alert("La contraseña no coincide");
        return;
      } else {
        state.signUp(data); 
      } 
    });
  }
}

customElements.define("signup-page", SignupPage);

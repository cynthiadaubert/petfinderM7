import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

export class PasswordPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const cs = state.getState();

    this.innerHTML = `
    <div class="box">
    <header-comp></header-comp>
      <h1 class="title">Contraseña</h1>
        <form class="form">
            <label for="password" class="pass">CONTRASEÑA ACTUAL</label>
            <input type="password" class="oldpass-input" id="oldpass" name="old-password">
            <label for="password" class="pass">CONTRASEÑA NUEVA</label>
            <input type="password" class="pass-input" id="password" name="password">
            <label for="password" class="pass">CONFIRMAR CONTRASEÑA</label>
            <input type="password" class="pass-input" id="new-password" name="confirm-password">
          <button type="submit" class="submit">Guardar</button>
        </form>
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
      width: 301px;
      height: 99px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #000000;
      margin-top: 50px;
      margin-bottom: 30px;
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
        margin: 80px 0px 60px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: left;
  }

  .pass-input,
  .oldpass-input {
    width: 335px;
    height: 50px;
    background-color: #FFFFFF;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
    border: none;
    border-radius: 4px;
  }

  .pass {
    text-align: left;
    width: 335px;
    margin-top: 25px;
  }

    .link {
        color: #5A8FEC;
        text-decoration: underline;
        margin: 25px 0px 80px 3px;
    }

    `;

    this.appendChild(style);

    const passInput = document.getElementById("oldpass") as any;
    passInput.value = "asdfghjklñasdfghjkl";

    // GUARDAR NUEVA CONTRASEÑA

    const form = document.querySelector(".form") as any;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const pass = target["password"].value;
      const confirmPass = target["confirm-password"].value;

      if (pass == confirmPass) {
        const data = {
          password: pass,
          userId: cs.userId,
        };
        state.updateUser(data);
      } else {
        alert("Los campos no coinciden");
        return;
      }
    });
  }
}
customElements.define("password-page", PasswordPage);

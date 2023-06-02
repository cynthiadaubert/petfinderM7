import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

export class ProfileAccountPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const cs = state.getState();

    this.innerHTML = `
    <div class="box">
    <header-comp></header-comp>
      <h1 class="title">Datos personales</h1>
        <form class="form">
          <label for="email-input" class="label"><div class="label-txt">NOMBRE</div></label>
          <input type="text" id="name" class="email-input" name="name" required>
          <label for="geoloc-input" class="label"><div class="label-txt">LOCALIDAD</div></label>
          <input type="text" id="location" class="email-input" name="email" required>
          <button type="submit" class="submit">Guardar</button>
        </form>
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
      width: 301px;
      height: 99px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #000000;
      margin-top: 50px;
      margin-bottom: 90px;
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

    form {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: left;
  }

    .link {
        color: #5A8FEC;
        text-decoration: underline;
        margin: 25px 0px 80px 3px;
    }

    `;

    this.appendChild(style);

    const logOut = document.querySelector(".link");

    logOut?.addEventListener("click", () => {
      //eliminar localstorage
      Router.go("/home");
    });

    // AUTOFILL PARA DATOS
    const nameInput = document.getElementById("name") as any;
    const locationInput = document.getElementById("location") as any;
    if (cs.userName && cs.userLocation) {
      nameInput.value = cs.userName;
      locationInput.value = cs.userLocation;
    }

    // GUARDAR NUEVOS DATOS

    const form = document.querySelector(".form") as any;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const target = e.target as any;
      const name = target["name"].value;
      const location = target["location"].value;

      const data = {
        name: name,
        location: location,
      };
      console.log(data);

      cs.userLocation = location;
      cs.userName = name;

      state.setState(cs);
      state.updateUser(data);
    });

    //LOGOUT
    const logoutElem = document.querySelector(".link") as any;
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
customElements.define("account-page", ProfileAccountPage);

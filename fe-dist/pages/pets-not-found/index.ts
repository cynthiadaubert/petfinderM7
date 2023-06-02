import { Router } from "@vaadin/router";
const img = require("url:../../img/empty.png");

export class NotFoundPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="box">
      <header-comp></header-comp>
          <h1 class="title">Mascotas reportadas</h1>
          <p class="subtitle">No se encontraron mascotas cerca de tu ubicación.</p>
          <img class="empty" src=${img}>
            <button type="submit" class="submit">Publicar reporte</button>
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

    .empty{
      padding: 44px 0px 30px 0px;
    }

    .title {
      font-size: 42px;
      text-align: center;
      width: 334px;
      height: 95px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #000000;
      padding-bottom: 0px;
      margin-top: 50px;
    }

    .subtitle {
      font-size: 16px;
      font-family: Roboto;
      margin: 25px 15px 30px 15px;
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
        margin: 50px 0px 50px 0px;
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

    const publishButtn = document.querySelector(".submit");

    publishButtn?.addEventListener("click", () => {
      Router.go("./reports");
    });
  }
}
customElements.define("notfound-page", NotFoundPage);

import { state } from "../../../be-src/state";

export class HomePetsPage extends HTMLElement {
  connectedCallback() {
    this.render();

    state.subscribe(() => {
      this.render();
    });
  }

  render() {
    this.innerHTML = `
      <div class="box">
      <header-comp></header-comp>
          <h1 class="title">Mascotas perdidas cerca</h1>
          <petsaroundme-comp></petsaroundme-comp>
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
      width: 334px;
      height: 95px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #000000;
      margin-bottom: 40px;
      margin-top: 50px;
    }

    .subtitle {
      font-size: 16px;
      font-family: Roboto;
      height: 45px;
      width: 266px;
      margin-top: 25px;
      margin-bottom: 80px;
      text-align: center;
    }

    .upload-img {
        height: 234px;
        width: 335px;
        background-color: #e6d9d8;
        margin-top: 50px;
    }

    .upload-img2 {
        height: 234px;
        width: 335px;
        background-color: #e6d9d8;
        margin-top: 20px;
        margin-bottom: 60px;
    }


    `;

    this.appendChild(style);
  }
}
customElements.define("pets-page", HomePetsPage);

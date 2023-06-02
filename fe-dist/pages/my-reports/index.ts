import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";

export class MyReportsPage extends HTMLElement {
  connectedCallback() {
    this.render();
    /*     if (cs.petsFromUser.length == 0) {
      Router.go("/reports/empty");
    }
 */
    const cs = state.getState();
    if (cs.authenticated == false) {
      Router.go("/signin");
    }

    state.getPetsByUserId(cs.userId);
  }

  render() {
    this.innerHTML = `
      <div class="box">
      <header-comp></header-comp>
          <h1 class="title">Mis mascotas reportadas</h1>
          <myreports-comp></myreports-comp>
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
      padding-bottom: 0px;
      margin-top: 50px;
      margin-bottom: 50px;
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

    `;

    this.appendChild(style);
  }
}
customElements.define("my-reports", MyReportsPage);

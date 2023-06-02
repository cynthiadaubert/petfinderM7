import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";
const img = require("url:../../img/beach_day.png");

export class HomePage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <div class="box">
          <header-comp></header-comp>
          <img class="beach" src=${img}>
          <h1 class="title">Pet Finder App</h1>
          <p class="subtitle two"> -Mobile version only-</p>
          <p class="subtitle"> Encontrá y reportá mascotas perdidas cerca de tu ubicación</p>
          <button class="location">Dar mi ubicación actual</button>
          <button class="function">¿Cómo funciona petfinder?</button>
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

    .beach{
      padding: 30px 0px 50px 0px;
    }

    .title {
      font-size: 36px;
      text-align: center;
      width: 287px;
      height: 48px;
      font-style: bolder;
      line-weight: 800px;
      line-height: 54px;
      color: #EB6372;
      padding-bottom: 25px;
    }

    .subtitle {
      font-size: 24px;
      margin: 0;
      padding-bottom: 34px;
      text-align: center;
    }

    .location {
      background-color: #5A8FEC;
      font-family: Roboto;
      border:none;
      border-radius: 4px;
      height: 50px;
      width: 270px;
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 700;
      margin-bottom: 25px;
    }

    .function {
      background-color: #00A884;
      font-family: Roboto;
      border:none;
      border-radius: 4px;
      height: 50px;
      width: 270px;
      margin: 25px 0px 25px 0px;
      color: #FFFFFF;
      font-size: 16px;
      font-weight: 700;
    }

    .two {
      color: #EB6372;
      font-size: 16px;
    }

    .function {
      display: none;
    }

    `;

    this.appendChild(style);

    const cs = state.getState();

    const locationButton = document.querySelector(".location");
    locationButton?.addEventListener("click", (e) => {
      e.preventDefault();
      // usamos la geolocalización del navegador para guardar la ubicación del usuario
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            state.petsAroundMe(lat, lng);
            cs.currentUserLocation = [lat, lng];
            state.setState(cs);
            console.log(
              `User geolocation: Latitude: ${cs.currentUserLocation[0]}, Longitude: ${cs.currentUserLocation[1]}`
            );
          },
          (error) => {
            console.error(`Error getting geolocation: ${error}`);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }
    });
  }
}
customElements.define("home-page", HomePage);

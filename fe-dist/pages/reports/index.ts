import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";
import { initMap, geocoder } from "../../../be-src/lib/mapbox";
import mapboxgl from "mapbox-gl";
import Dropzone from "dropzone";

export class ReportPage extends HTMLElement {
  connectedCallback() {
    this.render();
    const cs = state.getState();

    if (cs.authenticated == false) {
      Router.go("/signin");
    }
  }

  render() {
    const cs = state.getState();

    // OBTENER GEOLOCALIZACIÓN POR DEFECTO
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          console.log(
            "User geolocation has been set: " + position.coords.latitude,
            position.coords.longitude
          );
          cs.currentUserLocation = [
            position.coords.latitude,
            position.coords.longitude,
          ];
          state.setState(cs);
        },
        function (error) {
          console.log("Error occurred. Error code: " + error.code);
        }
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }

    let lat;
    let lng;
    let reportAdress;

    if (!cs.currentUserLocation) {
      lat = -34.601102499999996;
      lng = -58.383111;
      console.log(
        "WARNING: Se está usando la ubicación por defecto y no la del usuario"
      );
    } else {
      lat = cs.currentUserLocation[0];
      lng = cs.currentUserLocation[1];
    }

    this.innerHTML = `
      <div class="box">
      <header-comp></header-comp>
          <h1 class="title">Reportar mascota</h1>
          <p class="subtitle">Ingresá la siguiente información para realizar el reporte de la mascota</p>
   
          <label for="email-input" class="label"><div class="label-txt">NOMBRE</div></label>
          <input type="text" class="text-input petname" name="name" required>
          
          <button id="submit" class="submit">Agregar foto</button>
            
          </img>
            <div id="map" class="geoloc"></div>
            <p class="subtitle">Ingresá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</p>

            <label for="geoloc-input" class="label"><div class="label-txt">UBICACIÓN</div></label>
            <input type="search" id="loc" class="text-input location" name="location" required placeholder= "Ej: &quot;Monumento a la bandera, Rosario&quot;">

            <button  class="submit1">Reportar mascota</button>
           
            <button  class="submit2">Cancelar</button>
    
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

    #map {
      height: 250px;
      width: 335px;
      border-radius: 4px;
      z-index: 0;
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
      height: 45px;
      width: 266px;
      margin-top: 25px;
      margin-bottom: 80px;
      text-align: center;
    }

 
    .label{
        text-align: left;
        width: 335px;
    }

    .upload-img {
        height: 180px;
        width: 335px;
        background-color: #e6d9d8;
    }

    .geoloc {
        height: 253px;
        width: 335px;
        background-color: #e6d9d8;
    }

    form {
      display:flex;
      flex-direction: column;
    }

    .text-input {
        width: 335px;
        height: 50px;
        background-color: #FFFFFF;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25);
        border: none;
        border-radius: 4px;
        margin-bottom: 30px;
    }

    .submit {
        background-color: #5A8FEC;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 25px 0px 50px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    .submit1 {
        background-color: #00A884;
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

    .submit2 {
        background-color: #4A5553;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 0px 0px 80px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    `;

    this.appendChild(style);

    // GENERAR MAPA
    const mapElem = document.querySelector(".geoloc") as HTMLElement;
    const mapa = initMap(mapElem, lat, lng);
    const mapSearchInput = document.getElementById(
      "loc"
    ) as HTMLInputElement; /* ---> si el input tiene comillas dobles, el placeholder no se va a mostrar por error de sintaxis */

    let coords;

    //le agregamos el geocoder al input
    mapSearchInput.appendChild(geocoder.onAdd(mapa));

    var zoomControl = new mapboxgl.NavigationControl();
    mapa.addControl(zoomControl, "top-right");

    //traducimos la búsqueda a geolocalización y agregamos un marcador // guardamos los datos geográficos
    geocoder.on("result", (e) => {
      const result = e.result;
      coords = result.center;
      const marker = new mapboxgl.Marker().setLngLat(coords).addTo(mapa);
      // guardamos las coordenadas en el state
      lat = coords[1];
      lng = coords[0];
      cs.petLocation = [lat, lng];
      state.setState(cs);
      console.log("COORDENADAS:", coords);
    });

    mapSearchInput.addEventListener("search", (e) => {
      e.preventDefault();
      const address = mapSearchInput.value;
      geocoder.query(address);

      //guardamos el dato de la dirección en el state
      reportAdress = address;
      cs.reportLocation = reportAdress;
      state.setState(cs);
    });

    //DROPZONE ADD FILE Y CREAR MASCOTA
    const dropzoneButton = this.querySelector(".submit");
    const submitForm = this.querySelector(".submit1");

    let myDropzone = new Dropzone(".submit", {
      url: `/falsa`,
      autoProcessQueue: false,
      maxFiles: 1,
      thumbnailWidth: 335,
      thumbnailHeight: 180,
    });

    let pictureDataURL;

    myDropzone.on("thumbnail", (file) => {
      pictureDataURL = file.dataURL;
    });

    /* El objeto file representa el archivo a subir. Este tiene varias propiedades y métodos sobre el archivo a subir, una de ellas es
    dataURL en base64. Si intentamos acceder a la url como "pictureFile.dataURL" después, obviamente no va a existir y va a dar 
    undefined, por eso le asignamos ese valor a pictureDataURL para poder usarlo después */

    //FORM PARA ENVIAR LOS DATOS DEL REPORTE:
    const petNameElem: any = this.querySelector(".petname");
    const petLocationElem: any = this.querySelector(".location");

    submitForm?.addEventListener("click", () => {
      let petname = petNameElem.value;
      let location = petLocationElem.value;

      let petData = {
        name: petname,
        lat: cs.petLocation[0],
        lng: cs.petLocation[1],
        pictureURL: pictureDataURL,
        reportLocation: cs.reportLocation,
        userId: cs.userId,
      };

      if (!petname || !location || !pictureDataURL) {
        alert("Complete todos los campos");
        return;
      } else if (petData) {
        state.createPetReport(petData).then(() => {
          Router.go("/my-reports");
        });
      }
      console.log(
        "info",
        petData.name,
        petData.reportLocation,
        petData.pictureURL
      );
    });

    // CANCELAR Y VOLVER AL HOME
    const cancelButton = document.querySelector(".submit2");
    cancelButton?.addEventListener("click", () => {
      Router.go("/home");
    });
  }
}
customElements.define("reports-page", ReportPage);

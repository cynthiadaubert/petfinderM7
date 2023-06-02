import { Router } from "@vaadin/router";
import { state } from "../../../be-src/state";
import { initMap, geocoder } from "../../../be-src/lib/mapbox";
import mapboxgl from "mapbox-gl";
import Dropzone from "dropzone";

export class EditReportPage extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const cs = state.getState();

    let lat;
    let lng;
    let reportAdress;

    if (cs.petDataToModify) {
      lat = cs.petDataToModify[0].lat;
      lng = cs.petDataToModify[0].lng;
    } else if (!cs.petDataToModify) {
      lat = -34.601102499999996;
      lng = -58.383111;
      console.log(
        "WARNING: Se está usando la ubicación por defecto y no la del usuario"
      );
    }

    this.innerHTML = `
      <div class="box">
      <header-comp></header-comp>
          <h1 class="title">Editar reporte de mascota</h1>
       
          <label for="email-input" class="label"><div class="label-txt">NOMBRE</div></label>
          <input type="text" id="name" class="text-input petname" name="name" required>

          <img class="upload-img" src=${cs.petDataToModify[0].pictureURL}>
            <button type="submit" class="submit">Modificar foto</button>


            <div id="map" class="geoloc"></div>
            <p class="subtitle">Ingresá un punto de referencia para reportar la mascota. Por ejemplo, la ubicación donde lo viste por última vez.</p>


            <label for="geoloc-input" class="label"><div class="label-txt">UBICACIÓN</div></label>
            <input type="search" id="loc" class="text-input location" name="location" required placeholder= "Ej: &quot;Monumento a la bandera, Rosario&quot;">

            <button type="submit" class="submit1">Guardar</button>
            <button type="submit" class="submit2">Reportar como encontrado</button>
            <button type="submit" class="submit3">Eliminar reporte</button>

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
      margin-bottom: 80px;
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

    .label-txt {
        text-align: left;
        width: 335px;
    }

    .upload-img {
        height: 220px;
        width: 335px;
        background-color: #e6d9d8;
        object-fit: cover;
    }

    .geoloc {
        height: 253px;
        width: 335px;
        background-color: #e6d9d8;
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

    .submit2 {
        background-color: #4A5553;
        font-family: Roboto;
        border:none;
        border-radius: 4px;
        height: 50px;
        width: 335px;
        margin: 0px 0px 25px 0px;
        color: #FFFFFF;
        font-size: 16px;
        font-weight: 700;
    }

    .submit3 {
        background-color:  #EB6372;
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
   
    input {
      font-size: 16px;
    }

    `;

    this.appendChild(style);

    //MOSTRAR DATOS GUARDADOS
    const nameInput = document.getElementById("name") as any;
    const oldImg = document.querySelector(".upload-img") as any;
    nameInput.value = cs.petDataToModify[0].name;
    const mapSearchInput = document.getElementById("loc") as any;
    mapSearchInput.value = cs.petDataToModify[0].reportLocation;

    // GENERAR MAPA
    const mapElem = document.querySelector(".geoloc") as HTMLElement;
    const mapa = initMap(mapElem, lat, lng);

    let coords;

    mapSearchInput.appendChild(geocoder.onAdd(mapa));

    var zoomControl = new mapboxgl.NavigationControl();
    mapa.addControl(zoomControl, "top-right");

    geocoder.on("result", (e) => {
      const result = e.result;
      coords = result.center;
      const marker = new mapboxgl.Marker().setLngLat(coords).addTo(mapa);

      lat = coords[1];
      lng = coords[0];
      cs.petLocation[0] = lat;
      cs.petLocation[1] = lng;
      state.setState(cs);
    });

    mapSearchInput.addEventListener("search", (e) => {
      e.preventDefault();
      const address = mapSearchInput.value;
      geocoder.query(address);

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
      oldImg.style.display = "none";
    });

    ///////////////////////// BUTTONS ///////////////////////////

    //FORM PARA ENVIAR LOS DATOS DEL REPORTE:
    const petNameElem: any = this.querySelector(".petname");
    /*     const petLocationElem: any = this.querySelector(".location"); */

    submitForm?.addEventListener("click", () => {
      let petname = petNameElem.value;
      const petId = cs.petDataToModify[0].id;

      let petData = {
        name: petname || cs.petDataToModify[0].name,
        pictureURL: pictureDataURL || cs.petDataToModify[0].pictureURL,
        lat: lat || cs.petDataToModify[0].lat,
        lng: lng || cs.petDataToModify[0].lng,
        reportLocation:
          cs.reportLocation || cs.petDataToModify[0].reportLocation,
      };

      if (petData) {
        console.log("soy la petdata", petData, petId);
        state.updatePetData(petData, petId).then(() => {
          Router.go("/my-reports");
        });
      }
    });

    //REPORT PET AS FOUND
    const reportFoundButton = document.querySelector(".submit2");
    reportFoundButton?.addEventListener("click", () => {
      const petId = cs.petDataToModify[0].id;
      const promise = state.reportPetFound(petId);
      promise.then(() => {
        Router.go("/my-reports");
      });
    });

    //DELETE PET REPORT
    const deleteButton = document.querySelector(".submit3");
    deleteButton?.addEventListener("click", () => {
      const petId = cs.petDataToModify[0].id;
      const promise = state.deletePetReportById(petId);
      promise.then(() => {
        Router.go("/my-reports");
      });
    });
  }
}
customElements.define("edit-page", EditReportPage);

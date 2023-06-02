const MAPBOX_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
import * as mapboxgl from "mapbox-gl";
import MapboxGeocoder from "@mapbox/mapbox-gl-geocoder";
import "mapbox-gl/dist/mapbox-gl.css";
import "@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css";
mapboxgl.accessToken = MAPBOX_TOKEN;

const geocoder = new MapboxGeocoder({
  accessToken: mapboxgl.accessToken, // cambia la forma de acceder a las env vars para no tener problemas de parcel mutating process.env is not supported
  countries: "ar",
  autocomplete: true,
  language: "es",
  marker: false,
});

function initMap(mapElement, lng, lat) {
  const map = new mapboxgl.Map({
    container: mapElement,
    style: "mapbox://styles/mapbox/streets-v11",
    center: [lat, lng],
    zoom: 14,
    dragPan: true,
    scrollZoom: true,
  });

  const marker = new mapboxgl.Marker().setLngLat([lat, lng]).addTo(map);

  return map;
}

export { initMap, geocoder };

/* (function () {
  window.map = initMap();
  initSearchForm(function (results) {
    const firstResult = results[0];
    const marker = new mapboxgl.Marker().setLngLat(
      firstResult.geometry.coordinates
    ); // LAS COORDENADAS ESTÁN INVERTIDAS

    const [lng, lat] = firstResult.geometry.coordinates;
    //   const lat = firstResult.geometry.coordinates[1];
     // const lng = firstResult.geometry.coordinates[0];

    fetch("/comercios-cerca-de?lat=" + lat + "&lng=" + lng)
      .then((res) => res.json())
      .then((data) => {
        for (const comercio of data) {
          const { lat, lng } = comercio._geoloc;
          new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
        }
      });

    map.setCenter(firstResult.geometry.coordinates);
    map.setZoom(14);
  });
})();
 */

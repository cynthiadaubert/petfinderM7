import "./pages/home";
import "./pages/home-pets";
import "./pages/signin";
import "./pages/signup";
import "./pages/auth2";
import "./pages/profile";
import "./pages/profile-account";
import "./pages/profile-password";
import "./pages/report-empty";
import "./pages/reports";
import "./pages/report-edit";
import "./pages/pets-not-found";
import { headerComp } from "./components/header";
import { PetsAroundMeComp } from "./components/pets-around-me-card";
import { myReportsComp } from "./components/my-reports-card";
import "./pages/my-reports";
import "./router";

import { state } from "../be-src/state";

(function () {
  headerComp;
  PetsAroundMeComp;
  myReportsComp;
  state.initState();

  /* localStorage.removeItem("pets-state"); */
})();

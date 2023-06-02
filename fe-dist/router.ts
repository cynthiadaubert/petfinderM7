import { Router } from "@vaadin/router";

const router = new Router(document.querySelector(".root"));

router.setRoutes([
  { path: "/", component: "home-page" },
  { path: "/home", component: "home-page" },
  { path: "/home/pets", component: "pets-page" },
  { path: "/signup", component: "signup-page" },
  { path: "/auth2", component: "auth2-page" },
  { path: "/signin", component: "signin-page" },
  { path: "/profile", component: "profile-menu" },
  { path: "/profile/account", component: "account-page" },
  { path: "/profile/password", component: "password-page" },
  { path: "/reports", component: "reports-page" },
  { path: "/reports/edit", component: "edit-page" },
  { path: "/my-reports", component: "my-reports" },
  { path: "/reports/empty", component: "empty-page" },
  { path: "/home/pets-not-found", component: "notfound-page" },
]);

import { Router } from "@vaadin/router";

const API_BASE_URL =
  "https://petfinder-m7.onrender.com" ||
  "https://petfinderm7-production.up.railway.app/" ||
  "http://localhost:5050";

const state = {
  data: {
    userName: "",
    authenticated: false,
    userEmail: "",
    currentUserLocation: [],
    petsAroundMeList: [],
    petsFromUser: [],
    userLat: "",
    userLng: "",
    petDataToModify: "",
    petLocation: [],
  },

  listeners: [], // se invocan los callbacks cada vez que el state cambia

  initState() {
    try {
      const localData = localStorage.getItem("pets-state");

      if (localData) {
        const parsedData = JSON.parse(localData);
        /*         console.log("parsed", parsedData); */
        this.setState(parsedData);
      }
    } catch (err) {
      console.log("error inizializando estado:", err);
    }
  },

  getState() {
    return this.data;
  },

  //REGISTRO
  async signUp(data) {
    /*     console.log("soy data",data) */
    const cs = this.getState();
    const signupData = await fetch(API_BASE_URL + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data), // me daba error de tipo por ponerle {} a data
    });
    const newUser = await signupData.json();
    cs.userId = newUser;
    this.setState(cs);
    alert("Usuario creado con éxito");
    if (newUser) {
      Router.go("/signin");
      return newUser;
    }
  },

  //SIGNIN - LOGIN

  async signIn(password) {
    const cs = this.getState();
    try {
      const signinData = await fetch(API_BASE_URL + "/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cs.userEmail, password }),
      });

      const res = await signinData.json();
      cs.token = res;
      this.setState(cs);

      if (cs.token) {
        cs.authenticated = true;
        this.setState(cs);

        Router.go("/my-reports");
      }
      return res;
    } catch (err) {
      console.log(err);
      alert("La contraseña no coincide");
      throw err;
    }
  },

  //CHECK EMAIL FIRST
  async checkEmail(email) {
    const cs = this.getState();
    cs.userEmail = email;
    console.log("check", cs.userEmail);
    try {
      const checkEmail = await fetch(
        API_BASE_URL + "/check-email" + "?email=" + email,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const res = await checkEmail;

      const data = await res.json();

      if (checkEmail.status === 201) {
        cs.userEmail = email;
        cs.userId = data.email.id;
        this.setState(cs);
        Router.go("/auth2");
        return data;
      } else {
        alert("No se ha registrado un usuario con ese mail");
        return null;
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  },

  // SI ESTÁ AUTENTICADO, MUESTRA LOGOUT Y PUEDE ACCEDER A PÁGINAS

  isAuthenticated(status) {
    /*     const cs = this.getState();
    if (cs.authenticated == true) {
      return true;
    } else if (cs.userEmail == "" || undefined || cs.authenticated == false) {
      return false;
    } */
    const cs = this.getState();
    if (cs.userEmail) {
      return true;
    } else if (cs.userEmail == "" || undefined) {
      return false;
    }
  },

  //GET PETS AROUND ME
  async petsAroundMe(lat, lng) {
    const cs = this.getState();
    console.log(lat, lng);
    const getPetsAroundMe = await fetch(
      API_BASE_URL + "/pets-around-me" + "?lat=" + lat + "&lng=" + lng,
      {
        method: "GET",
        headers: {
          "Content-type": "application/json",
        },
      }
    );
    let res = await getPetsAroundMe;
    let data = await res.json(); // terminar de resolver la promesa!!

    cs.petsAroundMeList = data;
    await this.setState(cs);
    if (Object.keys(data).length > 0) {
      Router.go("/home/pets");
    } else if (!data) {
      Router.go("/home/pets-not-found");
    }
    return data;
  },

  //UPDATE USER
  async updateUser(data) {
    const cs = this.getState();
    const updatedData = await fetch(
      API_BASE_URL + "/users/update" + "?userId=" + cs.userId,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${cs.token}`,
        },
        body: JSON.stringify(data),
      }
    );
    const newData = await updatedData.json();

    if (newData.name) {
      cs.userName = newData.name;
    } else if (newData.location) {
      cs.userLocation = newData.location;
    }
    this.setState(cs);
    alert("Se han guardado los cambios");
    return newData;
  },

  // ENVIAR INFO DE MASCOTA POR MAIL
  async createReport(data, petId) {
    const reportInfo = await fetch(
      API_BASE_URL + "/report-pet-info" + "?petId=" + petId,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );
    return reportInfo;
  },

  // CREAR MASCOTA (CREAR REPORT)
  async createPetReport(data) {
    const cs = this.getState();
    const petData = await fetch(API_BASE_URL + "/pets", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        mode: "no-cors",
        Authorization: `bearer ${cs.token}`,
      },
      body: JSON.stringify(data),
    });
    const newPetData = await petData.json();
    alert("Se ha creado un nuevo reporte");
    return newPetData;
  },

  //GET PETS BY ID
  async getPetDataById(petId) {
    const cs = this.getState();
    try {
      const res = await fetch(
        API_BASE_URL + "/get-pet-by-id" + "?petId=" + petId,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to fetch pet data");
      }

      const data = await res.json();
      cs.petDataToModify = data;
      this.setState(cs);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  //GET PETS BY USER ID
  async getPetsByUserId(userId) {
    const cs = this.getState();
    try {
      const response = await fetch(
        API_BASE_URL + "/pets" + "?userId=" + userId,
        {
          method: "GET",
          headers: {
            "Content-type": "application/json",
            Authorization: `bearer ${cs.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch pet data");
      }

      const data = await response.json();
      console.log("pets from user data", data);

      cs.petsFromUser = data;
      this.setState(cs);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  //UPDATE PET DATA
  async updatePetData(data, petId) {
    const cs = this.getState();
    try {
      const updatedData = await fetch(
        API_BASE_URL + "/pets/update" + "?petId=" + petId,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${cs.token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const newPetData = await updatedData.json();
      console.log("data nueva del pet", newPetData);
      alert("Se han guardado los cambios");
      return newPetData;
    } catch (err) {
      console.log(err);
    }
  },

  //DELETE PETS BY ID
  async deletePetReportById(petId) {
    const cs = this.getState();
    try {
      const response = await fetch(API_BASE_URL + "/pets" + "?petId=" + petId, {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: `bearer ${cs.token}`,
        },
      });

      const data = await response.json();
      alert("El reporte ha sido eliminado");
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  //REPORT PET AS FOUND
  async reportPetFound(petId) {
    const currentState = this.getState();
    const reportAsFound = await fetch(
      API_BASE_URL + "/pet-found" + "?petId=" + petId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `bearer ${currentState.token}`,
        },
      }
    );
    const res = await reportAsFound.json();
    alert("Se ha reportado como encontrado");
    return res;
  },

  // SETEAR UBICACIÓN DE LA MASCOTA
  setPetLocation(lat, lng) {
    const cs = this.getState();
    cs.petLocationLat = lat;
    cs.petLocationLng = lng;

    this.setState(cs);
  },

  setState(newState) {
    // modifica this.data e invoca los callbacks
    this.data = newState;
    for (const cb of this.listeners) {
      cb();
    }
    console.log("esta es la nueva data en el state", this.data);
    try {
      localStorage.setItem("pets-state", JSON.stringify(newState));
    } catch (err) {
      console.log(err);
      throw err;
    }
  },

  subscribe(callback: (any) => any) {
    //agrega un nuevo callback al array de listeners, para poder invocarlos cada vez que el state cambia
    this.listeners.push(callback);
  },
};

export { state };

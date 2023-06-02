import { User, Pet, Report } from "../models";
import { cloudinary } from "../lib/cloudinary";
import { index } from "../lib/algolia";

// CREA MASCOTA Y LE AGREGA LA IMAGEN
export async function createPet(userId, petData) {
  let petImgURL;
  if (petData.pictureURL) {
    try {
      const img = await cloudinary.uploader.upload(petData.pictureURL, {
        resource_type: "image",
        discard_original_filename: true,
        width: 500,
      });
      petImgURL = img.secure_url;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
  const completeData = {
    name: petData.name,
    lat: petData.lat,
    lng: petData.lng,
    pictureURL: petData.pictureURL,
    found: false,
    reportLocation: petData.reportLocation,
    userId: userId,
  };

  try {
    const newPet = await Pet.create({
      ...completeData,
    });
    let algoliaRes = await savePetLocation({
      lat: completeData.lat,
      lng: completeData.lng,
      petId: newPet.get("id"),
    });
    return newPet;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// GUARDA LA GEOLOC DE LA MASCOTA
async function savePetLocation(petData) {
  try {
    const algoliaRes = await index
      .saveObject({
        objectID: petData.petId,
        _geoloc: {
          lat: petData.lat,
          lng: petData.lng,
        },
      })
      .then(() => {});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// DEVUELVE LA GEOLOC
function getLocation(data, id?) {
  const res: any = {};
  if (data.lat && data.lng) {
    res._geoloc = { lat: data.lat, lng: data.lng };
  }
  if (id) {
    res.objectID = id;
  }
  console.log(res);
  return res;
}

/* // Inicializa un objeto vacío de tipo any para permitirnos poner cualquier propiedad. Si existe lat y lng
va a agregarle la propiedad _geoloc con un objeto que contenga esos valores. Lo mismo si existe el id */

// ACTUALIZA DATOS DE UBICACIÓN EN ALGOLIA
export async function updateGeoLocation(data, petId) {
  const indexRes = getLocation(data, petId);
  try {
    const algoliaResponse = await index.partialUpdateObject(indexRes);
  } catch (error) {
    console.log(error);
  }
}

//ACTUALIZA LOS DATOS DE LA MASCOTA
export async function updatePetData(data, petId) {
  /*   console.log("dataaaaaaa", data, petId); */
  const updated = {
    name: data.name,
    pictureURL: data.pictureURL,
    lat: data.lat,
    lng: data.lng,
    reportLocation: data.reportLocation,
  };

  if (data.pictureURL) {
    const img = await cloudinary.uploader.upload(data.pictureURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 500,
    });
    data.pictureURL = img.secure_url;
  }
  if (data.lat && data.lng && data.reportLocation) {
    await updateGeoLocation(data, petId);
  }
  const newUpdatedData = updated;
  /*   console.log("DATA", newUpdatedData); */

  const updatePet = await Pet.update(newUpdatedData, {
    where: {
      id: petId,
    },
  });
  return newUpdatedData;
}

// DEVUELVE TODAS LAS MASCOTAS
export async function getAllPets() {
  try {
    return await Pet.findAll({});
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// DEVUELVE TODAS LAS MASCOTAS POR ID
export async function getPetsById(petId) {
  try {
    return await Pet.findAll({
      where: { id: petId },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

//DEVUELVE LAS MASCOTAS CERCANAS EN UN RADIO DE 30KM
export async function getpetsAroundMe(lat, lng) {
  try {
    const { hits } = await index.search("", {
      aroundLatLng: `${lat}, ${lng}`,
      aroundRadius: 10000,
    });
    const petIds = hits.map((h) => {
      return h.objectID;
    });
    const petsAroundMeRes = await getPetsById(petIds);
    return petsAroundMeRes;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// REPORTAR MASCOTA COMO ENCONTRADA
export async function reportPetFound(id) {
  try {
    const petFound = await Pet.update(
      { found: true },
      {
        where: {
          id,
        },
      }
    );
    return petFound;
  } catch (err) {
    console.log(err);
    throw err;
  }
}

// ELIMINAR DATOS DE MASCOTA EN ALGOLIA Y EN SEQUELIZE
export async function deletePetById(petId) {
  try {
    await index.deleteObject(petId);
    return Pet.destroy({
      where: {
        id: petId,
      },
    });
  } catch (err) {
    console.log(err);
    throw err;
  }
}

//DEVUELVE TODAS LAS MASCOTAS REPORTADAS DE UN USUARIO

export async function getAllPetsByUser(userId) {
  try {
    return await Pet.findAll({
      where: {
        userId: userId,
      },
      include: [User], // nos devuelve el usuario en relación a este pet
    });
  } catch (error) {
    throw error;
  }
}

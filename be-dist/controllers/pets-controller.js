"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllPetsByUser = exports.deletePetById = exports.reportPetFound = exports.getpetsAroundMe = exports.getPetsById = exports.getAllPets = exports.updatePetData = exports.updateGeoLocation = exports.createPet = void 0;
const models_1 = require("../models");
const cloudinary_1 = require("../lib/cloudinary");
const algolia_1 = require("../lib/algolia");
// CREA MASCOTA Y LE AGREGA LA IMAGEN
async function createPet(userId, petData) {
    let petImgURL;
    if (petData.pictureURL) {
        try {
            const img = await cloudinary_1.cloudinary.uploader.upload(petData.pictureURL, {
                resource_type: "image",
                discard_original_filename: true,
                width: 500,
            });
            petImgURL = img.secure_url;
        }
        catch (err) {
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
        const newPet = await models_1.Pet.create({
            ...completeData,
        });
        let algoliaRes = await savePetLocation({
            lat: completeData.lat,
            lng: completeData.lng,
            petId: newPet.get("id"),
        });
        return newPet;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.createPet = createPet;
// GUARDA LA GEOLOC DE LA MASCOTA
async function savePetLocation(petData) {
    try {
        const algoliaRes = await algolia_1.index
            .saveObject({
            objectID: petData.petId,
            _geoloc: {
                lat: petData.lat,
                lng: petData.lng,
            },
        })
            .then(() => { });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
// DEVUELVE LA GEOLOC
function getLocation(data, id) {
    const res = {};
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
async function updateGeoLocation(data, petId) {
    const indexRes = getLocation(data, petId);
    try {
        const algoliaResponse = await algolia_1.index.partialUpdateObject(indexRes);
    }
    catch (error) {
        console.log(error);
    }
}
exports.updateGeoLocation = updateGeoLocation;
//ACTUALIZA LOS DATOS DE LA MASCOTA
async function updatePetData(data, petId) {
    /*   console.log("dataaaaaaa", data, petId); */
    const updated = {
        name: data.name,
        pictureURL: data.pictureURL,
        lat: data.lat,
        lng: data.lng,
        reportLocation: data.reportLocation,
    };
    if (data.pictureURL) {
        const img = await cloudinary_1.cloudinary.uploader.upload(data.pictureURL, {
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
    const updatePet = await models_1.Pet.update(newUpdatedData, {
        where: {
            id: petId,
        },
    });
    return newUpdatedData;
}
exports.updatePetData = updatePetData;
// DEVUELVE TODAS LAS MASCOTAS
async function getAllPets() {
    try {
        return await models_1.Pet.findAll({});
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.getAllPets = getAllPets;
// DEVUELVE TODAS LAS MASCOTAS POR ID
async function getPetsById(petId) {
    try {
        return await models_1.Pet.findAll({
            where: { id: petId },
        });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.getPetsById = getPetsById;
//DEVUELVE LAS MASCOTAS CERCANAS EN UN RADIO DE 30KM
async function getpetsAroundMe(lat, lng) {
    try {
        const { hits } = await algolia_1.index.search("", {
            aroundLatLng: `${lat}, ${lng}`,
            aroundRadius: 10000,
        });
        const petIds = hits.map((h) => {
            return h.objectID;
        });
        const petsAroundMeRes = await getPetsById(petIds);
        return petsAroundMeRes;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.getpetsAroundMe = getpetsAroundMe;
// REPORTAR MASCOTA COMO ENCONTRADA
async function reportPetFound(id) {
    try {
        const petFound = await models_1.Pet.update({ found: true }, {
            where: {
                id,
            },
        });
        return petFound;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.reportPetFound = reportPetFound;
// ELIMINAR DATOS DE MASCOTA EN ALGOLIA Y EN SEQUELIZE
async function deletePetById(petId) {
    try {
        await algolia_1.index.deleteObject(petId);
        return models_1.Pet.destroy({
            where: {
                id: petId,
            },
        });
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.deletePetById = deletePetById;
//DEVUELVE TODAS LAS MASCOTAS REPORTADAS DE UN USUARIO
async function getAllPetsByUser(userId) {
    try {
        return await models_1.Pet.findAll({
            where: {
                userId: userId,
            },
            include: [models_1.User], // nos devuelve el usuario en relación a este pet
        });
    }
    catch (error) {
        throw error;
    }
}
exports.getAllPetsByUser = getAllPetsByUser;

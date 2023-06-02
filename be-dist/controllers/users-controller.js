"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.updateUserData = exports.findEmail = exports.createUser = void 0;
const models_1 = require("../models");
const auth_controller_1 = require("./auth-controller");
async function createUser(data) {
    const { email, password, username } = data;
    try {
        const newUser = await models_1.User.create({
            email: email,
            username: username,
        });
        let userId = newUser.get("id");
        const newAuth = await models_1.Auth.create({
            email: email,
            password: (0, auth_controller_1.getSHA256ofString)(password),
            user_Id: userId,
        });
        return userId; // debe retornar si o si!!
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.createUser = createUser;
async function findEmail(email) {
    try {
        const user = await models_1.User.findOne({
            where: {
                email,
            },
        });
        /*     console.log("soy el user",user) */
        return user;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}
exports.findEmail = findEmail;
async function updateUserData(data, userId) {
    const updatedData = {
        name: data.name,
        location: data.location,
        password: data.password,
    };
    if (updatedData.name) {
        try {
            await models_1.User.update({
                name: updatedData.name,
            }, {
                where: {
                    id: userId,
                },
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    if (updatedData.location) {
        try {
            await models_1.User.update({
                location: updatedData.location,
            }, {
                where: {
                    id: userId,
                },
            });
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    if (updatedData.password) {
        try {
            await (0, auth_controller_1.updatePassword)(updatedData.password, userId);
        }
        catch (err) {
            console.log(err);
            throw err;
        }
    }
    return updatedData;
}
exports.updateUserData = updateUserData;
async function getAllUsers() {
    try {
        return await models_1.User.findAll({});
    }
    catch (error) {
        throw error;
    }
}
exports.getAllUsers = getAllUsers;

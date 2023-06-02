"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudinary = void 0;
require("dotenv/config");
const cloudinary = require("cloudinary").v2;
exports.cloudinary = cloudinary;
/* import {v2 as cloudinary} from "cloudinary" */
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sgMail = void 0;
require("dotenv/config");
const sgMail = require("@sendgrid/mail");
exports.sgMail = sgMail;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

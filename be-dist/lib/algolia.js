"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.index = void 0;
require("dotenv/config");
const algoliasearch_1 = __importDefault(require("algoliasearch"));
// Connect and authenticate with your Algolia app
const client = (0, algoliasearch_1.default)(process.env.ALGOLIA_APPLICATION_ID, process.env.ALGOLIA_API_KEY);
// Create a new index and add a record
const index = client.initIndex("pets");
exports.index = index;

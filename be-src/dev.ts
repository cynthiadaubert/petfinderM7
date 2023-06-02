import * as dotenv from "dotenv";
import * as path from "path";

const dotenvPath = path.resolve(__dirname, "../.env");

dotenv.config({ path: dotenvPath });
import "./api.ts";

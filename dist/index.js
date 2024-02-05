"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const index_1 = require("./config/index");
const index_2 = __importDefault(require("./routes/index"));
const index_3 = require("./lib/index");
dotenv_1.default.config();
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(passport_1.default.initialize());
index_3.userPassportValidation(passport_1.default);
app.get("/api", (req, res) => res.send("Hello World"));
app.use("/api/user", index_2.default);
app.use((error, req, res) => {
    res.status(400).send({
        message: error
    });
});
index_1.connect(process.env.MONGO_URL);
app.listen(process.env.PORT, () => console.log(`Server Started at Port ${process.env.PORT}`));

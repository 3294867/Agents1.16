"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.pool = void 0;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const express_session_1 = __importDefault(require("express-session"));
const connect_pg_simple_1 = __importDefault(require("connect-pg-simple"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const openai_1 = __importDefault(require("openai"));
const route_1 = __importDefault(require("./route"));
const db_1 = require("./db");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:5173",
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, compression_1.default)());
/** Connect database */
exports.pool = (0, db_1.createPool)();
exports.pool.connect((err, _, release) => {
    if (err) {
        return console.error("Error acquiring client.", err.stack);
    }
    console.debug("Database connected successfully.");
    release();
});
/** Connect OpenAI */
exports.client = new openai_1.default({
    apiKey: process.env.OPENAI_API_KEY
});
/** Connect API routes */
app.use("/api", route_1.default);
const PGSession = (0, connect_pg_simple_1.default)(express_session_1.default);
app.use((0, express_session_1.default)({
    store: new PGSession({
        pool: exports.pool,
        tableName: "Session",
        createTableIfMissing: true
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 30 * 24 * 60 * 60 * 1000,
    }
}));
/** Listen to api routes  */
app.listen(process.env.API_ROUTES_PORT, () => {
    try {
        console.debug(`Listening to api routes running on port ${process.env.API_ROUTES_PORT}.`);
    }
    catch (error) {
        console.error("Listening to api routes startup error: ", error);
    }
});

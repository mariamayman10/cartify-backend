import express from "express";
import cors from "cors";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import hpp from "hpp";
import dotenv from "dotenv";
import database from "./config/database";
import path from "path";
import { I18n } from "i18n";
import { appRoutes } from "./routes";
import { Server } from "http";

// create app
const app: express.Application = express();
// read .env
dotenv.config();
// enable parsing of JSON-formatted request bodies
app.use(express.json({ limit: "10kb" }));
app.use(
  cors({
    origin: ["http://localhost:4200"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(compression());
app.use(mongoSanitize());
app.use(
  hpp({
    whitelist: ["price", "category", "subcategory", "ratingAverage", "sold"],
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));

// serve static access to images
app.use(express.static("uploads"));
// load database
database();
const i18n = new I18n({
  locales: ["en", "ar"],
  directory: path.join(__dirname, "locales"),
  defaultLocale: "en",
  queryParameter: "lang",
});
app.use(i18n.init);

// include the routes of the app
appRoutes(app);
// specify port to listen
let server: Server;
server = app.listen(process.env.PORT);

process.on("unhandledRejection", (err: Error) => {
  console.error(`unhandledRejection: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error("Shutting down the app");
    process.exit(1);
  });
});

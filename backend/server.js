import express from "express";
import cors from "cors";
import { registerAiGenerateRoute } from "./components/aiGenerateComponent.js";
import { registerLodTemplateRoutes } from "./components/lodTemplateComponent.js";
import { registerWritTemplateRoutes } from "./components/writTemplateComponent.js";

const app = express();

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
]);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients and explicitly allow known local frontend origins.
      if (!origin || allowedOrigins.has(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);

app.use(express.json());

registerLodTemplateRoutes(app);
registerWritTemplateRoutes(app);
registerAiGenerateRoute(app);

app.listen(3001, () => {
  console.log("🚀 AI server running on http://localhost:3001");
});

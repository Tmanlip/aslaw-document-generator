import express from "express";
import cors from "cors";
import { registerAiGenerateRoute } from "./components/aiGenerateComponent.js";
import { registerLodTemplateRoutes } from "./components/lodTemplateComponent.js";
import { registerWritTemplateRoutes } from "./components/writTemplateComponent.js";

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients and local development origins on any port.
      if (!origin) {
        callback(null, true);
        return;
      }

      try {
        const { hostname } = new URL(origin);
        if (hostname === "localhost" || hostname === "127.0.0.1") {
          callback(null, true);
          return;
        }
      } catch {
        // Keep handling below for malformed origins.
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
  }),
);

app.use(express.json());

app.get("/health", async (_req, res) => {
  try {
    const ollamaResponse = await fetch("http://127.0.0.1:11434/api/tags", {
      signal: AbortSignal.timeout(2500),
    });

    if (!ollamaResponse.ok) {
      return res.status(503).json({
        status: "degraded",
        backend: "ok",
        ollama: "error",
        details: `Ollama responded with status ${ollamaResponse.status}`,
      });
    }

    return res.json({
      status: "ok",
      backend: "ok",
      ollama: "ok",
    });
  } catch (error) {
    return res.status(503).json({
      status: "degraded",
      backend: "ok",
      ollama: "unreachable",
      details: error?.message || "Ollama connection failed",
    });
  }
});

registerLodTemplateRoutes(app);
registerWritTemplateRoutes(app);
registerAiGenerateRoute(app);

app.listen(3002, () => {
  console.log("🚀 AI server running on http://localhost:3002");
});

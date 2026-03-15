export const registerAiGenerateRoute = (app) => {
  app.post("/generate", async (req, res) => {
    const { prompt } = req.body;

    try {
      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3",
          prompt,
          stream: false,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Ollama error:", text);
        return res.status(500).json({ error: "Ollama request failed" });
      }

      const data = await response.json();
      res.json({ output: data.response });
    } catch (err) {
      console.error("Fetch error:", err);
      res.status(500).json({ error: "Ollama connection failed" });
    }
  });
};

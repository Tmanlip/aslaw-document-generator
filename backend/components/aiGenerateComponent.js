export const registerAiGenerateRoute = (app) => {
  app.post("/generate", async (req, res) => {
    const { prompt, language = "english" } = req.body;

    const languageInstruction = language === "malay"
      ? "Respond in formal Malay (Bahasa Melayu) using professional grammar and tone."
      : "Respond in formal English using professional grammar and tone.";

    const finalPrompt = `${languageInstruction}\n\n${prompt}`;

    try {
      const response = await fetch("http://127.0.0.1:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3",
          prompt: finalPrompt,
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

import express from "express";
import axios from "axios";

const app = express();
app.use(express.json());

// Rota principal (teste)
app.get("/", (req, res) => {
  res.send("Servidor do chatbot Roblox está online ✅");
});

// Rota usada pelo Roblox
app.post("/chat", async (req, res) => {
  try {
    const userMessage = req.body.message;

    if (!userMessage) {
      return res.status(400).json({ error: "Mensagem vazia" });
    }

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "deepseek/deepseek-r1t2-chimera:free",
        messages: [
          {
            role: "system",
            content: "Você é um NPC inteligente dentro de um jogo Roblox."
          },
          {
            role: "user",
            content: userMessage
          }
        ]
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const reply =
      response.data.choices?.[0]?.message?.content || "Sem resposta.";

    res.json({ reply });

  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Erro ao conectar com a IA" });
  }
});

// Porta exigida pelo Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Servidor rodando na porta", PORT);
});

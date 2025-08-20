# 🚀 Day 3 of GenAI with JavaScript Journey

Today, I successfully invoked an **LLM (Large Language Model)** for the first time using **JavaScript** with the help of **GroqCloud**. 🎉  
This was a super exciting experience, and I learned how to **communicate with LLMs properly** using system prompts and structured settings.  

---

## 📌 What I Learned Today

- ✅ How to **invoke an LLM** using JavaScript.  
- ✅ The role of **system prompts** in controlling how LLMs respond.  
- ✅ Example of system prompting:  
  - **Question**: `"Hey, who are you?"`  
  - **Answer (via system prompt instruction)**: `"I am Alley, made by Mr. Govind. Answer in short, max 3 lines."`  
- ✅ Explored **Structured Output** (getting clean and consistent responses).  
- ✅ Learned about important **LLM settings** and how they affect responses.

---

## ⚙️ Important LLM Settings

| Setting | Description | Example |
|---------|-------------|---------|
| **temperature** | Controls randomness. Lower = more focused, higher = more creative. | `0.2` (focused) |
| **top_p** | Nucleus sampling – probability threshold for word selection. | `0.5` |
| **stop** | Tells the LLM when to stop generating text. | `"Not"` |
| **max_completion_tokens** | Maximum tokens (words/pieces) in response. | `1000` |
| **frequency_penalty** | Reduces repeated phrases. | `1` |
| **presence_penalty** | Encourages mentioning new topics. | `1` |

---

## 💡 Key Notes for Beginners

- **LLM Invocation**: Just like calling an API — you send a **prompt**, and the model gives back a **completion (answer)**.  
- **System Prompting**: Acts like "rules" or "instructions" you give the LLM to control tone, format, and behavior.  
- **Settings**: Adjust these props (`temperature`, `max_completion_tokens`, etc.) to customize how the model answers.  
- **Structured Output**: Helps you get clean JSON/text that’s easy to use in your app.  

---

## 📝 Example Workflow (Simplified)

```js
import { Groq } from "groq-sdk";

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });

async function askLLM() {
  const response = await client.chat.completions.create({
    model: "mixtral-8x7b",
    messages: [
      { role: "system", content: "You are Alley, made by Mr. Govind. Answer politely in max 3 lines." },
      { role: "user", content: "Hey, who are you?" }
    ],
    temperature: 0.2,
    top_p: 0.5,
    max_completion_tokens: 1000,
    frequency_penalty: 1,
    presence_penalty: 1,
  });

  console.log(response.choices[0].message);
}

askLLM();

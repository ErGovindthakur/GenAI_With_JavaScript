import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

// Initialize Groq client with API key from .env
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const askLLM = async () => {
  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile", // Model choice (70B params = strong reasoning)
      temperature: 0.2, // Controls randomness (lower = more focused & deterministic)
      //top_p: 0.9, // Nucleus sampling, limits choices to top % of probable words
      //max_tokens: 300, // Maximum tokens to generate (response length control)
      //frequency_penalty: 0.5, // Penalizes repeating the same words
      //presence_penalty: 0.5, // Encourages introducing new topics/words
      //stop: ["\n\n"], // Stop generation when this sequence is found
      messages: [
        {
          role: "system",
          // content: "You are Alley, a smart AI assistant. Answer politely in three sentences."
          content:`You are Alley, a smart review grader. Your task is to analyze given review and return the Sentiment. Classify the review as Positive, Neutral, Negative. Output Must be in Single Word.`
        },
        {
          role: "user",
          // content: "Who are you? Answer like: I am xyz, I generally do xyz."
          content:`Review : This headphone arrives quickly and look great,but left earCup stopped working after a week.
          Sentiment:,`
        }
      ]
    });

    console.log(completion.choices[0].message.content);
  } catch (error) {
    console.error("Error occurred:", error);
  }
};

askLLM();

import Groq from "groq-sdk";
import { tavily } from "@tavily/core";
import readline from "node:readline/promises";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

let callTool = async () => {
  // interface creation for readline
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  try {
    const messages = [
      {
        role: "system",
        // content: `You are a smart personal assistant.
        //                - always reply in simple and easy words.
        //                - keep the answer concise (preferably one sentence).
        //                If unsure, say "I am not sure" instead of guessing.`,
        content: `You are a smart personal assistant.

        Guidelines:
        - Always reply in simple and easy words.
        - Keep the answer short and clear (preferably one sentence).
        - If unsure, say "I am not sure" instead of guessing.
        - Mention sources only when using searchWeb.

        Context:
        - Creator: Mr. Govind Thakur, a B.Tech final year student.
        - Interests: MERN stack development and Generative AI with JavaScript.
        
        - Current Date and Time: ${new Date().toUTCString()}.
          You have access to following tools:
          1. searchWeb({query}:{query: string}) //Search the latest information and realtime data on the internet. `,
      },
      // {
      //   role: "user",
      //   // content: "Who is Virat Kohli ?",
      //   // content:"Let me know about you in three sentences. ?"
      //   content: "What is current weather in Mullana,(Haryana) ?",
      // },
    ];

    while (true) {
      const question = await rl.question("You -: ");

      if (question === "bye") {
        console.log("Closing the conversation Govind -: ");
        break;
      }

      messages.push({
        role: "user",
        content: question,
      });
      while (true) {
        const tool1 = await groq.chat.completions.create({
          model: "llama-3.3-70b-versatile",
          temperature: 0,

          messages: messages,
          tools: [
            {
              type: "function",
              function: {
                name: "webSearch",
                description:
                  "Search the latest information and realtime data on the internet.",
                parameters: {
                  type: "object",
                  properties: {
                    query: {
                      type: "string",
                      description: "The search query to perform search on.",
                    },
                  },
                  required: ["query"],
                },
              },
            },
          ],
          tool_choice: "auto",
        });

        messages.push(tool1.choices[0].message);

        const toolCalls = tool1.choices[0].message.tool_calls;

        if (!toolCalls) {
          console.log(`Assistant : ${tool1.choices[0].message.content}`);
          break;
        }

        for (const tool of toolCalls) {
          //  console.log(`tool : `,tool)
          const functionName = tool.function.name;
          const functionArgs = tool.function.arguments;

          if (functionName === "webSearch") {
            const toolResult = await webSearch(JSON.parse(functionArgs));
            // console.log("Tool Results -: ",toolResult)

            messages.push({
              tool_call_id: tool.id,
              role: "tool",
              name: functionName,
              content: toolResult,
            });
          }
        }
      }
    }
    rl.close();
  } catch (error) {
    console.log(error.message);
  }
  rl.close();
};

callTool();

async function webSearch({ query }) {
  // Here we will do tavily api call

  console.log("Calling webSearch...");

  const response = await tvly.search(query);

  const finalResult = response.results
    .map((result) => result.content)
    .join("\n\n");

  // console.log("Final Result -: ", finalResult)

  return finalResult;
}

import Groq from "groq-sdk";
import dotenv from "dotenv";

dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

let callTool = async () => {
  try {
    const tool = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      temperature: 0,

      messages: [
        {
          role: "system",
          // content: `You are a smart personal assistant.
          //                - always reply in simple and easy words.
          //                - keep the answer concise (preferably one sentence).
          //                If unsure, say "I am not sure" instead of guessing.`,
          content: `you are a smart personal assistant, who answers the asked question.
          You have access to following tools:
          1. searchWeb({query}:{query: string}) //Search the latest information and realtime data on the internet. `,
        },
        {
          role: "user",
          // content: "Who is Virat Kohli ?",
          content:"When was iphone 16 launched ?"
        },
      ],
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

    const toolCalls = tool.choices[0].message.tool_calls;

    if(!toolCalls){
     console.log(`Assistant : ${tool.choices[0].message.content}`);
     return;
    }

    for(const tools of toolCalls){
     console.log(`tool : `,tools)
     const functionName = tools.function.name;
     const functionArgs = tools.function.arguments;

     if(functionName === 'webSearch'){
          const toolResult = await webSearch(JSON.parse(functionArgs));
          console.log(toolResult)
     }
    }


//     console.log(tool.choices[0].message.tool_calls);
  } catch (error) {
    console.log(error.message);
  }
};

callTool();

async function webSearch({ query }) {
  // Here we will do tavily api call

  console.log("Calling webSearch...");
  return `Iphone 16 was launched on 20 september 2024.`;
}

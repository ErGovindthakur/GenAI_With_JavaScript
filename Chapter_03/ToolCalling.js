import Groq from 'groq-sdk';
import dotenv from 'dotenv';

dotenv.config();

const groq = new Groq({apiKey:process.env.GROQ_API_KEY});

let callTool = async() => {
     try {
          const tool = await groq.chat.completions.create({
               model:"llama-3.3-70b-versatile",
               temperature:0,

               messages:[
                    {
                         role:'system',
                         content:`You are a smart personal assistant. 
                         - always reply in simple and easy words.
                         - keep the answer concise (preferably one sentence).
                         If unsure, say "I am not sure" instead of guessing.`
                    },
                    {
                         role:'user',
                         content:'Who is Virat Kohli ?'
                    }
               ]
          })

          console.log(tool.choices[0].message.content)
     } catch (error) {
          console.log(error.message)
     }
}

callTool();
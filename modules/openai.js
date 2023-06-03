import { Configuration, OpenAIApi } from "openai";
import { config } from 'dotenv';
import { systemMessage } from './system.js';

config();

// ----- Configure Open AI -----
const configuration = new Configuration({
    organization: process.env.ORG_ID,
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const createUserMessage = (batch) => {
    return { role: "user", content: batch.join('\n')}
}

const chatCompletion = (userMessage) => {
    return new Promise( async (resolve) => {
        try {
            const completion = await openai.createChatCompletion({ 
                model: "gpt-4", 
                messages: [systemMessage, userMessage] 
            });
            const response = completion.data.choices[0].message;
            resolve(response);

        } catch (error) {
            console.error('Error occurred during API call:', error);
            resolve(response);
            
        }
    })
}

export { createUserMessage, chatCompletion }
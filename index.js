import { read, write, batch } from './modules/csv.js';
import { createUserMessage, chatCompletion } from './modules/openai.js';

// 1. Read the categories.csv and add the contents into an array. Output should be an array of strings. 
const filePath = 'data/categories.csv';
const responseFilePath = 'data/response.csv';
let responseArray = [];
const batchSize = 100;
const categoriesArray = await read(filePath);

// 2. Batch the array of strings into batches of 10 items. 
const categoryBatches = batch({ categoriesArray, batchSize });

// 3. For each batch, call GPT 4 API with the system message and add results as a string into the results array. 
const processResponse = async () => {
    let i = 0
    for (let batch of categoryBatches) {
        console.log(`Fetching results for batch #${i + 1}...`);
        const userMessage = createUserMessage(batch);
        const response = await chatCompletion(userMessage);
        
        console.log(`Batch #${i + 1} complete!`);
        i += 1
        
        response.content.split('\n').forEach((item) => {
            let itemArray = item.split(': ');
            responseArray.push({category: itemArray[0], gender: itemArray[1]});
        })
    }
}

// 4. write the array of results into the CSV. 
processResponse().then(() => {
    responseArray = responseArray.flat();
    write({responseArray, responseFilePath});
})


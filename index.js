import { readCategoriesCSV, writeResponseCSV, batch } from './modules/csv.js';
import { createUserMessage, chatCompletion } from './modules/openai.js';

// 1. Read the categories.csv and add the contents into an array. Output should be an array of strings. 
const filePath = 'data/missing-categories.csv';
const responseFilePath = 'data/response-iterative.csv';
const batchSize = 59;
let offset = 0;
const categoriesArray = await readCategoriesCSV(filePath);

// 2. Batch the array of strings into batches of 10 items. 
const categoryBatches = batch({ categoriesArray, batchSize });

// 3. For each batch, call GPT 4 API with the system message and add results as a string into the results array. 

for (offset; offset < categoryBatches.length; offset++) {
    console.log(`Fetching results for batch #${offset + 1}...`);
    
    let responseArray = [];    
    const userMessage = createUserMessage(categoryBatches[offset]);
    const response = await chatCompletion(userMessage);
    
    console.log(`Batch #${offset + 1} complete!`);
    
    response.content.split('\n').forEach((item) => {
        let itemArray = item.split(': ');
        responseArray.push({category: itemArray[0], gender: itemArray[1]});
    })

    await writeResponseCSV({responseArray, responseFilePath});
}
import { readCategoriesCSV, writeResponseCSV, parseResponseCSV, batch } from './csv.js';
import fs from 'fs';
import csv from 'csv-parser';

// 1. parse categories csv and add all contents into an array; 

const categoriesFilePath = "data/categories.csv";
const responseIterativeFilePath = "data/response-iterative.csv";
const missingCategoriesCSV = "data/missing-categories.csv";
let responseArray = [];

const categoriesArray = await readCategoriesCSV(categoriesFilePath);
// 2. Parse response-iterative csv and add all contents into an array; 

responseArray = await parseResponseCSV(responseIterativeFilePath, responseArray);

const seen = {}; // Temporary object to track unique values
const uniqueResponseArray = responseArray.filter(obj => {
  const key = obj.category; // Specify the key you want to check for uniqueness

  if (!seen[key]) {
    seen[key] = true;
    return true;
  }

  return false;
});

// 3. Check for duplicates in the response-iterative array.
const missingCategoryArray = categoriesArray.filter(item => {
    const values = uniqueResponseArray.map(obj => obj.category);
    return !values.includes(item);
});

// 4. Check for missing items from categories array in the response-iterative array; 
console.log('missingCategoryArray Length: ', missingCategoryArray.length);

// 5. Add all missing items into it's own CSV.
const csvWriter = fs.createWriteStream(missingCategoriesCSV);

// Write the data to the CSV file
missingCategoryArray.forEach((row) => csvWriter.write(`${row}\n`));

// Close the CSV writer
csvWriter.end();

console.log(`Completed writing ${missingCategoryArray.length} rows.\n`);
// 6. Run that CSV through the openAI function.


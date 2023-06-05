import fs from 'fs';
import csv from 'csv-parser';

const responseFilePath = 'data/response.csv';
const responseArray = [];

const parseResponseCSV = (responseFilePath, responseArray) => {
    return new Promise((resolve) => {
        fs.createReadStream(responseFilePath)
        .pipe(csv())
        .on('data', (row) => {
            responseArray.push(row);
        })
        .on('end', () => {
            console.log('responseArray: ', responseArray);
            resolve(responseArray);
        });
    })
}

parseResponseCSV(responseFilePath, responseArray);
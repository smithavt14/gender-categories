import fs from 'fs';
import csv from 'csv-parser';

const readCategoriesCSV = (filePath) => {
    return new Promise((resolve) => {
        console.log('CSV file processing...')
        let categoriesArray = []
        
        fs.createReadStream(filePath)
        .pipe(csv({ raw: true }))
        .on('data', (row) => {
            Object.values(row).forEach((value) => {
                categoriesArray.push(value.toString());
            });
        })
        .on('end', () => {
            console.log('CSV file successfully processed.');
            resolve(categoriesArray);
        })
    })
}

const parseResponseCSV = (responseFilePath, responseArray) => {
    return new Promise((resolve) => {
        fs.createReadStream(responseFilePath)
        .pipe(csv())
        .on('data', (row) => {
            responseArray.push(row);
        })
        .on('end', () => {
            resolve(responseArray);
        });
    })
}

const batch = ({batchSize, categoriesArray}) => {
    console.log(`Creating batches of ${batchSize} categories...`)
    const batches = [];

    for (let i = 0; i < categoriesArray.length; i += batchSize) {
        const batch = categoriesArray.slice(i, i + batchSize);
        batches.push(batch);
    }
    console.log(`${batches.length} batches created.\n`)
    return batches;
}

const writeResponseCSV = ({ responseArray, responseFilePath }) => {
    return new Promise( async (resolve) => {
        console.log('Parsing Existing Response File...')
        responseArray = await parseResponseCSV(responseFilePath, responseArray);
        
        const csvWriter = fs.createWriteStream(responseFilePath);
    
        // Write the CSV header
        csvWriter.write('category,gender\n');
    
        // Write the data to the CSV file
        responseArray.forEach((row) => {
            const {category, gender} = row;
            csvWriter.write(`${category},${gender}\n`)
        });
    
        // Close the CSV writer
        csvWriter.end();
        console.log(`Completed writing ${responseArray.length} rows.\n`);
        resolve();
    })
}

export { readCategoriesCSV, writeResponseCSV, parseResponseCSV, batch }
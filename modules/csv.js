import fs from 'fs';
import csv from 'csv-parser';

const read = (filePath) => {
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

const batch = ({batchSize, categoriesArray}) => {
    console.log(`Creating batches of ${batchSize} categories...`)
    const batches = [];

    for (let i = 0; i < categoriesArray.length; i += batchSize) {
        const batch = categoriesArray.slice(i, i + batchSize);
        batches.push(batch);
    }
    console.log(`${batches.length} batches created.`)
    return batches;
}

const write = ({ responseArray, responseFilePath }) => {
    console.log('responseArray: ', responseArray);
    console.log('Writing to CSV file...');
    const csvWriter = fs.createWriteStream(responseFilePath);

    // Write the CSV header
    csvWriter.write('Category,Gender\n');

    // Write the data to the CSV file
    responseArray.forEach((row) => {
        const {category, gender} = row;
        csvWriter.write(`${category},${gender}\n`)
    });

    // Close the CSV writer
    csvWriter.end();
    console.log('Writing complete.');
}

// Next to do: 
// Iteratively add to the CSV file so that if it stops half way, can start from where it stopped. 

export { read, write, batch }
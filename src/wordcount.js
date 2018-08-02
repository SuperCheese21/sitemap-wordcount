const fs = require('fs');

const { parseUrls, getWordCount } = require('./util.js');

/**
 * Gets word count of each URL in URL array
 */
(() => {
    // Create file write stream
    const writeStream = fs.createWriteStream('./output/wordcount.csv');

    // Write CSV header to console/file
    const header = 'URL' + '\t' + 'Word Count';
    writeStream.write(header + '\n');
    console.log(header);

    // Create URL array form urls.txt file
    const urls = parseUrls();

    // Get word count on each URL in array and print to console/file
    urls.forEach(url => {
        getWordCount(url)
            .then(res => {
                const line = url + '\t' + res;
                // Format CSV data with tab and line break and append to csv file
                writeStream.write(line + '\n');
                console.log(line);
            })
            .catch(err => {
                console.error(err.message);
            });
    });
})();

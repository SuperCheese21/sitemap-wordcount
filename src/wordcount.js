const fs = require('fs');
const rp = require('request-promise');

const htmlToText = require('html-to-text');
const wordCount = require('@iarna/word-count');

const { parseUrls } = require('./util.js');

/**
 * Async function that gets the word count of a website
 * @param  {String}  url Website URL to get word count of
 * @return {Promise}     Promise object representing word count of the website
 */
const getWordCount = async url => {
    return await rp(url).then(html => {
        const text = htmlToText.fromString(html, {
            wordwrap: false,
            ignoreHref: true,
            ignoreImage: true
        });
        return wordCount(text);
    });
}

/**
 * Gets word count of each URL in URL array
 */
(() => {
    // Create file write stream
    const writeStream = fs.createWriteStream('./output/wordcount.csv');

    const header = 'URL' + '\t' + 'Word Count';
    writeStream.write(header + '\n');
    console.log(header);

    // Create URL array form urls.txt file
    const urls = parseUrls();

    urls.forEach(url => {
        getWordCount(url)
            .then(res => {
                const line = url + '\t' + res;
                // Format CSV data with tab and line break and append to csv file
                writeStream.write(line + '\n');
                console.log(line);
            })
            .catch(err => {
                console.error('Error: ' + err);
            });
    });
})();

module.exports = getWordCount;

const fs = require('fs');
const rp = require('request-promise');
const htmlToText = require('html-to-text');
const wordCount = require('@iarna/word-count');

/**
 * Creates an array of URLs separated by line breaks
 * @return {Array} Array of URL strings
 */
const parseUrls = () => {
    const urlArr = [];
    const urls = fs.readFileSync('./src/urls.txt').toString().split('\n');
    urls.forEach(url => {
        if (url)
            urlArr.push(url);
        }
    );
    return urlArr;
};

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

module.exports = {
    parseUrls,
    getWordCount
};

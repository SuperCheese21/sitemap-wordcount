const fs = require('fs');

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

module.exports = {
    parseUrls
};

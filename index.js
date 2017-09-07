const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');

const URL = 'https://welocalize.com';

const generator = SitemapGenerator(URL, {
    stripQuerystring: false
});

var writeStream = fs.createWriteStream('./sitemap.txt');

console.log('Generating sitemap for ' + URL);

generator.on('add', (url) => {
    console.log(' added ' + url);
    writeStream.write(url + '\n');
});

generator.on('ignore', (url) => {
    console.log(' ignored ' + url);
    writeStream.write(url + '\n');
});

generator.on('error', (error) => {
    console.log(' error ' + error.code + ': ' + error.message + ' - ' + error.url);
});

generator.on('done', (stats) => {
    console.log('done');
    console.log(JSON.stringify(stats, null, '\t'));
});

generator.start();

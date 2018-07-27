const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');

const { parseUrls } = require('./util.js');
const getWordCount = require('./wordcount.js');

const urls = parseUrls();

const generateSitemap = url => {
    const path = './output/sitemaps/' + url.split('/')[2] + '_sitemap';
    const generator = SitemapGenerator(url, {
        filepath: path + '.xml'
    });
    const writeStream = fs.createWriteStream(path + '.txt');

    let total = 0;

    console.log('Generating sitemap for ' + url);

    generator.on('add', url => {
        getWordCount(url)
            .then(count => {
                const line = url + '\t' + count;
                writeStream.write(line + '\n');
                console.log(' Added ' + line);
                total += count;
            })
            .catch(err => {
                console.error(err);
            });
    });

    generator.on('ignore', url => {
        console.log(' Ignored ' + url);
    });

    generator.on('error', err => {
        console.log(' Error ' + err.code + ': ' + err.message + ' - ' + err.url);
    });

    generator.on('done', stats => {
        writeStream.write('Total Word Count: ' + total + '\n');
        console.log('Total Word Count: ' + total);
        if (urls.length) {
            generateSitemap(urls.shift());
        }
    });

    generator.start();
}

generateSitemap(urls.shift());

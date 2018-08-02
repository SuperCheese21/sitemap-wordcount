const fs = require('fs');
const SitemapGenerator = require('sitemap-generator');

const { parseUrls, getWordCount } = require('./util.js');

const urls = parseUrls();

/**
 * Generates sitemap with word counts for specified URL
 * @param  {String} url URL to generate sitemap for
 */
const generateSitemap = url => {
    const path = './output/sitemaps/' + url.split('/')[2] + '_sitemap';
    const generator = SitemapGenerator(url, {
        filepath: path + '.xml'
    });
    const writeStream = fs.createWriteStream(path + '.txt');

    // Running total of word counts for entire site
    let total = 0;

    console.log('Generating sitemap for ' + url);

    // Get the word count of each URL as it is added to sitemap
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

    // Do not add URL if it is ignored
    generator.on('ignore', url => {
        console.log(' Ignored ' + url);
    });

    // Do not add URL on an HTTP error
    generator.on('error', err => {
        console.log(' Error ' + err.code + ': ' + err.message + ' - ' + err.url);
    });

    // Write total word count to console/file, proceed to next website in urls.txt
    generator.on('done', stats => {
        writeStream.write('Total Word Count: ' + total + '\n');
        console.log('Total Word Count: ' + total);
        if (urls.length) {
            generateSitemap(urls.shift());
        }
    });

    // Start sitemap generator
    generator.start();
}

// Initial function call
generateSitemap(urls.shift());

const SitemapGenerator = require('sitemap-generator');
const fs = require('fs');

const { parseUrls } = require('./util.js');

const urls = parseUrls();

const generateSitemap = url => {
    const generator = SitemapGenerator(url, {
        filepath: './output/sitemaps/' + url.split('/')[2] + '_sitemap.xml'
    });

    console.log('Generating sitemap for ' + url);

    generator.on('add', url => {
        console.log(' added ' + url);
    });

    generator.on('ignore', url => {
        console.log(' ignored ' + url);
    });

    generator.on('error', err => {
        console.log(' error ' + err.code + ': ' + err.message + ' - ' + err.url);
    });

    generator.on('done', stats => {
        console.log(JSON.stringify(stats, null, '\t'));
        if (urls.length) {
            generateSitemap(urls.shift());
        }
    });

    generator.start();
}

generateSitemap(urls.shift());

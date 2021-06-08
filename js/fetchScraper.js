/* Following along with 
   https://www.scrapingbee.com/blog/node-fetch/
   STARTED: 07 MAY 2021 */

const fetch = require('node-fetch');
const load = require('cheerio');
const launch = require('puppeteer');
// import { URL, URLSearchParams } from 'url';

/* When fetch is called, it returns a promise which will resolve to a Response object 
as soon as the server responds with the headers */ 
const getReddit = async () => {
    const response = await fetch('https://reddit.com/'); // html response
    const body = await response.text();

    // Parse html for selector
    const $ = load(body);
    const titleList = [];
    // Post titles are under <h1 class="_eYtD2XCVieq6emjKBH3m">
    $('._eYtD2XCVieq6emjKBH3m').each((i, title) => {
        const titleNode = $(title);
        const titleText = titleNode.text();
        titleList.push(titleText);

    });

    console.log(titleList); // prints a chock full of HTML richness
}

const getGartner = async (url) => {
    const browser = await launch({
        headless: true,
        slowMo: 50,
    });
    const page = await browser.newPage();
    await page.goto(url);

    // CREDIT JOZOTT @ STACK: 
    // https://stackoverflow.com/questions/58087966/how-to-click-element-in-puppeteer-using-xpath
    // Locate 'View All' button by xpath, then click it.
    const elements = await page.$x('//*[@id="pagination-bottom"]/div[3]/a');
    await elements[0].click();
    
    // Removing this breaks it. Go figure?
    // debugger;
    const body = await page.content();
    
    // Pulls job titles and pushes them to a list
    const titleSelector = '#search-results-list > ul > li > a > h2';
    const titleList = [];
    const locationList = [];
    const $ = await load(body);
    $(titleSelector).each(
        (i, title) => {
            const titleNode = $(title);
            const titleText = titleNode.text(); 
            titleList.push(titleText);
        }
    );

    // Pulls job locations and pushes them to a list
    const locationSelector = '#search-results-list > ul > li > a > .job-location';
    $(locationSelector).each(
        (i, location) => {
            const locationNode = $(location);
            const locationText = locationNode.text();
            locationList.push(locationText);
        }
    );
    
    // Print both lists together pairwise
    const found_log = console.log(titleList.length+" jobs found!\n\n");
    for (var i = 0; i < titleList.length - 1; i++) {
        console.log(titleList[i], "\n  ", locationList[i], "\n");
    }
    found_log;

    await browser.close();
}
        
{
/* (async () => {
	const url = new URL('https://some-url.com');
	const params = { param: 'test'};
	const queryParams = new URLSearchParams(params).toString();
	url.search = queryParams;
	
	const fetchOptions = {
		method: 'POST',
		headers: { 'cookie': '<cookie>', },
		body: JSON.string({ hello: 'world' }),
	};

	await fetch(url, fetchOptions);
})();


const newProductsPagePromise = fetch('https://some-website.com/new-products');
const recommendedProductsPagePromise = fetch('https://some-website.com/recommended-products');

// Returns a promise that resolves to a list of the results
Promise.all([
    newProductsPagePromise, 
    recommendedProductsPagePromise
]);  */ }

// getReddit();
getGartner('https://jobs.gartner.com/category/technology-jobs/494/58617/1');
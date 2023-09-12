const puppeteer = require("puppeteer");
const cheerio = require("cheerio");

const getHtml = async (url, selector) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector(selector);

  const htmlContent = await page.content();
  return cheerio.load(htmlContent);
};

module.exports = { getHtml };

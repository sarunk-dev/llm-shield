import axios from 'axios';
import * as cheerio from 'cheerio';

export const scrapeWebContent = async (url) => {
  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const textContent = $("body").text().replace(/\s+/g, " ").trim(); // Scraping text
    const imageElements = $("img");
    let images = [];
    let captions = [];

    imageElements.each((i, elem) => {
      let src = $(elem).attr("src");
      let alt = $(elem).attr("alt") || "No caption available";
      if (src && !src.startsWith("http")) {
        src = new URL(src, url).href;
      }
      if (src) {
        images.push(src);
        captions.push(alt);
      }
    });

    return { textContent, images, captions };
  } catch (error) {
    throw new Error(`Failed to scrape the webpage: ${error.message}`);
  }
};

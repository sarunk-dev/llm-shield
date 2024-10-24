import express from 'express';
import axios from 'axios';
import * as cheerio from 'cheerio';

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Fetch the webpage content
    const response = await axios.get(url);
    const html = response.data;

    // Parse the HTML using Cheerio
    const $ = cheerio.load(html);
    const textContent = $('body').text().replace(/\s+/g, ' ').trim();

    // Extract images and captions
    const imageElements = $('img');
    let images = [];
    let captions = [];

    imageElements.each((i, elem) => {
      let src = $(elem).attr('src');
      let alt = $(elem).attr('alt') || 'No caption available';
      if (src && !src.startsWith('http')) {
        src = new URL(src, url).href;
      }
      if (src) {
        images.push(src);
        captions.push(alt);
      }
    });

    // Pass the scraped content as JSON to the frontend
    res.json({
      text: textContent,
      images: images,
      captions: captions,
    });
  } catch (error) {
    console.error('Error scraping the page:', error);
    res.status(500).json({ error: 'Failed to scrape the page' });
  }
});

export default router;

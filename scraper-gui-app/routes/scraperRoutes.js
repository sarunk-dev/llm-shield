import express from 'express';
import { scrapeWebContent } from '../services/scraperService.js';  // Import from services

const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Use the service to scrape the content
    const { textContent, images, captions } = await scrapeWebContent(url);

    // Send the scraped content to the frontend
    res.json({
      text: textContent,
      images: images,
      captions: captions,
    });
  } catch (error) {
    console.error('Error scraping the page:', error.message);
    res.status(500).json({ error: 'Failed to scrape the page' });
  }
});

export default router;

import express from 'express';
import { scrapeWebContent } from '../services/scraperService.js';  // Import from services
import { generateWebSummary, generateImageSummary } from '../services/watsonxService.js';  // Import WatsonX services


const router = express.Router();

router.post('/', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Use the service to scrape the content
    const { textContent, images, captions } = await scrapeWebContent(url);

    // Generate a summary for the text content
    const summaryText = await generateWebSummary(textContent);

    // Generate summaries for the image captions
    const summarizedCaptions = await Promise.all(
      captions.map(async (caption) => await generateImageSummary(caption))
    );

    // Return the summarized text and captions along with image URLs
    res.json({
      summaryText,
      images: images.map((url, index) => ({
        url,
        caption: summarizedCaptions[index],
      })),
    });
  } catch (error) {
    console.error('Error scraping the page:', error.message);
    res.status(500).json({ error: 'Failed to scrape the page' });
  }
});

export default router;

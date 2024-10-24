import express from "express";
import { scrapeWebContent } from "../services/scraperService.js";
import {
  generateWebSummary,
  generateImageSummary,
} from "../services/watsonxService.js";

const router = express.Router();
let summaryData = {}; // Store the summary data in-memory

router.post("/", async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  try {
    console.log("Now scraping");
    const { textContent, images, captions } = await scrapeWebContent(url);
    const summaryText = await generateWebSummary(textContent);
    const summarizedCaptions = await Promise.all(
      captions.map(async (caption) => await generateImageSummary(caption))
    );

    console.log("Scraping Complete");

    summaryData = {
      summaryText,
      images: images.map((url, index) => ({
        url,
        caption: summarizedCaptions[index],
      })),
    };

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("Error scraping the page:", error.message);
    res.status(500).json({ error: "Failed to scrape the page" });
  }
});

router.get("/get-summary", (req, res) => {
  res.json(summaryData);
});

export default router;

const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 5001;

app.use(cors());
app.use(express.json());

let summaries = {};

app.get('/summarize', async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).json({ error: 'URL parameter is required.' });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    const textContent = $('body').text();
    const imageElements = $('img');
    let images = [];

    imageElements.each((i, elem) => {
      let src = $(elem).attr('src');
      if (src && !src.startsWith('http')) {
        src = new URL(src, url).href;
      }
      if (src) {
        images.push(src);
      }
    });

    const summaryText = await generateSummary(textContent);
    const imageCaptions = await generateImageCaptions(images);

    const summaryId = uuidv4();
    summaries[summaryId] = {
      summaryText,
      images: imageCaptions,
    };

    res.json({ summaryId });
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to process the URL.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

app.get('/summary/:id', (req, res) => {
  const id = req.params.id;
  const summary = summaries[id];

  if (!summary) {
    return res.status(404).json({ error: 'Summary not found.' });
  }

  res.json(summary);
});


async function generateSummary(text) {
  return 'This is a generated summary of the content.';
}

async function generateImageCaptions(imageUrls) {
  return imageUrls.map((url) => ({
    url,
    caption: 'This is a caption for the image.',
  }));
}

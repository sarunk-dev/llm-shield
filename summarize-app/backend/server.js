const express = require("express");
const cors = require("cors");
const axios = require("axios");
const cheerio = require("cheerio");
const { v4: uuidv4 } = require("uuid");
const { WatsonXAI } = require("@ibm-cloud/watsonx-ai");

const app = express();
const port = 3001;

const watsonxAIService = WatsonXAI.newInstance({
  version: "2024-03-14",
  serviceUrl: "https://us-south.ml.cloud.ibm.com",
});

const textGenRequestParametersModel = {
  max_new_tokens: 4000,
  stop_sequences: ["<|eot_id|>"],
  decoding_method: "sample",
  random_seed: null,
  temperature: 0.0,
  top_k: 50,
  top_p: 1,
  repetition_penalty: 1,
};

const textGenRequestModerationsModel = {
  hap: {
    input: {
      enabled: true,
      threshold: 0.5,
      mask: {
        remove_entity_value: true,
      },
    },
    output: {
      enabled: true,
      threshold: 0.5,
      mask: {
        remove_entity_value: true,
      },
    },
  },
};

const params = {
  input: "",
  modelId: "meta-llama/llama-3-2-3b-instruct",
  projectId: "6217adff-b167-4467-9298-50d6b0220292",
  parameters: textGenRequestParametersModel,
  moderations: textGenRequestModerationsModel,
};

app.use(cors());
app.use(express.json());

let summaries = {};

app.get("/summarize", async (req, res) => {
  const url =
    process.env.NODE_ENV === "production"
      ? req.query.url.replace("localhost", "host.docker.internal")
      : req.query.url.replace("localhost", "127.0.0.1");
  console.log(`Attempting to fetch: ${url}`);
  if (!url) {
    return res.status(400).json({ error: "URL parameter is required." });
  }

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    let textContent = $("body").text();
    textContent = textContent.replace(/\s+/g, " ").trim();
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

    const summaryText = await generateWebSummary(textContent);

    const summarizedImages = await Promise.all(
      captions.map(async (caption) => {
        const imageSummary = await generateImageSummary(caption);
        return imageSummary;
      })
    );

    const summaryId = uuidv4();
    summaries[summaryId] = {
      summaryText,
      images: images.map((url, index) => ({
        url,
        caption: summarizedImages[index],
      })),
    };

    res.json({ summaryId });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Failed to process the URL." });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on port ${port}`);
});

app.get("/summary/:id", (req, res) => {
  const id = req.params.id;
  const summary = summaries[id];

  if (!summary) {
    return res.status(404).json({ error: "Summary not found." });
  }

  res.json(summary);
});

async function generateWebSummary(text) {
  // console.log(`*** Beginning of Text to Summarize ***\n${text}`);
  // console.log(`*** End of Text to Summarize ***`);
  try {
    const system = `Summarize the provided text without any introductory phrases or additional explanations. Only return the summary directly, and keep it under 100 words. Avoid mentioning the word limit or restating the instructions."

Example 1: User: The research found that exercise has significant benefits on mental health, reducing anxiety, depression, and improving cognitive function.
    
Assistant: Exercise significantly benefits mental health by reducing anxiety, depression, and enhancing cognitive function.
    
Example 2: User: Online education platforms have grown rapidly, offering flexibility, affordability, and access to a variety of courses for learners around the world.
    
Assistant: Online education platforms provide flexible, affordable learning options with access to diverse courses globally.`;
    params.input = generateLlamaPrompt(system, text);
    console.log(`*** Beginning of Text to Summarize ***\n${params.input}`);
    console.log(`*** End of Text to Summarize ***`);
    const res = await watsonxAIService.generateText(params);
    console.log("\n\n***** WEBSITE SUMMARY FROM MODEL *****");
    console.log(res.result.results[0].generated_text);
    return `${res.result.results[0].generated_text}`;
  } catch (err) {
    console.warn(err);
    return "Failed to generate summary due to an error.";
  }
}

async function generateImageSummary(text) {
  console.log(`*** Beginning of Image Text to Summarize ***\n${text}`);
  console.log(`*** End of Image Text to Summarize ***`);
  try {
    const system = `Summarize the provided text without any introductory phrases or additional explanations. Only return the summary directly, and keep it under 10 words. Avoid mentioning the word limit or restating the instructions."

Example 1: User: The research found that exercise has significant benefits on mental health, reducing anxiety, depression, and improving cognitive function.
    
Assistant: Exercise significantly benefits mental health.
    
Example 2: User: Online education platforms have grown rapidly, offering flexibility, affordability, and access to a variety of courses for learners around the world.
    
Assistant: Online education platforms provide affordable courses globally.`;
    params.input = generateLlamaPrompt(system, text);
    const res = await watsonxAIService.generateText(params);
    console.log("\n\n***** IMAGE SUMMARY FROM MODEL *****");
    console.log(res.result.results[0].generated_text);
    return res.result.results[0].generated_text;
  } catch (err) {
    console.warn(err);
    return "Failed to generate image summary due to an error.";
  }
}

function generateLlamaPrompt(systemPrompt, userPrompt) {
  const startHeaderId = "<|start_header_id|>";
  const endHeaderId = "<|end_header_id|>";
  const eotId = "<|eot_id|>";

  const formattedPrompt = `
${startHeaderId}system${endHeaderId}
${systemPrompt}
${eotId}
${startHeaderId}user${endHeaderId}
${userPrompt}
${eotId}
`;

  return formattedPrompt;
}

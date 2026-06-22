import { WatsonXAI } from "@ibm-cloud/watsonx-ai";

const watsonxAIService = WatsonXAI.newInstance({
  version: "2024-03-14",
  serviceUrl: "https://us-south.ml.cloud.ibm.com",
});

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

const params = {
  input: "",
  modelId: "meta-llama/llama-4-maverick-17b-128e-instruct-fp8",
  projectId: "skills-network", // Can also be replaced with your own project ID
  parameters: textGenRequestParametersModel,
  moderations: textGenRequestModerationsModel,
};

export async function generateWebSummary(text) {
  const systemPrompt = `You are a helpful assistant.`;
  const userPrompt = `Help me summarize this text in under 100 words: ${text}`;

  params.input = generateLlamaPrompt(systemPrompt, userPrompt);

  try {
    const res = await watsonxAIService.generateText(params);
    return res.result.results[0].generated_text;
  } catch (error) {
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

export async function generateImageSummary(caption) {
  const systemPrompt = `You are a helpful assistant.`;
  const userPrompt = `Summarize the following text: ${caption}`;

  params.input = generateLlamaPrompt(systemPrompt, userPrompt);

  try {
    const res = await watsonxAIService.generateText(params);
    return res.result.results[0].generated_text;
  } catch (error) {
    throw new Error(`Failed to summarize image caption: ${error.message}`);
  }
}

// Helper function for generating the prompt
function generateLlamaPrompt(systemPrompt, userPrompt) {
  const startHeaderId = "<|start_header_id|>";
  const endHeaderId = "<|end_header_id|>";
  const eotId = "<|eot_id|>";

  return `
    ${startHeaderId}system${endHeaderId}
    ${systemPrompt}
    ${eotId}
    ${startHeaderId}user${endHeaderId}
    ${userPrompt}
    ${eotId}
  `;
}
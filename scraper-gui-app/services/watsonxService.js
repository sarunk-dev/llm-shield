export async function generateWebSummary(text, firstName, experienceLevel) {
  const systemPrompt = `${firstName} is a user with the following experience level: ${experienceLevel}. Summarize the text provided in under 100 words.`;
  const userPrompt = `Help me summarize this article: ${text}`;

  const params = {
    input: generateLlamaPrompt(systemPrompt, userPrompt),
    modelId: 'meta-llama/llama-3-2-3b-instruct',
    parameters: textGenRequestParametersModel,
  };

  try {
    const res = await watsonxAIService.generateText(params);
    return res.result.results[0].generated_text;
  } catch (error) {
    throw new Error(`Failed to generate summary: ${error.message}`);
  }
}

export async function generateImageSummary(caption, firstName, experienceLevel) {
  const systemPrompt = `${firstName} is a user with the following experience level: ${experienceLevel}. Summarize the caption in under 20 words.`;
  const userPrompt = `Summarize the following caption: ${caption}`;

  const params = {
    input: generateLlamaPrompt(systemPrompt, userPrompt),
    modelId: 'meta-llama/llama-3-2-3b-instruct',
    parameters: textGenRequestParametersModel,
  };

  try {
    const res = await watsonxAIService.generateText(params);
    return res.result.results[0].generated_text;
  } catch (error) {
    throw new Error(`Failed to summarize image caption: ${error.message}`);
  }
}

// Helper function for generating the prompt
function generateLlamaPrompt(systemPrompt, userPrompt) {
  const startHeaderId = '<|start_header_id|>';
  const endHeaderId = '<|end_header_id|>';
  const eotId = '<|eot_id|>';

  return `
    ${startHeaderId}system${endHeaderId}
    ${systemPrompt}
    ${eotId}
    ${startHeaderId}user${endHeaderId}
    ${userPrompt}
    ${eotId}
  `;
}

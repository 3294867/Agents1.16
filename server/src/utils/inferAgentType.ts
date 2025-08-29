import { client } from "../index";

const inferAgentType = async (question: string): Promise<string | null> => {
  const query = `
    Choose the most appropriate agent type for the following question: ${question}.
    Available agent types: "general", "math", "geography", "literature".
    Return in lower case agent type only.
  `;

  const apiResponse = await client.responses.create({
    model: "gpt-3.5-turbo",
    input: query,
  });
  if (!apiResponse.output_text) return null;

  return apiResponse.output_text;
};

export default inferAgentType;
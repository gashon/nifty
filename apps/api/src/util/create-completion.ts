import status from "http-status";
import openai from "@/lib/openai";
import logger from "@/lib/logger";
import { createQuizGenerationPrompt } from "@/util"
import { CustomException } from "@/exceptions";

export const generateQuizFromNote = async (noteContent: string) => {
  const prompt = createQuizGenerationPrompt(noteContent);
  try {
    // rough estimate of number of tokens
    // todo tokenize prompt instead of splitting on spaces
    const numTokens = prompt.split(" ").length
    const response = await openai.createCompletion({
      prompt,
      model: "text-davinci-003",
      max_tokens: 3750 - numTokens,
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      stream: false
    });

    const choice = response.data.choices[0]
    if (choice.finish_reason == "length")
      throw new Error("Too many tokens in prompt :(")

    logger.info(`Generated quiz: ${JSON.stringify(choice)}`);
    return choice.text
  } catch (err) {
    logger.error(`Error generating quiz: ${JSON.stringify(err)}}`);
    // @ts-ignore
    const message = err.response?.data?.error?.message || err?.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}
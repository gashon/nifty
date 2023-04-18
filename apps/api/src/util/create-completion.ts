import status from "http-status";
import openai from "@/lib/openai";
import logger from "@/lib/logger";
import {
  countTokens,
  createMultipleChoiceQuizGenerationPrompt,
  createFreeResponseQuizGenerationPrompt,
  createFreeResponseGradingPrompt
} from "@/util"
import { CustomException } from "@/exceptions";

const getOpenAIResponse = async (prompt: string) => {
  // rough estimate of number of tokens
  const numTokens = countTokens(prompt);
  const response = await openai.createCompletion({
    prompt,
    model: "text-davinci-003",
    max_tokens: 3700 - numTokens, //~
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    stream: false
  });

  const choice = response.data.choices[0]
  if (choice.finish_reason == "length")
    throw new Error("Too many tokens in prompt :(")

  logger.info(`Generated: ${JSON.stringify(choice)}`);
  return choice.text
}


export const generateMultipleChoiceQuizFromNote = async (noteContent: string) => {
  const prompt = createMultipleChoiceQuizGenerationPrompt(noteContent);
  try {
    return getOpenAIResponse(prompt)
  } catch (err) {
    logger.error(`Error generating quiz: ${JSON.stringify(err)}}`);
    // @ts-ignore
    const message = err.response?.data?.error?.message || err?.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}


export const generateFreeResponseGrading = async (freeResponseQuestionsAndAnswers: string) => {
  const prompt = createFreeResponseGradingPrompt(freeResponseQuestionsAndAnswers);

  try {
    return getOpenAIResponse(prompt)
  } catch (err) {
    logger.error(`Error grading free response: ${JSON.stringify(err)}}`);
    // @ts-ignore
    const message = err.response?.data?.error?.message || err?.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}


export const generateFreeResponseQuizFromNote = async (noteContent: string) => {
  const prompt = createFreeResponseQuizGenerationPrompt(noteContent);
  try {
    return getOpenAIResponse(prompt)
  } catch (err) {
    logger.error(`Error generating quiz: ${JSON.stringify(err)}}`);
    // @ts-ignore
    const message = err.response?.data?.error?.message || err?.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}
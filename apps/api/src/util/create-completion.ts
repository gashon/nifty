import status from "http-status";
import { CreateCompletionResponse } from "openai";
import { AxiosResponse } from "axios";
import openai from "@/lib/openai";
import logger from "@/lib/logger";
import {
  countTokens,
} from "@/util"
import { CustomException } from "@/exceptions";

const getOpenAIResponse = async (prompt: string) => {
  const model = "text-davinci-003"

  // rough estimate of number of tokens
  const numTokens = countTokens(prompt, model);
  logger.info(`Sending openai request: ${JSON.stringify(prompt)} -- numTokens: ${numTokens}`)

  const response = await openai.createCompletion({
    prompt,
    model,
    max_tokens: 4096 - numTokens,
    temperature: 0.2,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    stream: false,
    stop: null,
  });
  logger.info(`Successfully received openai response: ${JSON.stringify(response.data)}`);

  const choice = response.data.choices[0]
  if (choice.finish_reason == "length")
    throw new Error("Too many tokens in prompt :(")

  return choice.text
}

export const sendOpenAIRequest = async (prompt: string) => {
  try {
    return getOpenAIResponse(prompt)
  } catch (err) {
    console.log("ERR", err)
    logger.error(`Error sending openai request: ${JSON.stringify(err)}}`);
    // @ts-ignore
    const message = err.response?.data?.error?.message || err?.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}

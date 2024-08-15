import status from 'http-status';
import openai from '@nifty/api/lib/openai';
import logger from '@nifty/api/lib/logger';
import { countTokens } from '@nifty/api/util';
import { CustomException } from '@nifty/api/exceptions';

const TOKEN_LIMIT = 4096;

const getOpenAIResponse = async (prompt: string) => {
  const model = 'gpt-3.5-turbo';

  // rough estimate of number of tokens
  const numTokens = countTokens(prompt, model);
  logger.info(
    `Sending openai request: ${JSON.stringify(
      prompt
    )} -- numTokens: ${numTokens}`
  );

  const response = await openai.createChatCompletion({
    model,
    messages: [
      {
        role: 'system',
        content: prompt,
      },
    ],
    max_tokens: TOKEN_LIMIT - numTokens,
    temperature: 0.2,
    frequency_penalty: 0.5,
    presence_penalty: 0.5,
    stream: false,
    stop: undefined,
  });
  logger.info(
    `Successfully received openai response: ${JSON.stringify(response.data)}`
  );

  if (response.data?.usage) {
    logger.info(`OpenAI usage: ${JSON.stringify(response.data.usage)}`);
  }

  const choice = response.data.choices[0];
  if (choice.finish_reason == 'length')
    throw new Error('Too many tokens in prompt :(');

  if (!choice.message) throw new Error('No text in openai response :(');

  logger.info(`OpenAI response: ${JSON.stringify(choice.message)}`);

  return choice.message.content;
};

export const sendOpenAIRequest = async (prompt: string) => {
  try {
    return getOpenAIResponse(prompt);
  } catch (err) {
    logger.error(`Error sending openai request: ${JSON.stringify(err)}}`);
    // @ts-ignore
    const message = err.response?.data?.error?.message || err?.message;
    throw new CustomException(message, status.BAD_REQUEST);
  }
};

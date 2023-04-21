import { Tiktoken, TiktokenModel, encoding_for_model } from "@dqbd/tiktoken"


function countTokens(text: string, model: TiktokenModel): number
function countTokens(text: string, tokenizer: Tiktoken): number
function countTokens(text: string, modelOrTokenizer: Tiktoken | TiktokenModel): number {
  let tokenizer: Tiktoken;
  if (typeof modelOrTokenizer === "string") {
    tokenizer = encoding_for_model(modelOrTokenizer);
  } else {
    tokenizer = modelOrTokenizer;
  }

  const tokens = tokenizer.encode(text);
  return tokens.length;
}

export { countTokens };
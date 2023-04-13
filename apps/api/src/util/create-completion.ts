import status from "http-status";
import openai from "@/lib/openai";
import { createQuizGenerationPrompt } from "@/util"
import { CustomException } from "@/exceptions";

export const generateQuizFromNote = async (noteContent: string) => {
  const prompt = createQuizGenerationPrompt(noteContent);
  try {
    // todo validate prompt token count
    // don't stream the response, just return the data
    const response = await openai.createCompletion({
      prompt,
      model: "text-davinci-003",
      temperature: 0.7,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      stream: false
    });

    const choice = response.data.choices[0]
    if (choice.finish_reason == "length")
      throw new Error("Too many tokens in prompt :(")

    return choice.text
  } catch (err) {
    // @ts-ignore
    const message = err.response.data.error.message;
    throw new CustomException(message, status.BAD_REQUEST)
  }
}
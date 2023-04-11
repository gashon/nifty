import openai from "@/lib/openai";
import { createQuizGenerationPrompt } from "@/util"

export const generateQuizFromNote = async (noteContent: string) => {
  const prompt = createQuizGenerationPrompt(noteContent);
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt,
  })

  return response.data.choices[0].text;
}
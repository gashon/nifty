import { generateQuizFromNote, shuffleQuiz } from "@/util"

interface RequestItem {
  format: (data: any) => string;
  sendRequest: (data: any) => Promise<any>;
  reformat: (data: string) => any;
}

export const openaiRequestHandler: {
  [key: string]: RequestItem;
} = {
  quizGenerator: {
    format: (noteContent: string) => {
      // convert note content to text and some markdown
      return JSON.parse(noteContent).reduce((acc: string[], curr: any) => {
        acc.push((curr.type.includes("heading") ? "# " : "") + curr.children[0].text)
        return acc
      }, []).join('\n')
    },
    sendRequest: (noteContent: string) => {
      return generateQuizFromNote(noteContent);
    },
    reformat: (stringifiedQuiz: string) => {
      // randomize the order of the questions and mark the correct_index
      const quizContent = JSON.parse(stringifiedQuiz).questions
      const randomizedQuiz = shuffleQuiz(quizContent);
      return randomizedQuiz;
    }
  }
}
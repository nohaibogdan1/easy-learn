interface QuestionAnswer {
  question: string;
  answer: string;
  label: string;
}

type QuestionAnswerStored = QuestionAnswer & {
  id: number;
};

export type { QuestionAnswer, QuestionAnswerStored };

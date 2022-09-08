import useDbMethods from "../db/useDb";
import { QuestionAnswerStored } from "../types";

const useRandomTests = () => {
  const { getAllQuestionAnswers } = useDbMethods();

  const getRandomTests = (): Promise<QuestionAnswerStored[]> => {
    return new Promise((acc, reject) => {
      getAllQuestionAnswers()
      .then((data: QuestionAnswerStored[]) => {
        acc(data);
      })
      .catch((err) => {
        console.log('Error getRandomTests', err);
        reject(err);
      });
    });
  };
  
  return {
    getRandomTests
  };
};

export default useRandomTests;

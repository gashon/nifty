import { FC } from 'react';

import { useInfiniteQuizzes, useDeleteQuiz } from '@/features/quiz';
import ModuleCard from '@nifty/ui/molecules/module-card';

export const QuizList: FC = () => {
  // todo implement frontend pagination
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    isFetched,
  } = useInfiniteQuizzes({ limit: 100 });
  const { mutate: deleteQuiz } = useDeleteQuiz();

  return (
    <div className="flex flex-col gap-4">
      {isFetching &&
        !isFetched &&
        [...Array(25)].map((_, i) => <ModuleCard key={i} variant="loading" />)}

      {isFetched && (
        <>
          {data.pages.map(({ data }: any) =>
            data.map((quiz) => (
              <div key={quiz.id}>
                <ModuleCard
                  onDelete={() => deleteQuiz(quiz.id)}
                  name={quiz.title}
                  {...quiz}
                  href={`/quizzes/${quiz.id}?title=${quiz.title}`}
                />
              </div>
            ))
          )}
        </>
      )}
    </div>
  );
};

export default QuizList;

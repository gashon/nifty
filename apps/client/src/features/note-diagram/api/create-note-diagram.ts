import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';

export const createNoteDiagram = async (noteId: string) => {
  const { data } = await axios.post(`api/v1/notes/${noteId}/diagram`);
  return data;
}

type UseCreateNoteDiagramOptions = {
  config?: MutationConfig<typeof createNoteDiagram>;
};

export const useCreateNoteDiagram = (noteId: string, { config }: UseCreateNoteDiagramOptions = {}) => {
  return useMutation({
    onMutate: async (newNoteDiagram) => {
      await queryClient.cancelQueries(['note-diagram', noteId]);
      return { previousModules: queryClient.getQueryData(['note-diagram', noteId]) };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData(['note-diagram', noteId], context.previousModules);
      }
    },
    onSuccess: (noteDiagramCreateResponse) => {
      console.log("RES", noteDiagramCreateResponse)
      queryClient.setQueryData(['note-diagram', noteId], noteDiagramCreateResponse);
    },
    ...config,
    mutationFn: (variables: string) => createNoteDiagram(noteId)
  });
}
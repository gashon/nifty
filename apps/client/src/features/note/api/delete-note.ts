import { NoteListResponse } from '@nifty/server-lib/models/note';
import { useMutation } from 'react-query';
import { axios } from '@/lib/axios';
import { MutationConfig, queryClient } from '@/lib/react-query';

export const deleteNote = (noteId: string) => {
  return axios.delete(`/api/v1/notes/${noteId}`);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof deleteNote>;
};

export const useDeleteNote = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    onMutate: async (deleteNote) => {
      await queryClient.cancelQueries('notes');

      // delete the note from the cache
      const previousModules: NoteListResponse = queryClient.getQueryData('notes');
      queryClient.setQueryData('notes', () => (
        {
          ...previousModules,
          data: (previousModules?.data || []).filter((note) => note.id !== deleteNote.id),
        }
      ));

      return { previousModules };
    },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('notes', context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('notes');
    },
    ...config,
    mutationFn: (noteId) => deleteNote(noteId),
  });
};
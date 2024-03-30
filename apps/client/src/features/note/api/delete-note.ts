import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';

export const deleteNote = (noteId: number) => {
  return axios.delete(`/api/v1/notes/${noteId}`);
};

type UseCreateModuleOptions = {
  config?: MutationConfig<typeof deleteNote>;
};

export const useDeleteNote = ({ config }: UseCreateModuleOptions = {}) => {
  return useMutation({
    // onMutate: async (deletedNoteId) => {
    //   await queryClient.cancelQueries('notes');
    //
    //   // delete the note from the cache
    //   const previousModules: NoteListResponse =
    //     queryClient.getQueryData('notes');
    //   queryClient.setQueryData('notes', () => ({
    //     ...previousModules,
    //     data: (previousModules?.data || []).filter(
    //       (note) => note.id !== deletedNoteId
    //     ),
    //   }));
    //
    //   return { previousModules };
    // },
    onError: (_, __, context: any) => {
      if (context?.previousModules) {
        queryClient.setQueryData('notes', context.previousModules);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries('notes');
      queryClient.invalidateQueries('recent-notes');
    },
    ...config,
    mutationFn: (noteId) => deleteNote(noteId),
  });
};

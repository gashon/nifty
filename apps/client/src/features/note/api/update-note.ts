import { NoteUpdateRequest } from '@nifty/server-lib/models/note';
import { useMutation } from 'react-query';
import { axios } from '@nifty/client/lib/axios';
import { MutationConfig, queryClient } from '@nifty/client/lib/react-query';
import type {
  UpdateNoteResponse,
  UpdateNoteRequestBody,
  UpdateNoteRequestParam,
} from '@nifty/api/domains/note/dto';

export const updateNote = async (
  noteId: UpdateNoteRequestParam,
  payload: UpdateNoteRequestBody
): Promise<UpdateNoteResponse> => {
  const { data } = await axios.patch(`/api/v1/notes/${noteId}`, payload);
  return data;
};

type UseUpdateModuleOptions = {
  config?: MutationConfig<typeof updateNote>;
};

export const useUpdateNote = (
  noteId: UpdateNoteRequestParam,
  { config }: UseUpdateModuleOptions = {}
): ReturnType<typeof useMutation> => {
  return useMutation({
    mutationKey: ['note', noteId], // mutationKey
    mutationFn: (payload: UpdateNoteRequestBody) => updateNote(noteId, payload), // mutationFn
    onSuccess: () => {
      queryClient.invalidateQueries(['note', noteId]);
    },
  });
};

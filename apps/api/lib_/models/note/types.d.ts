import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';
import { Expand } from '../../utils/types/tsoa/expand';
import { ListResponse } from '../../utils/types/tsoa/list-response';
export interface INote extends Resource {
    created_by: mongoose.Types.ObjectId;
    title: string;
    content: string;
    description: string;
    directory: mongoose.Types.ObjectId;
    collaborators: mongoose.Types.ObjectId[];
    img_url: string;
    tags: string[];
    is_public: boolean;
    deleted_at: number;
}
export declare type NoteDocument = mongoose.Document<string, object, INote>;
export declare type NoteCreateRequest = Partial<Expand<Pick<INote, 'created_by' | 'title' | 'content' | 'description' | 'directory' | 'collaborators' | 'img_url' | 'tags' | 'is_public' | 'deleted_at'>>>;
export declare type NoteListResponse = ListResponse<INote>;
//# sourceMappingURL=types.d.ts.map
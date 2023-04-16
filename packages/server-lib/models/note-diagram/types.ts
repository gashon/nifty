import mongoose from "../../mongoose";
import Resource from '../../utils/types/resource';

export interface INoteDiagram extends Resource {
  created_by: string;
  type: "ascii";
  content: string;
}

export type NoteDiagramDocument = mongoose.Document<string, object, INoteDiagram> & INoteDiagram;

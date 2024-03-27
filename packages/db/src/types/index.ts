import { Kysely } from 'kysely';
import { DB as DBType } from './generated.types';

export type {
  Insertable,
  InsertResult,
  Selectable,
  Updateable,
  SelectExpression,
} from 'kysely';
export type KysleyDB = Kysely<DBType>;
export * from './generated.types';

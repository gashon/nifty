import { Column, Tables } from '../types';

// Flatten tables & columns into a more easily iterable object resembling a KnexColumn[]
export default function flattenTables(tables: Tables): (Column & { column_name: string, table_name: string })[] {
  return Object.entries(tables).flatMap(([tableName, table]) => {
    return Object.entries(table).map(([columnName, column]) => ({
      ...column,
      column_name: columnName,
      table_name: tableName,
    }))
  });
}

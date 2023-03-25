import { MetaColumn } from "../types";

// Detect primary keys. Account for id, _id, [local table]id, and [local table]_id
export default function isPrimaryKey(column: MetaColumn) {
  return [
    'id',
    '_id',
    ...(column.table_name ? [
      `${column.table_name.toLowerCase()}id`,
      `${column.table_name.toLowerCase()}_id`,
    ] : [])
  ].includes(column.column_name.toLowerCase());
}

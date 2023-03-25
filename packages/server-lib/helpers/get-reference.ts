import pluralize from 'pluralize';
import { MetaColumn } from '../types';
import isPrimaryKey from './is-primary-key';

export default function getReference(column: MetaColumn, columns: MetaColumn[]) {
  // Detect references. Account for [foreign table], [foreign table]id, and [foreign table]_id
  const potentialReferences = [column.column_name];
  if (column.column_name.slice(-3).toLowerCase() === '_id')
    potentialReferences.push(column.column_name.slice(0, -3).toLowerCase());
  if (column.column_name.slice(-2).toLowerCase() === 'id')
    potentialReferences.push(column.column_name.slice(0, -2).toLowerCase());

  // Find the referenced table
  const referencedTable = columns.find(
    (c) =>
      c.table_name !== column.table_name &&
      potentialReferences
        .flatMap((name) => [name, `${name}s`, pluralize(name)]) // Account for plurals and simple plurals of table names
        .includes(c.table_name?.toLowerCase() || '')
  )?.table_name;

  // If the referenced table is found, find its primary key. The data type should match.
  const referencedField = referencedTable && columns.find((c) =>
    c.table_name === referencedTable
    && isPrimaryKey(c)
    && c.data_type === column.data_type
  )?.column_name

  // Referenced table and field must both be found to mark this column as a foreign key
  return {
    is_foreign_key: !!referencedField,
    referenced_table: referencedField ? referencedTable : null,
    referenced_field: referencedField,
  }
}

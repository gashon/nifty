import { Tables } from '../types';

function enumTypeName(tableName: string, columnName: string) {
  return `${tableName}_${columnName}`;
}

export default function stringifyTables(tables: Tables): string {
  const enums = Object.entries(tables).map(([tableName, table]) => {
    return Object.entries(table)
      .filter(([, column]) => !!column.enum)
      .map(([columnName, column]) => {
        const enumString = column.enum
          ?.filter((value) => value !== null)
          ?.map((value) => column.data_type === 'character varying' ? `'${value}'` : value).join(', ');

        const notNull = column.enum?.includes(null) ? '' : ' NOT NULL';
        return `# CREATE TYPE ${enumTypeName(tableName, columnName)} AS ENUM (${enumString})${notNull};`
      })
  })
    .flat()
    .join('\n');

  const tableString = Object.entries(tables).map(([tableName, table]) => {
    const columns = Object.entries(table).map(
      ([columnName, column]) => {
        if (!column.data_type && !column.enum) return columnName;
        return `${columnName}: ${column.enum ? enumTypeName(tableName, columnName) : column.data_type}`
      }
    );

    const primaryKeys = Object.entries(table)
      .filter(([_, column]) => column.is_primary_key)
      .map(([columnName, _]) => `PRIMARY KEY (${columnName})`);

    const foreignKeys = Object.entries(table)
      .filter(([_, column]) => column.is_foreign_key && column.referenced_table && column.referenced_field)
      .map(([columnName, column]) => `FOREIGN KEY (${columnName}) REFERENCES ${column.referenced_table}(${column.referenced_field})`);

    return `# ${tableName}(${columns
      .concat(primaryKeys[0])
      .concat(foreignKeys)
      .join(', ')})`;
  }).join('\n');

  return [enums, tableString].join('\n');
}

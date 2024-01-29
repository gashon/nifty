import { SourceDetails } from '../models/dataset';
import { ColumnEnum, Source, Tables } from '../types';

export default async function sqlLoadEnums(
  source: Source,
  sourceDetails: SourceDetails,
  tables: Tables
): Promise<{ [table: string]: { [column: string]: ColumnEnum } }> {
  const res: { [table: string]: { [column: string]: ColumnEnum } } = {};
  const bigQueryDatasetPrefix =
    source.id === 'bigquery' ? sourceDetails.bigquery_dataset_id : '';

  // For each table
  for (const [tableName, table] of Object.entries(tables)) {
    res[tableName] = {};

    // Filter out varchar, integer, and unknown columns
    const potentialEnumColumns = Object.entries(table).filter(([, column]) =>
      ['character varying', 'integer', null, undefined].includes(
        column.data_type
      )
    );

    if (!potentialEnumColumns.length) continue;

    // Get the number of distinct values for these columns
    const selectString = potentialEnumColumns
      .map(([columnName]) => `COUNT(DISTINCT ${columnName}) as ${columnName}`)
      .join(', ');

    const nUniqueValues = await source.runQuery(
      sourceDetails,
      `SELECT ${selectString} FROM ${bigQueryDatasetPrefix}${tableName};`
    );

    // Filter only columns with a reasonable number of distinct values
    const enumColumns = potentialEnumColumns.filter(
      ([columnName, column]) =>
        (column.data_type === 'character varying' &&
          Number(nUniqueValues[0][columnName]) <= 35) ||
        (column.data_type === 'integer' &&
          Number(nUniqueValues[0][columnName]) <= 10)
    );

    for (const [columnName] of enumColumns) {
      res[tableName][columnName] = [];

      // Get unique values and number of occurrences
      const valuesAndOccurrences: { [key: string]: string | number }[] =
        await source.runQuery(
          sourceDetails,
          `SELECT ${columnName} FROM ${bigQueryDatasetPrefix}${tableName} GROUP BY ${columnName}`
        );

      // Add each of these to the return value
      res[tableName][columnName] = valuesAndOccurrences.map(
        ({ [columnName]: value }) => value
      );
    }
  }

  return res;
}

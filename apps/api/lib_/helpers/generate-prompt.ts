import dayjs from 'dayjs';
import pluralize from 'pluralize';
import { IDataset } from '../models/dataset';
import { NumenorConfig, Source } from '../types';
import stringifyTables from './stringify-tables';

export function generatePrompt(
  question: string,
  dataset: IDataset,
  source: Source,
  config: NumenorConfig
) {
  const singleTable = Object.keys(dataset.tables).length === 1;

  const descriptor = singleTable
    ? `${source.name} ${source.table}, with its ${pluralize(source.column)}`
    : `${source.name} ${pluralize(source.table)}, with their ${pluralize(
        source.column
      )}`;

  const instructions = [];

  if (config.instructFloatCast)
    instructions.push(
      `If asked for a rate or percentage, cast the numerator to a float.`
    );
  if (config.instructArbitraryLimit)
    instructions.push(
      `Do not include any LIMIT unless specified in the question.`
    );
  if (config.instructDate)
    instructions.push(
      `The date is ${dayjs().format(
        'MMMM D, YYYY'
      )}. If date and time are not relevant to the question, disregard the date.`
    );
  if (singleTable)
    instructions.push(
      `This dataset has only one ${source.table}. Do not use any JOINs in the ${source.query}.`
    );
  if (source.id === 'bigquery')
    instructions.push(
      `Prefix tables with ${dataset.source_details?.bigquery_dataset_id}.`
    );

  return `
### ${descriptor}:
#
${stringifyTables(dataset.tables)}
#
${instructions.map((i) => `# ${i}`).join('\n')}
# Write a ${source.query} to answer the following question:
### ${question}
${source.starter}
`;
}

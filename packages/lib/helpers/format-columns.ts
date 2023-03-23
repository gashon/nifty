import { Tables } from '../types';
import getReference from './get-reference';
import isPrimaryKey from './is-primary-key';

interface KnexColumn {
  table_name: string;
  column_name: string;
  data_type: string;
}

export default function formatColumns(columns: KnexColumn[]): Tables {
  return columns.reduce((aggregator, column) => {
    return {
      ...aggregator,
      [column.table_name]: {
        ...(aggregator as Tables)[column.table_name],
        [column.column_name]: {
          data_type: column.data_type,
          is_primary_key: isPrimaryKey(column),
          ...getReference(column, columns),
        },
      },
    };
  }, {});
}

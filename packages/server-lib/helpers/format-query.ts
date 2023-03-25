import { format } from 'sql-formatter';

export default function formatQuery(query: string) {
  try {
    return format(query, {
      language: 'sql',
    });
  } catch {
    return query;
  }
}

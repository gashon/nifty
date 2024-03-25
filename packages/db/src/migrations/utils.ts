import { sql } from "kysely"

// example usage --
// .addColumn('some_col', enum('a', 'b', 'c', 'd', 'e'))
export function createEnum(...args: string[]) {
  return sql`enum(${sql.join(args.map(sql.literal))})`
}


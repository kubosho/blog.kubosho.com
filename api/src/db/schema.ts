import { integer, pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const likes = pgTable('likes', {
  id: serial('id').primaryKey(),
  entryId: varchar('entry_id', { length: 255 }).notNull(),
  counts: integer('counts').default(0).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});
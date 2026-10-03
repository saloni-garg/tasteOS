import {sqliteTable,text,integer,index} from 'drizzle-orm/sqlite-core';
export const tasteProfiles=sqliteTable('taste_profiles',{userId:text('user_id').primaryKey(),profile:text('profile').notNull(),updatedAt:integer('updated_at').notNull()});
export const tasteMemories=sqliteTable('taste_memories',{id:text('id').primaryKey(),userId:text('user_id').notNull(),kind:text('kind').notNull(),label:text('label').notNull(),disposition:text('disposition').notNull(),context:text('context').notNull(),createdAt:integer('created_at').notNull()},t=>[index('taste_memories_user_time').on(t.userId,t.createdAt)]);
export const councils=sqliteTable('decision_councils',{id:text('id').primaryKey(),userId:text('user_id').notNull(),state:text('state').notNull(),updatedAt:integer('updated_at').notNull()});
export const mossIndexes=sqliteTable('moss_indexes',{userId:text('user_id').primaryKey(),indexName:text('index_name').notNull(),version:text('version').notNull()});
export const mossJobs=sqliteTable('moss_jobs',{id:text('id').primaryKey(),userId:text('user_id').notNull(),indexName:text('index_name').notNull()});

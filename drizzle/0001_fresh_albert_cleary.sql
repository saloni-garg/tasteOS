CREATE TABLE `moss_indexes` (
	`user_id` text PRIMARY KEY NOT NULL,
	`index_name` text NOT NULL,
	`version` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `moss_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`index_name` text NOT NULL
);

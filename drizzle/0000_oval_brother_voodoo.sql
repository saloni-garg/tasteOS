CREATE TABLE `decision_councils` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`state` text NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `taste_memories` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`kind` text NOT NULL,
	`label` text NOT NULL,
	`disposition` text NOT NULL,
	`context` text NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `taste_memories_user_time` ON `taste_memories` (`user_id`,`created_at`);--> statement-breakpoint
CREATE TABLE `taste_profiles` (
	`user_id` text PRIMARY KEY NOT NULL,
	`profile` text NOT NULL,
	`updated_at` integer NOT NULL
);

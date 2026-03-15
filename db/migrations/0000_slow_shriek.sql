CREATE TABLE `progress` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`vocab_id` text NOT NULL,
	`easiness_factor` real DEFAULT 2.5 NOT NULL,
	`interval` integer DEFAULT 0 NOT NULL,
	`repetitions` integer DEFAULT 0 NOT NULL,
	`due_date` integer NOT NULL,
	`last_reviewed` integer,
	`correct_count` integer DEFAULT 0 NOT NULL,
	`incorrect_count` integer DEFAULT 0 NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `progress_vocab_id_unique` ON `progress` (`vocab_id`);--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY DEFAULT 1 NOT NULL,
	`display_script` text DEFAULT 'hiragana' NOT NULL,
	`input_mode` text DEFAULT 'romaji' NOT NULL,
	`show_romaji` integer DEFAULT true NOT NULL,
	`show_english` integer DEFAULT true NOT NULL,
	`card_type` text DEFAULT 'word' NOT NULL,
	`topics_enabled` text DEFAULT '[]' NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `study_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`started_at` integer NOT NULL,
	`ended_at` integer,
	`topic_id` text,
	`mode` text,
	`cards_reviewed` integer DEFAULT 0 NOT NULL,
	`correct_count` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `vocab_entries` (
	`id` text PRIMARY KEY NOT NULL,
	`topic_id` text NOT NULL,
	`type` text NOT NULL,
	`japanese` text NOT NULL,
	`kana` text NOT NULL,
	`romaji` text NOT NULL,
	`english` text NOT NULL,
	`tags` text DEFAULT '[]' NOT NULL,
	`jlpt_level` text,
	`part_of_speech` text,
	`created_at` integer NOT NULL
);

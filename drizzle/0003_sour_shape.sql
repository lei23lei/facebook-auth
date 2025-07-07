PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_heroes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` text NOT NULL,
	`name` text(50) NOT NULL,
	`style` text(255) NOT NULL,
	`health` integer NOT NULL,
	`damage` integer NOT NULL,
	`resistance` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_heroes`("id", "user_id", "name", "style", "health", "damage", "resistance", "created_at", "updated_at") SELECT "id", "user_id", "name", "style", "health", "damage", "resistance", "created_at", "updated_at" FROM `heroes`;--> statement-breakpoint
DROP TABLE `heroes`;--> statement-breakpoint
ALTER TABLE `__new_heroes` RENAME TO `heroes`;--> statement-breakpoint
PRAGMA foreign_keys=ON;
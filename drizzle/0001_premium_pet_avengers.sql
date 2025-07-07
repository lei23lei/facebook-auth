CREATE TABLE `heroes` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`user_id` integer NOT NULL,
	`name` text(50) NOT NULL,
	`style` text(255) NOT NULL,
	`health` integer NOT NULL,
	`damage` integer NOT NULL,
	`resistance` real NOT NULL,
	`created_at` integer NOT NULL,
	`updated_at` integer NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);

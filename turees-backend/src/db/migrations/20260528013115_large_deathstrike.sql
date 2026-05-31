CREATE TABLE `companies` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`register_number` text,
	`vat_number` text,
	`phone` text NOT NULL,
	`email` text NOT NULL,
	`address` text,
	`role` text DEFAULT 'BOTH' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL
);

CREATE TABLE `materials` (
	`id` text PRIMARY KEY NOT NULL,
	`owner_company_id` text NOT NULL,
	`code` text,
	`name` text NOT NULL,
	`description` text,
	`unit` text DEFAULT 'PCS' NOT NULL,
	`default_price` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `contract_rates` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`material_id` text NOT NULL,
	`unit` text DEFAULT 'PCS' NOT NULL,
	`unit_price` real DEFAULT 0 NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `rentals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `handover_acts` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_id` text NOT NULL,
	`settlement_id` text NOT NULL,
	`act_number` text NOT NULL,
	`title` text NOT NULL,
	`owner_company_id` text NOT NULL,
	`renter_company_id` text NOT NULL,
	`act_date` text NOT NULL,
	`total_amount` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`prepared_by_user_id` text,
	`checked_by_user_id` text,
	`signed_by_owner_name` text,
	`signed_by_renter_name` text,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`contract_id`) REFERENCES `rentals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`settlement_id`) REFERENCES `settlements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`owner_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`renter_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`prepared_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`checked_by_user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `rental_movements` (
	`id` text PRIMARY KEY NOT NULL,
	`rental_id` text NOT NULL,
	`material_id` text NOT NULL,
	`movement_type` text DEFAULT 'OUT' NOT NULL,
	`quantity` real DEFAULT 0 NOT NULL,
	`unit` text DEFAULT 'PCS' NOT NULL,
	`unit_price` real DEFAULT 0 NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`usage_days` integer DEFAULT 0 NOT NULL,
	`line_total` real DEFAULT 0 NOT NULL,
	`movement_date` text NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`rental_id`) REFERENCES `rentals`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`material_id`) REFERENCES `materials`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `rentals` (
	`id` text PRIMARY KEY NOT NULL,
	`contract_number` text NOT NULL,
	`owner_company_id` text NOT NULL,
	`renter_company_id` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`notes` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`owner_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`renter_company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `settlement_items` (
	`id` text PRIMARY KEY NOT NULL,
	`settlement_id` text NOT NULL,
	`movement_id` text NOT NULL,
	`material_name` text NOT NULL,
	`quantity` real DEFAULT 0 NOT NULL,
	`unit` text DEFAULT 'PCS' NOT NULL,
	`unit_price` real DEFAULT 0 NOT NULL,
	`usage_days` integer DEFAULT 0 NOT NULL,
	`line_total` real DEFAULT 0 NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`settlement_id`) REFERENCES `settlements`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`movement_id`) REFERENCES `rental_movements`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `settlements` (
	`id` text PRIMARY KEY NOT NULL,
	`rental_id` text NOT NULL,
	`settlement_number` text NOT NULL,
	`period_start` text NOT NULL,
	`period_end` text NOT NULL,
	`subtotal` real DEFAULT 0 NOT NULL,
	`tax` real DEFAULT 0 NOT NULL,
	`total` real DEFAULT 0 NOT NULL,
	`status` text DEFAULT 'DRAFT' NOT NULL,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`rental_id`) REFERENCES `rentals`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`company_id` text NOT NULL,
	`first_name` text NOT NULL,
	`last_name` text NOT NULL,
	`email` text NOT NULL,
	`phone` text NOT NULL,
	`position` text,
	`created_at` text NOT NULL,
	`updated_at` text NOT NULL,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action
);

CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
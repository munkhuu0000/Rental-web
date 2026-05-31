PRAGMA foreign_keys=OFF;

CREATE TABLE `rental_movements_new` (
  `id` text PRIMARY KEY NOT NULL,
  `rental_id` text,
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

INSERT INTO `rental_movements_new`
SELECT * FROM `rental_movements`;

DROP TABLE `rental_movements`;
ALTER TABLE `rental_movements_new` RENAME TO `rental_movements`;

PRAGMA foreign_keys=ON;

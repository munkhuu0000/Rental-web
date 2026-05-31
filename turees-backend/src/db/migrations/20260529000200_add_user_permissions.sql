ALTER TABLE `users` ADD `permission` text DEFAULT 'FULL_ACCESS' NOT NULL;
ALTER TABLE `users` ADD `is_company_owner` text DEFAULT 'false' NOT NULL;

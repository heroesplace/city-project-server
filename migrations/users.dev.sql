INSERT INTO "accounts" ("name", "email_address", "password", "admin") VALUES ('soleo','s@s.s','$2b$10$B/HEumSJQOy6KjCrg5h0EOhOZpfxCGrRMBLTlKtBxPOIHaOvCicse', true);
INSERT INTO "accounts" ("name", "email_address", "password", "admin") VALUES ('zgurt','z@z.z','$2b$10$B/HEumSJQOy6KjCrg5h0EOhOZpfxCGrRMBLTlKtBxPOIHaOvCicse', true);
INSERT INTO "accounts" ("name", "email_address", "password", "admin") VALUES ('toto','t@t.t','$2b$10$B/HEumSJQOy6KjCrg5h0EOhOZpfxCGrRMBLTlKtBxPOIHaOvCicse', true);

INSERT INTO "characters" ("name", "account_id") VALUES ('soleo', 1);
INSERT INTO "characters" ("name", "account_id") VALUES ('zgurt', 2);
INSERT INTO "characters" ("name", "account_id") VALUES ('toto', 3);
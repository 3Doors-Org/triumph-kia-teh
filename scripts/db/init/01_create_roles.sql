DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'app_user') THEN
      CREATE ROLE app_user LOGIN PASSWORD 'change_me';
   END IF;
END
$$;

DO
$$
BEGIN
   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'migration_user') THEN
      CREATE ROLE migration_user LOGIN PASSWORD 'change_me';
   END IF;
END
$$;

GRANT CONNECT ON DATABASE personal_website TO app_user;
GRANT CONNECT ON DATABASE personal_website TO migration_user;
GRANT USAGE, CREATE ON SCHEMA public TO migration_user;
GRANT USAGE ON SCHEMA public TO app_user;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO app_user;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
ALTER DEFAULT PRIVILEGES FOR ROLE migration_user IN SCHEMA public
GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO app_user;
ALTER DEFAULT PRIVILEGES FOR ROLE migration_user IN SCHEMA public
GRANT USAGE, SELECT ON SEQUENCES TO app_user;

#!/bin/bash

# PostgreSQL credentials
PG_USER="postgres"
PG_PASSWORD="postgres"
PG_HOST="localhost"
PG_PORT="5432"
DB_NAME="village_sacco"
APP_USER="sacco_user"
APP_PASSWORD="your_password"

# Connect as postgres user to create database and user
PGPASSWORD="$PG_PASSWORD" psql -h "$PG_HOST" -p "$PG_PORT" -U "$PG_USER" <<EOF
-- Create database if it doesn't exist
SELECT 'CREATE DATABASE $DB_NAME' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = '$DB_NAME')\gexec

-- Connect to the database
\c $DB_NAME

-- Create application user if it doesn't exist
DO \$\$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = '$APP_USER') THEN
    CREATE USER $APP_USER WITH ENCRYPTED PASSWORD '$APP_PASSWORD';
  END IF;
END
\$\$;

-- Grant privileges to the user
GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $APP_USER;
GRANT ALL PRIVILEGES ON SCHEMA public TO $APP_USER;
ALTER USER $APP_USER WITH CREATEDB;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON TABLES TO $APP_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON SEQUENCES TO $APP_USER;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL PRIVILEGES ON FUNCTIONS TO $APP_USER;

-- Reset permissions on existing objects
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO $APP_USER;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO $APP_USER;
GRANT ALL PRIVILEGES ON ALL FUNCTIONS IN SCHEMA public TO $APP_USER;

REASSIGN OWNED BY postgres TO $APP_USER IN SCHEMA public;

-- If there are any existing objects in the schema, grant permissions
DO \$\$
DECLARE
  r RECORD;
BEGIN
  FOR r IN SELECT tablename FROM pg_tables WHERE schemaname = 'public'
  LOOP
    EXECUTE 'GRANT ALL PRIVILEGES ON TABLE ' || quote_ident(r.tablename) || ' TO $APP_USER';
  END LOOP;
  
  FOR r IN SELECT sequence_name FROM information_schema.sequences WHERE sequence_schema = 'public'
  LOOP
    EXECUTE 'GRANT ALL PRIVILEGES ON SEQUENCE ' || quote_ident(r.sequence_name) || ' TO $APP_USER';
  END LOOP;
END
\$\$;

EOF

echo "Database setup complete. Now you can run: npx prisma db push"

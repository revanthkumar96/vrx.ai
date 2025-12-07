@echo off
echo Executing Activity Tracking Migration...

set PGPASSWORD=%DB_PASSWORD%
psql -h pg-351b24ab-aura-db-1.g.aivencloud.com -p 16715 -U avnadmin -d defaultdb -f migrations/add_activity_tracking_tables.sql -v ON_ERROR_STOP=1

echo Migration completed!
pause

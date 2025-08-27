-- psql -U postgres -h localhost -d Agents -f query.sql
-- psql -U postgres -h localhost -d Agents -f schema.sql
SELECT "body" FROM "Thread" WHERE "id" = 'b3f90404-a84e-44bc-b289-941b0fc52a61'::uuid;
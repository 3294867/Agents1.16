DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')
    THEN CREATE EXTENSION "pgcrypto";
  END IF;
END $$;

DROP TABLE IF EXISTS users, workspaces, workspace_users, sessions, agents, workspace_agents, threads, agent_threads, requests, responses CASCADE;

-- Create Tables
CREATE TABLE users (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  password TEXT NOT NULL,
  api_key TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT users_pkey PRIMARY KEY (id),
  CONSTRAINT users_name_key UNIQUE (name),
  CONSTRAINT users_api_key_key UNIQUE (api_key)
);

CREATE TABLE workspaces (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT workspaces_pkey PRIMARY KEY (id)
);

CREATE TABLE workspace_users (
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer' CHECK (role IN ('admin', 'editor', 'viewer')),
  CONSTRAINT workspace_users_pkey PRIMARY KEY (workspace_id, user_id),
  CONSTRAINT workspace_users_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT workspace_users_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE sessions (
  sid TEXT NOT NULL,
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  expires TIMESTAMP(3) NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (sid),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE agents (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model VARCHAR(20) DEFAULT 'gpt-3.5-turbo',
  system_instructions TEXT,
  stack TEXT[],
  temperature FLOAT NOT NULL DEFAULT 0.5,
  web_search BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agents_pkey PRIMARY KEY (id)
);

CREATE TABLE workspace_agents (
  workspace_id UUID NOT NULL,
  agent_id UUID NOT NULL,
  CONSTRAINT workspace_agents_pkey PRIMARY KEY (workspace_id, agent_id),
  CONSTRAINT workspace_agents_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT workspace_agents_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE threads (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT,
  body JSONB DEFAULT '[]'::JSONB,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT threads_pkey PRIMARY KEY (id)
);

CREATE TABLE agent_threads (
  agent_id UUID NOT NULL,
  thread_id UUID NOT NULL,
  CONSTRAINT agent_threads_pkey PRIMARY KEY (agent_id, thread_id),
  CONSTRAINT agent_threads_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT agent_threads_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE requests (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT requests_pkey PRIMARY KEY (id),
  CONSTRAINT requests_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE responses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  thread_id UUID NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT responses_pkey PRIMARY KEY (id),
  CONSTRAINT responses_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create Indices
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS requests_thread_id_idx ON requests(thread_id);
CREATE INDEX IF NOT EXISTS responses_thread_id_idx ON responses(thread_id);

-- Add Trigger - Workspace name must be unique per user
CREATE OR REPLACE FUNCTION enforce_unique_workspace_per_user()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM workspace_users wu
    JOIN workspaces w ON wu.workspace_id = w.id
    WHERE wu.user_id = NEW.user_id
      AND w.name = (SELECT name FROM workspaces WHERE id = NEW.workspace_id)
  ) THEN
    RAISE EXCEPTION 'User % already has a workspace named %', NEW.user_id, (SELECT name FROM workspaces WHERE id = NEW.workspace_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unique_workspace_per_user
BEFORE INSERT OR UPDATE ON workspace_users
FOR EACH ROW EXECUTE FUNCTION enforce_unique_workspace_per_user();

-- Add Trigger - Agent name must be unique per workspace
CREATE OR REPLACE FUNCTION enforce_unique_agent_per_workspace()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM workspace_agents wa
    JOIN agents a ON wa.agent_id = a.id
    WHERE wa.workspace_id = NEW.workspace_id
      AND a.name = (SELECT name FROM agents WHERE id = NEW.agent_id)
  ) THEN
    RAISE EXCEPTION 'Workspace % already has an agent named %', NEW.workspace_id, (SELECT name FROM agents WHERE id = NEW.agent_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_unique_agent_per_workspace
BEFORE INSERT OR UPDATE ON workspace_agents
FOR EACH ROW EXECUTE FUNCTION enforce_unique_agent_per_workspace();


-- Seed Tables
INSERT INTO users (name, password, api_key)
VALUES 
  ('root', 'password', 'api_root'),
  ('test', 'password', 'api_test');

INSERT INTO workspaces (id, name, description)
VALUES
  ('79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid, 'personal', 'Root personal workspace'),
  ('bf4a8ed2-0d0c-44ac-a437-8143d24c7760'::uuid, 'personal', 'Test personal workspace');

INSERT INTO workspace_users (workspace_id, user_id, role)
SELECT w.id, u.id, 'admin' FROM workspaces w, users u WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379' AND u.name = 'root';

INSERT INTO workspace_users (workspace_id, user_id, role)
SELECT w.id, u.id, 'admin' FROM workspaces w, users u WHERE w.id = 'bf4a8ed2-0d0c-44ac-a437-8143d24c7760' AND u.name = 'test';

INSERT INTO agents (id, name, type, model, system_instructions, stack, temperature, web_search)
VALUES
  ('18fcb91d-cd74-423d-a6be-09e705529304'::uuid, 'general_assistant', 'general_assistant', 'gpt-3.5-turbo', 'You are a general assistant', '{}'::text[], 0.5, TRUE),
  ('f7e5617e-538b-487e-85f7-b6533a179011'::uuid, 'data_analyst', 'data_analyst', 'gpt-3.5-turbo', 'You are a data analyst', ARRAY['sql','python']::text[], 0.2, TRUE),
  ('b80717ed-ec20-43f9-92e4-3e7512227c3f'::uuid, 'copywriter', 'copywriter', 'gpt-3.5-turbo', 'You are a marketing copywriter', ARRAY['seo','content']::text[], 0.7, FALSE),
  ('42022aa9-ff0a-4c31-b8a3-11be97b853c4'::uuid, 'devops_helper', 'devops_helper', 'gpt-3.5-turbo', 'You are a DevOps assistant', ARRAY['bash','terraform']::text[], 0.3, TRUE),
  ('d9dcde55-7a55-44de-992a-f255658483eb'::uuid, 'general_assistant', 'general_assistant', 'gpt-3.5-turbo', 'You are a general assistant', '{}'::text[], 0.5, TRUE);

INSERT INTO workspace_agents (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = '18fcb91d-cd74-423d-a6be-09e705529304'::uuid;

INSERT INTO workspace_agents (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = 'f7e5617e-538b-487e-85f7-b6533a179011'::uuid;

INSERT INTO workspace_agents (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = 'b80717ed-ec20-43f9-92e4-3e7512227c3f'::uuid;

INSERT INTO workspace_agents (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = '42022aa9-ff0a-4c31-b8a3-11be97b853c4'::uuid;

INSERT INTO workspace_agents (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = 'bf4a8ed2-0d0c-44ac-a437-8143d24c7760'::uuid
  AND a.id = 'd9dcde55-7a55-44de-992a-f255658483eb';


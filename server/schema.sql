DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')
    THEN CREATE EXTENSION "pgcrypto";
  END IF;
END $$;

DROP TABLE IF EXISTS
  users,
  workspaces,
  workspace_user,
  sessions,
  agents,
  user_agent,
  workspace_agent,
  threads,
  agent_thread,
  requests,
  thread_request,
  responses,
  thread_response,
  notifications,
  user_notification
CASCADE;

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

CREATE TABLE workspace_user (
  workspace_id UUID NOT NULL,
  user_id UUID NOT NULL,
  user_role TEXT NOT NULL DEFAULT 'viewer' CHECK (user_role IN ('admin', 'editor', 'viewer')),
  CONSTRAINT workspace_user_pkey PRIMARY KEY (workspace_id, user_id),
  CONSTRAINT workspace_user_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT workspace_user_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE sessions (
  sid TEXT NOT NULL,
  user_id UUID NOT NULL,
  data JSONB NOT NULL,
  expires TIMESTAMP(3) NOT NULL,
  CONSTRAINT sessions_pkey PRIMARY KEY (sid),
  CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

CREATE TABLE agents (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model VARCHAR(20) DEFAULT 'gpt-5-nano',
  system_instructions TEXT,
  stack TEXT[],
  temperature FLOAT NOT NULL DEFAULT 0.5,
  web_search BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agents_pkey PRIMARY KEY (id)
);

CREATE TABLE user_agent (
  user_id UUID NOT NULL,
  agent_id UUID NOT NULL,
  CONSTRAINT user_agent_pkey PRIMARY KEY (user_id, agent_id),
  CONSTRAINT user_agent_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT user_agent_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE workspace_agent (
  workspace_id UUID NOT NULL,
  agent_id UUID NOT NULL,
  CONSTRAINT workspace_agent_pkey PRIMARY KEY (workspace_id, agent_id),
  CONSTRAINT workspace_agent_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT workspace_agent_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE ON UPDATE CASCADE
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

CREATE TABLE agent_thread (
  agent_id UUID NOT NULL,
  thread_id UUID NOT NULL,
  CONSTRAINT agent_thread_pkey PRIMARY KEY (agent_id, thread_id),
  CONSTRAINT agent_thread_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT agent_thread_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE requests (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  body TEXT NOT NULL,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT requests_pkey PRIMARY KEY (id)
);

CREATE TABLE thread_request (
  thread_id UUID NOT NULL,
  request_id UUID NOT NULL,
  CONSTRAINT thread_request_pkey PRIMARY KEY (thread_id, request_id),
  CONSTRAINT thread_request_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT thread_request_request_id_fkey FOREIGN KEY (request_id) REFERENCES requests(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE responses (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  body TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'paragraph' CHECK (type IN ('paragraph', 'bullet-list', 'table')),
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT responses_pkey PRIMARY KEY (id)
);

CREATE TABLE thread_response (
  thread_id UUID NOT NULL,
  response_id UUID NOT NULL,
  CONSTRAINT thread_response_pkey PRIMARY KEY (thread_id, response_id),
  CONSTRAINT thread_response_thread_id_fkey FOREIGN KEY (thread_id) REFERENCES threads(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT thread_response_response_id_fkey FOREIGN KEY (response_id) REFERENCES responses(id) ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  message TEXT NOT NULL,
  details JSONB DEFAULT '[]'::JSONB,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT notifications_pkey PRIMARY KEY (id)
);

CREATE TABLE user_notification (
  user_id UUID NOT NULL,
  notification_id UUID NOT NULL,
  CONSTRAINT user_notification_pkey PRIMARY KEY (user_id, notification_id),
  CONSTRAINT user_notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT user_notification_notification_id_fkey FOREIGN KEY (notification_id) REFERENCES notifications(id) ON DELETE CASCADE ON UPDATE CASCADE
);

-- Add Trigger - Agent name must be unique per workspace
CREATE OR REPLACE FUNCTION enforce_unique_agent_per_workspace()
RETURNS TRIGGER AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM workspace_agent wa
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
BEFORE INSERT ON workspace_agent
FOR EACH ROW EXECUTE FUNCTION enforce_unique_agent_per_workspace();


-- Seed Tables
INSERT INTO users (id, name, password, api_key)
VALUES 
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, 'root', '$2b$12$fOoJbW5i2gEP.hzc0fII6.jXkNjmxtQ4tbYLLWPhJFze8oX./UE4G', 'api_root'),
  ('92dca7fc-739d-473d-8e95-d7bc506b0c72'::uuid, 'test', '$2b$12$fOoJbW5i2gEP.hzc0fII6.jXkNjmxtQ4tbYLLWPhJFze8oX./UE4G', 'api_test');

INSERT INTO workspaces (id, name, description)
VALUES
  ('79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid, 'personal', 'Root personal workspace'),
  ('c82a8f65-3373-4bb9-bb08-378cd4d6daf1'::uuid, 'incognito', 'Root incognito workspace'),
  ('40166349-603e-4b73-ab0a-adec16b24385'::uuid, 'team', 'Team workspace'),
  ('bf4a8ed2-0d0c-44ac-a437-8143d24c7760'::uuid, 'personal', 'Test personal workspace');

INSERT INTO workspace_user (workspace_id, user_id, user_role)
SELECT w.id, u.id, 'admin' FROM workspaces w, users u WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid AND u.name = 'root';

INSERT INTO workspace_user (workspace_id, user_id, user_role)
SELECT w.id, u.id, 'admin' FROM workspaces w, users u WHERE w.id = 'c82a8f65-3373-4bb9-bb08-378cd4d6daf1'::uuid AND u.name = 'root';

INSERT INTO workspace_user (workspace_id, user_id, user_role)
SELECT w.id, u.id, 'admin' FROM workspaces w, users u WHERE w.id = 'bf4a8ed2-0d0c-44ac-a437-8143d24c7760'::uuid AND u.name = 'test';

INSERT INTO workspace_user (workspace_id, user_id, user_role)
SELECT w.id, u.id, 'admin' FROM workspaces w, users u WHERE w.id = '40166349-603e-4b73-ab0a-adec16b24385'::uuid AND u.name = 'root';

INSERT INTO agents (id, name, type, model, system_instructions, stack, temperature, web_search)
VALUES
  ('18fcb91d-cd74-423d-a6be-09e705529304'::uuid, 'general', 'general', 'gpt-5-nano', 'You are a general assistant', '{}'::text[], 0.5, TRUE),
  ('f7e5617e-538b-487e-85f7-b6533a179011'::uuid, 'data-analyst', 'data-analyst', 'gpt-5-nano', 'You are a data analyst', ARRAY['sql','python']::text[], 0.2, TRUE),
  ('b80717ed-ec20-43f9-92e4-3e7512227c3f'::uuid, 'copywriter', 'copywriter', 'gpt-5-nano', 'You are a marketing copywriter', ARRAY['seo','content']::text[], 0.7, FALSE),
  ('42022aa9-ff0a-4c31-b8a3-11be97b853c4'::uuid, 'devops-helper', 'devops-helper', 'gpt-5-nano', 'You are a DevOps assistant', ARRAY['bash','terraform']::text[], 0.3, TRUE),
  ('b967db53-048f-48f5-bef8-a9605c89712a'::uuid, 'general', 'general', 'gpt-5-nano', 'You are a general assistant', '{}'::text[], 0.5, TRUE),
  ('d9dcde55-7a55-44de-992a-f255658483eb'::uuid, 'general', 'general', 'gpt-5-nano', 'You are a general assistant', '{}'::text[], 0.5, TRUE),
  ('3967edb4-9148-47d6-b945-55451a34b87c'::uuid, 'general', 'general', 'gpt-5-nano', 'You are a general assistant', '{}'::text[], 0.5, TRUE);

INSERT INTO user_agent (user_id, agent_id)
VALUES
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, '18fcb91d-cd74-423d-a6be-09e705529304'::uuid),
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, 'f7e5617e-538b-487e-85f7-b6533a179011'::uuid),
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, 'b80717ed-ec20-43f9-92e4-3e7512227c3f'::uuid),
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, '42022aa9-ff0a-4c31-b8a3-11be97b853c4'::uuid),
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, 'b967db53-048f-48f5-bef8-a9605c89712a'::uuid),
  ('92dca7fc-739d-473d-8e95-d7bc506b0c72'::uuid, 'd9dcde55-7a55-44de-992a-f255658483eb'::uuid),
  ('78a18939-13a1-44c1-92a0-d90379c5fa1d'::uuid, '3967edb4-9148-47d6-b945-55451a34b87c'::uuid);

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = '18fcb91d-cd74-423d-a6be-09e705529304'::uuid;

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = 'f7e5617e-538b-487e-85f7-b6533a179011'::uuid;

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = 'b80717ed-ec20-43f9-92e4-3e7512227c3f'::uuid;

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '79fa0469-8a88-4bb0-9bc5-3623b09cf379'::uuid
  AND a.id = '42022aa9-ff0a-4c31-b8a3-11be97b853c4'::uuid;

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = 'c82a8f65-3373-4bb9-bb08-378cd4d6daf1'::uuid
  AND a.id = 'b967db53-048f-48f5-bef8-a9605c89712a'::uuid;

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = 'bf4a8ed2-0d0c-44ac-a437-8143d24c7760'::uuid
  AND a.id = 'd9dcde55-7a55-44de-992a-f255658483eb';

INSERT INTO workspace_agent (workspace_id, agent_id)
SELECT w.id, a.id
FROM workspaces w, agents a
WHERE w.id = '40166349-603e-4b73-ab0a-adec16b24385'::uuid
  AND a.id = '3967edb4-9148-47d6-b945-55451a34b87c';

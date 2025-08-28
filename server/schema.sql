DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')
    THEN CREATE EXTENSION "pgcrypto";
  END IF;
END $$;

DROP TABLE IF EXISTS workspace_users, workspace_agents, users, workspaces, sessions, agents, threads, requests, responses CASCADE;

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
  user_id UUID NOT NULL,
  workspace_id UUID NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  model VARCHAR(20) DEFAULT 'gpt-3.5-turbo',
  system_instructions TEXT,
  stack TEXT[],
  temperature FLOAT NOT NULL DEFAULT 0.5,
  web_search BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT agents_pkey PRIMARY KEY (id),
  CONSTRAINT agents_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT agents_workspace_id_fkey FOREIGN KEY (workspace_id) REFERENCES workspaces(id) ON DELETE RESTRICT ON UPDATE CASCADE
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
  user_id UUID NOT NULL,
  agent_id UUID NOT NULL,
  title TEXT,
  body JSONB DEFAULT '[]'::JSONB,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  is_shared BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT threads_pkey PRIMARY KEY (id),
  CONSTRAINT threads_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT threads_agent_id_fkey FOREIGN KEY (agent_id) REFERENCES agents(id) ON DELETE RESTRICT ON UPDATE CASCADE
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
CREATE INDEX IF NOT EXISTS threads_user_id_idx ON threads(user_id);


-- Seed Tables
INSERT INTO users (id, name, password, created_at, updated_at)
VALUES
  ('79fa0469-8a88-4bb0-9bc5-3623b09cf379', 'Root', 'password', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('206776bc-6920-4f04-8580-f36b45b51e93', 'Test', 'password', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO workspaces (id, name)
VALUES
  ('18fcb91d-cd74-423d-a6be-09e705529304', 'personal'),
  ('bf4a8ed2-0d0c-44ac-a437-8143d24c7760', 'personal');

INSERT INTO workspace_users (workspace_id, user_id)
VALUES
  ('18fcb91d-cd74-423d-a6be-09e705529304', '79fa0469-8a88-4bb0-9bc5-3623b09cf379'),
  ('bf4a8ed2-0d0c-44ac-a437-8143d24c7760', '206776bc-6920-4f04-8580-f36b45b51e93');

INSERT INTO agents
  (id, user_id, workspace_id, name, type, model, system_instructions)
VALUES 
  (
    'd9dcde55-7a55-44de-992a-f255658483eb',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    '18fcb91d-cd74-423d-a6be-09e705529304',
    'general',
    'general',
    'gpt-3.5-turbo',
    NULL
  ),
  (
    'b2ffcda9-7298-45fb-b756-86275dea9a6e',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    '18fcb91d-cd74-423d-a6be-09e705529304',
    'math',
    'math',
    'gpt-3.5-turbo',
    'You are a Math AI Agent designed to assist users in solving mathematical problems, explaining concepts, and exploring applications across various
    complexity levels. Your primary goal is to provide accurate, clear, and step-by-step solutions or explanations tailored to the user''s proficiency.
    Solve problems from basic arithmetic to advanced topics like calculus or statistics, offering detailed explanations with logical progression.
    Explain concepts, theorems, or formulas clearly, matching the user''s understanding, and assist with visualizations or examples when appropriate.
    Verify calculations for accuracy, highlight pitfalls, and suggest alternative methods. Break down complex problems into manageable steps with clear
    notation, using real-world applications or analogies for accessibility. Ask clarifying questions for ambiguous problems and avoid providing answers
    to academic assignments without encouraging understanding. Ensure explanations are neutral, avoid speculative claims, and stick to established
    principles. Do not generate charts unless requested with sufficient data.'
  ),
  (
    '683578d0-8f49-4246-8a2a-6d1ca2e25942',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    '18fcb91d-cd74-423d-a6be-09e705529304',
    'geography',
    'geography',
    'gpt-3.5-turbo',
    'You are a Geography AI Agent designed to assist users in exploring physical, human, and environmental geography with accuracy and clarity. Your
    primary goal is to provide detailed, contextually relevant information about locations, landscapes, cultures, and geographic phenomena. Offer accurate
    details on physical geography, such as landforms or climates, and explain human geography topics like population or urbanization. Answer questions
    about specific locations, including maps or geopolitical contexts, and highlight environmental issues like climate change with scientific grounding.
    Assist with interpreting geographic data, using precise terminology and clear descriptions. Tailor responses to the user''s expertise, incorporate
    real-world examples, and provide neutral, fact-based information for geopolitical issues. Respect cultural and political sensitivities, avoid stereotypes,
    and use up-to-date data, acknowledging changes in borders or conditions. Do not generate maps or visualizations unless requested and feasible, and avoid
    speculative claims about future changes unless supported by credible projections.'
  ),
  (
    '474dbe8f-cea8-4e0a-be2d-73cb340b8c00',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    '18fcb91d-cd74-423d-a6be-09e705529304',
    'literature',
    'literature',
    'gpt-3.5-turbo',
    'You are a Literature AI Agent designed to assist users in exploring literary works, authors, and themes across genres and periods. Your primary goal is to
    provide insightful, accurate, and engaging information to foster appreciation for literature''s cultural and intellectual value. Offer summaries, analyses,
    or interpretations of works, authors, or movements, explaining devices, themes, or contexts matched to the user''s knowledge. Assist with comparing texts or
    genres, provide guidance on writing or analyzing literature, and highlight cultural or philosophical significance. Use clear, engaging language, tailoring
    responses from plot summaries to advanced analysis, and incorporate interdisciplinary connections when relevant. Present multiple perspectives for ambiguous
    texts, grounding them in evidence. Respect copyright, avoiding large excerpts from protected works, encourage understanding in academic contexts, and
    maintainneutrality to avoid bias.'
  ),
  (
    '22cbefe3-2b96-4feb-a58d-92aca718bae8',
    '206776bc-6920-4f04-8580-f36b45b51e93',
    'bf4a8ed2-0d0c-44ac-a437-8143d24c7760',
    'general',
    'general',
    'gpt-3.5-turbo',
    NULL
  );

INSERT INTO workspace_agents (workspace_id, agent_id)
VALUES
  ('18fcb91d-cd74-423d-a6be-09e705529304', 'd9dcde55-7a55-44de-992a-f255658483eb'),
  ('18fcb91d-cd74-423d-a6be-09e705529304', 'b2ffcda9-7298-45fb-b756-86275dea9a6e'),
  ('18fcb91d-cd74-423d-a6be-09e705529304', '683578d0-8f49-4246-8a2a-6d1ca2e25942'),
  ('18fcb91d-cd74-423d-a6be-09e705529304', '474dbe8f-cea8-4e0a-be2d-73cb340b8c00'),
  ('bf4a8ed2-0d0c-44ac-a437-8143d24c7760', '22cbefe3-2b96-4feb-a58d-92aca718bae8');

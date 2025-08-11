DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto')
    THEN CREATE EXTENSION "pgcrypto";
  END IF;
END $$;

DROP TABLE IF EXISTS "Session", "User", "Agent", "Thread", "Request", "Response" CASCADE;

CREATE TABLE "Session" (
  "sid" TEXT NOT NULL,
  "userId" UUID NOT NULL,
  "data" JSONB NOT NULL,
  "expires" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Session_pkey" PRIMARY KEY ("sid"),
  CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "name" TEXT NOT NULL UNIQUE,
  "password" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Agent" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL,
  "model" VARCHAR(20) NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL,
  "systemInstructions" TEXT NOT NULL,
  "stack" TEXT[],
  "temperature" FLOAT NOT NULL DEFAULT 0.5,
  "webSearch" BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Agent_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Agent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Thread" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL,
  "agentId" UUID NOT NULL,
  "title" TEXT,
  "body" JSONB,
  "isBookmarked" BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Thread_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Thread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Thread_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE "Request" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "threadId" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Request_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Request_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE "Response" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "threadId" UUID NOT NULL,
  "body" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Response_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Response_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "Thread"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "Session_userId_idx" ON "Session"("userId");
CREATE INDEX IF NOT EXISTS "Request_threadId_idx" ON "Request"("threadId");
CREATE INDEX IF NOT EXISTS "Response_threadId_idx" ON "Response"("threadId");
CREATE INDEX IF NOT EXISTS "Thread_userId_idx" ON "Thread"("userId");

-- Insert users (passwords will be hashed programmatically)
INSERT INTO "User" ("id", "name", "password", "createdAt", "updatedAt")
VALUES
  ('79fa0469-8a88-4bb0-9bc5-3623b09cf379', 'Root', 'placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
  ('206776bc-6920-4f04-8580-f36b45b51e93', 'Test', 'placeholder', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insert agents
INSERT INTO "Agent"
  (
    "id",
    "type",
    "model",
    "userId",
    "name",
    "systemInstructions",
    "stack",
    "temperature",
    "webSearch",
    "createdAt",
    "updatedAt"
  )
VALUES 
  (
    gen_random_uuid(),
    'general',
    'gpt-3.5-turbo',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    'general',
    '',
    NULL,
    0.5,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'math',
    'gpt-3.5-turbo',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    'math',
    'You are a Math AI Agent designed to assist users in solving mathematical problems, explaining concepts, and exploring applications across various complexity levels. Your primary goal is to provide accurate, clear, and step-by-step solutions or explanations tailored to the user''s proficiency. Solve problems from basic arithmetic to advanced topics like calculus or statistics, offering detailed explanations with logical progression. Explain concepts, theorems, or formulas clearly, matching the user''s understanding, and assist with visualizations or examples when appropriate. Verify calculations for accuracy, highlight pitfalls, and suggest alternative methods. Break down complex problems into manageable steps with clear notation, using real-world applications or analogies for accessibility. Ask clarifying questions for ambiguous problems and avoid providing answers to academic assignments without encouraging understanding. Ensure explanations are neutral, avoid speculative claims, and stick to established principles. Do not generate charts unless requested with sufficient data.',
    NULL,
    0.5,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'geography',
    'gpt-3.5-turbo',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    'geography',
    'You are a Geography AI Agent designed to assist users in exploring physical, human, and environmental geography with accuracy and clarity. Your primary goal is to provide detailed, contextually relevant information about locations, landscapes, cultures, and geographic phenomena. Offer accurate details on physical geography, such as landforms or climates, and explain human geography topics like population or urbanization. Answer questions about specific locations, including maps or geopolitical contexts, and highlight environmental issues like climate change with scientific grounding. Assist with interpreting geographic data, using precise terminology and clear descriptions. Tailor responses to the user''s expertise, incorporate real-world examples, and provide neutral, fact-based information for geopolitical issues. Respect cultural and political sensitivities, avoid stereotypes, and use up-to-date data, acknowledging changes in borders or conditions. Do not generate maps or visualizations unless requested and feasible, and avoid speculative claims about future changes unless supported by credible projections.',
    NULL,
    0.5,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'literature',
    'gpt-3.5-turbo',
    '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
    'literature',
    'You are a Literature AI Agent designed to assist users in exploring literary works, authors, and themes across genres and periods. Your primary goal is to provide insightful, accurate, and engaging information to foster appreciation for literature''s cultural and intellectual value. Offer summaries, analyses, or interpretations of works, authors, or movements, explaining devices, themes, or contexts matched to the user''s knowledge. Assist with comparing texts or genres, provide guidance on writing or analyzing literature, and highlight cultural or philosophical significance. Use clear, engaging language, tailoring responses from plot summaries to advanced analysis, and incorporate interdisciplinary connections when relevant. Present multiple perspectives for ambiguous texts, grounding them in evidence. Respect copyright, avoiding large excerpts from protected works, encourage understanding in academic contexts, and maintain neutrality to avoid bias.',
    NULL,
    0.5,
    TRUE,
    NOW(),
    NOW()
  ),
  (
    gen_random_uuid(),
    'general',
    'gpt-3.5-turbo',
    '206776bc-6920-4f04-8580-f36b45b51e93',
    'general',
    '',
    NULL,
    0.5,
    TRUE,
    NOW(),
    NOW()
  );
-- Enable pgcrypto extension for gen_random_uuid() if not already enabled
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'pgcrypto') THEN
        CREATE EXTENSION "pgcrypto";
    END IF;
END $$;

-- Drop existing tables to start fresh
DROP TABLE IF EXISTS "User", "Agent", "Thread", "Request", "Response" CASCADE;

CREATE TABLE "User" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "username" TEXT NOT NULL UNIQUE,
  "email" TEXT NOT NULL UNIQUE,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Agent" (
  "id" UUID NOT NULL DEFAULT gen_random_uuid(),
  "type" TEXT NOT NULL,
  "model" VARCHAR(20) NOT NULL,
  "userId" UUID NOT NULL,
  "name" TEXT NOT NULL UNIQUE,
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

CREATE INDEX IF NOT EXISTS "Request_threadId_idx" ON "Request"("threadId");
CREATE INDEX IF NOT EXISTS "Response_threadId_idx" ON "Response"("threadId");
CREATE INDEX IF NOT EXISTS "Thread_userId_idx" ON "Thread"("userId");

-- Insert 10 Users
INSERT INTO "User" ("id", "username", "email", "createdAt", "updatedAt")
VALUES
('79fa0469-8a88-4bb0-9bc5-3623b09cf379', 'Alice Johnson', 'alice.j@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Bob Smith', 'bob.s@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Clara Lee', 'clara.l@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'David Kim', 'david.k@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Eve Martinez', 'eve.m@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Frank Taylor', 'frank.t@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Grace Nguyen', 'grace.n@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Hank Brown', 'hank.b@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Ivy Patel', 'ivy.p@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(gen_random_uuid(), 'Jack Wilson', 'jack.w@example.com', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO "Agent" ("id", "type", "model", "userId", "name", "systemInstructions", "stack", "temperature", "webSearch", "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'research',
  'gpt-3.5-turbo',
  '79fa0469-8a88-4bb0-9bc5-3623b09cf379',
  'research',
  'You are a Research AI Agent designed to assist users in conducting thorough, accurate, and efficient research across various domains. Your primary goal is to provide reliable, well-structured, and contextually relevant information while maintaining neutrality, clarity, and ethical standards. ',
  NULL,
  0.5,
  TRUE,
  NOW(),
  NOW()
)

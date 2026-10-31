-- AI Resume Analyzer database schema
-- Safe to run more than once: nothing is dropped or overwritten.

CREATE DATABASE IF NOT EXISTS ai_resume_analyzer
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_general_ci;

USE ai_resume_analyzer;

CREATE TABLE IF NOT EXISTS users (
  id            INT          NOT NULL AUTO_INCREMENT PRIMARY KEY,
  email         VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS guest_sessions (
  id             VARCHAR(36) NOT NULL PRIMARY KEY,
  analysis_count INT         DEFAULT 0,
  created_at     TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_used_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS analyses (
  id                 VARCHAR(12)  NOT NULL PRIMARY KEY,
  user_id            INT          DEFAULT NULL,
  resume_filename    VARCHAR(255) DEFAULT NULL,
  resume_path        VARCHAR(500) DEFAULT NULL,
  resume_text        LONGTEXT     DEFAULT NULL,
  job_text           LONGTEXT     DEFAULT NULL,
  match_score        INT          DEFAULT NULL,
  algorithm_result   JSON         DEFAULT NULL,
  gemini_suggestions JSON         DEFAULT NULL,
  created_at         TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_analyses_user (user_id)
);

CREATE TABLE IF NOT EXISTS batch_analyses (
  id           VARCHAR(12) NOT NULL PRIMARY KEY,
  user_id      INT         DEFAULT NULL,
  guest_id     VARCHAR(36) DEFAULT NULL,
  job_text     LONGTEXT    DEFAULT NULL,
  resume_count INT         DEFAULT NULL,
  status       ENUM('processing', 'complete', 'failed') DEFAULT 'processing',
  created_at   TIMESTAMP   NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_batch_analyses_user (user_id)
);

CREATE TABLE IF NOT EXISTS batch_results (
  id               VARCHAR(12)  NOT NULL PRIMARY KEY,
  batch_id         VARCHAR(12)  NOT NULL,
  resume_filename  VARCHAR(255) DEFAULT NULL,
  resume_path      VARCHAR(500) DEFAULT NULL,
  resume_text      LONGTEXT     DEFAULT NULL,
  match_score      INT          DEFAULT NULL,
  algorithm_result JSON         DEFAULT NULL,
  rank_position    INT          DEFAULT NULL,
  created_at       TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_batch_results_batch (batch_id),
  CONSTRAINT fk_batch_results_batch
    FOREIGN KEY (batch_id) REFERENCES batch_analyses (id) ON DELETE CASCADE
);

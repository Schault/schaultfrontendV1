-- ============================================================================
-- PostgreSQL Migration: Add Email Tracking Columns to orders Table
-- Purpose: Track order confirmation email status, sent timestamp, and Resend message ID
-- ============================================================================

ALTER TABLE orders
ADD COLUMN IF NOT EXISTS email_sent BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS email_sent_at TIMESTAMPTZ NULL,
ADD COLUMN IF NOT EXISTS email_message_id TEXT NULL;

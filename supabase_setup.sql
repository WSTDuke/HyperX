-- Run this in your Supabase SQL Editor to enable the "Unread Message" feature
ALTER TABLE public.messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

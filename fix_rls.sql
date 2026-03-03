CREATE POLICY "Allow recipient to mark as read"
ON public.messages
FOR UPDATE
USING (auth.uid() != sender_id)
WITH CHECK (auth.uid() != sender_id);

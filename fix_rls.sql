-- Run this to allow users to mark messages as read
-- (Allows a user to update a message if they are NOT the sender, i.e., they are the recipient)

CREATE POLICY "Allow recipient to mark as read"
ON public.messages
FOR UPDATE
USING (auth.uid() != sender_id)
WITH CHECK (auth.uid() != sender_id);

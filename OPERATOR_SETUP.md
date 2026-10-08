# Traela operator activation

The console is /operator. Without the settings below it displays a setup screen, and the existing customer chat continues to work without centralized storage. No public demo inbox or shared default password is provided.

1. Create a private Supabase project and apply supabase/operator.sql once. RLS is enabled; anon/authenticated roles have no table or function access. Only server routes use the service role.
2. Create the operator user in Supabase Authentication with an email and password. Disable public account signups. Do not put credentials in GitHub or chat.
3. Add production environment variables in the Vercel project:
   - TRAELA_CONVERSATIONS_ENABLED=true (set only after the schema and user are ready)
   - SUPABASE_URL
   - SUPABASE_ANON_KEY (publishable/legacy anon key)
   - SUPABASE_SERVICE_ROLE_KEY (server-only secret key)
   - TRAELA_OPERATOR_EMAIL (the exact authorized operator email)
4. Redeploy, sign in at /operator and send a new customer message from /chat. Verify that the conversation appears, a manual reply arrives on the customer side, paused automation stays paused, quote+ETA arrive, notes stay private and another session cannot read the first customer's conversation.

Conversations created before activation remain in visitors' local browsers. New messages create centralized records; old history is not silently imported. The customer session is a random UUID bearer key, stored in their browser and hashed in the database. Customers must retain that browser session. This is not cross-device customer account authentication.

The inbox polls every four seconds and customers poll every three seconds. Manual replies pause automated replies. Automatic handoffs pause automation and mark the conversation as needing attention. Re-enable automation explicitly after handling the request. Quote publish and state updates are transactional. Notes and customer-key hashes are never returned by the public conversation API.

Sessions expire with Supabase access tokens; sign in again when needed. The first release has one allowed operator email, loads up to 200 recent conversations / 500 messages per conversation, and has no email notifications, automatic payment verification or file storage bucket. Image/audio payloads are stored in Postgres; set an appropriate retention policy before handling substantial volume. The existing privacy/deletion pages must be reviewed against this storage policy before activating customer-data storage.

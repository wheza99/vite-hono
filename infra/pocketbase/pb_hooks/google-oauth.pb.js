/// <reference path="../pb_data/types.d.ts" />

// Sync the Google OAuth2 provider onto the `users` auth collection from env on
// every boot. A hook (not a migration) so a rotated client secret only needs a
// container restart, and a database that predates this file still gets the
// provider without re-running migrations. See the clawmpany-auth skill.
onBootstrap((e) => {
  e.next();

  const clientId = $os.getenv("GOOGLE_CLIENT_ID");
  const clientSecret = $os.getenv("GOOGLE_CLIENT_SECRET");
  if (!clientId || !clientSecret) {
    console.log("[google-oauth hook] GOOGLE_CLIENT_ID/SECRET not set — skipping OAuth2 provider sync");
    return;
  }

  const users = e.app.findCollectionByNameOrId("users");
  users.oauth2.enabled = true;
  users.oauth2.providers = [
    { name: "google", clientId: clientId, clientSecret: clientSecret },
  ];
  e.app.save(users);
  console.log("[google-oauth hook] Google OAuth2 provider synced on users collection");
});

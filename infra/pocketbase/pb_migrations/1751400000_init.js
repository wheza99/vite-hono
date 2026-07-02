/// <reference path="../pb_data/types.d.ts" />

// Core template schema: users (extend built-in auth), api_keys,
// transactions, todos (placeholder resource).
migrate(
  (app) => {
    // ---- users: billing/plan fields. Server-only mutation — these fields
    // are updated exclusively via the superuser API from the Hono server.
    const users = app.findCollectionByNameOrId("users");
    users.fields.add(
      new Field({ name: "plan", type: "select", maxSelect: 1, values: ["free", "pro"] }),
      new Field({ name: "credits", type: "number" }),
      new Field({ name: "credits_reset_at", type: "date" }),
      new Field({ name: "whop_membership_id", type: "text" }),
    );
    app.save(users);

    // ---- api_keys (created/verified by server; user may list/delete own)
    const apiKeys = new Collection({
      type: "base",
      name: "api_keys",
      fields: [
        {
          name: "user_id",
          type: "relation",
          required: true,
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: "name", type: "text", max: 100 },
        { name: "key_hash", type: "text", required: true, max: 128 },
        { name: "key_prefix", type: "text", max: 20 },
        { name: "key_suffix", type: "text", max: 20 },
        { name: "last_used_at", type: "date" },
        { name: "expires_at", type: "date" },
        { name: "created", type: "autodate", onCreate: true },
      ],
      indexes: ["CREATE UNIQUE INDEX idx_api_keys_key_hash ON api_keys (key_hash)"],
      listRule: "user_id = @request.auth.id",
      viewRule: "user_id = @request.auth.id",
      createRule: null,
      updateRule: null,
      deleteRule: "user_id = @request.auth.id",
    });
    app.save(apiKeys);

    // ---- transactions (server-only writes; user may view own)
    const transactions = new Collection({
      type: "base",
      name: "transactions",
      fields: [
        {
          name: "user_id",
          type: "relation",
          required: true,
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: "type", type: "select", maxSelect: 1, values: ["credit", "debit"] },
        { name: "amount", type: "number" },
        { name: "description", type: "text", max: 500 },
        { name: "reference", type: "text", max: 200 },
        { name: "created", type: "autodate", onCreate: true },
      ],
      listRule: "user_id = @request.auth.id",
      viewRule: "user_id = @request.auth.id",
      createRule: null,
      updateRule: null,
      deleteRule: null,
    });
    app.save(transactions);

    // ---- todos (placeholder resource — user CRUDs own records)
    const todos = new Collection({
      type: "base",
      name: "todos",
      fields: [
        {
          name: "user_id",
          type: "relation",
          required: true,
          collectionId: users.id,
          cascadeDelete: true,
          maxSelect: 1,
        },
        { name: "text", type: "text", required: true, max: 500 },
        { name: "done", type: "bool" },
        { name: "priority", type: "select", maxSelect: 1, values: ["high", "medium", "low"] },
        { name: "created", type: "autodate", onCreate: true },
        { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
      ],
      listRule: "user_id = @request.auth.id",
      viewRule: "user_id = @request.auth.id",
      createRule: "@request.auth.id != '' && user_id = @request.auth.id",
      updateRule: "user_id = @request.auth.id",
      deleteRule: "user_id = @request.auth.id",
    });
    app.save(todos);
  },
  (app) => {
    for (const name of ["todos", "transactions", "api_keys"]) {
      try {
        app.delete(app.findCollectionByNameOrId(name));
      } catch {
        // already gone
      }
    }
    const users = app.findCollectionByNameOrId("users");
    for (const f of ["plan", "credits", "credits_reset_at", "whop_membership_id"]) {
      users.fields.removeByName(f);
    }
    app.save(users);
  },
);

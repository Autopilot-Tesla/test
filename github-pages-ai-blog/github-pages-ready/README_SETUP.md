# GitHub Pages AI Blog Setup Manual

## What this package is

This folder contains a **drag-and-drop static web app** designed for GitHub Pages. The UI supports four major capabilities: a public blog feed, owner-only publishing, global community chat rooms, and an AI workspace with model switching. Because GitHub Pages serves only static files, the package is built around a clear architectural split.

| Layer | Responsibility | Why it exists |
| --- | --- | --- |
| `index.html`, `styles.css`, `app.js` | The visible frontend, local theme settings, browser interactions, and API calls | GitHub Pages can host these files directly |
| Supabase project | Authentication, permanent user accounts, blog post storage, rooms, messages, and row-level security | A static site cannot safely maintain accounts or shared data by itself |
| Browser-only AI key | Per-user or per-owner AI access for model switching in the workspace | A static deployment cannot securely hide a private provider key |

The important design decision is that the **frontend remains portable and static**, while the **stateful features live in a hosted service**.

## Files included in this folder

| File | Purpose |
| --- | --- |
| `index.html` | The main application shell |
| `styles.css` | The visual design system and responsive layout |
| `app.js` | Authentication, data loading, theme saving, chat, and AI request logic |
| `config.js` | Runtime configuration file that you will edit before deployment |
| `config.example.js` | Reference copy showing the required configuration shape |
| `supabase-policies.sql` | Database tables and security policies |
| `README_SETUP.md` | This setup manual |

## Step 1: Create the hosted backend project

Create a new project in [Supabase](https://supabase.com/). After the project is ready, open the **SQL Editor** and run the full contents of `supabase-policies.sql`. This script creates the following tables:

| Table | Purpose |
| --- | --- |
| `profiles` | One record per account, including the `role` field that distinguishes the owner from members |
| `posts` | Blog content written by the owner |
| `rooms` | Community chat rooms |
| `messages` | Individual chat messages connected to a room and author |

The script also enables **row-level security** and inserts three starter rooms.

## Step 2: Configure authentication

In the Supabase dashboard, open **Authentication** and enable the sign-in methods you want to support. The current UI supports password sign-in and email magic links. If email confirmation is enabled, new users may need to confirm their address before the account becomes active.

Next, copy two values from **Project Settings → API**:

| Value | Where it goes |
| --- | --- |
| Project URL | `supabaseUrl` in `config.js` |
| Anon public key | `supabaseAnonKey` in `config.js` |

These values are expected to be public. The security model relies on **row-level policies**, not on hiding the anon key.

## Step 3: Mark the owner account

The application only allows the owner to publish posts. The frontend checks ownership in two ways: the signed-in email can match the configured `ownerEmail`, and the database can store the `owner` role in the `profiles` table.

After creating your account, run a SQL update similar to this in Supabase:

```sql
update public.profiles
set role = 'owner'
where email = 'your-email@example.com';
```

Then edit `config.js` and set the same address in `ownerEmail`.

## Step 4: Edit `config.js`

Open `config.js` in any text editor and replace the placeholder values.

```js
window.APP_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  supabaseAnonKey: "YOUR_SUPABASE_ANON_KEY",
  openRouterApiBase: "https://openrouter.ai/api/v1",
  defaultModel: "openai/gpt-4.1-mini",
  allowedModels: [
    "openai/gpt-4.1-mini",
    "anthropic/claude-3.7-sonnet",
    "google/gemini-2.5-pro",
    "meta-llama/llama-4-maverick"
  ],
  siteName: "Yates Editorial OS",
  ownerEmail: "your-email@example.com",
  defaultRoom: "global"
};
```

You may change the site name, default model, and room list. However, if you remove a model from `allowedModels`, it will no longer appear in the selector.

## Step 5: Decide how AI access should work

A GitHub Pages site cannot safely keep a private AI key hidden from visitors. For that reason, this package uses a **browser-only key field**. The person using the AI workspace enters a personal key, which is saved in local browser storage on that device only.

| Approach | Security | Convenience | Recommendation |
| --- | --- | --- | --- |
| Hard-code a private key in `app.js` | Unsafe | Convenient for one moment | Do not do this |
| Use a personal key typed into the browser | Safer | Moderate | Recommended for a static deployment |
| Use a private backend proxy | Strongest | Requires non-static hosting | Best only if you later move beyond GitHub Pages |

The current package is wired to call an OpenRouter-compatible endpoint. If you want to use a different compatible service, replace `openRouterApiBase` and ensure the request format stays compatible with the `chat/completions` endpoint used in `app.js`.

## Step 6: Deploy to GitHub Pages

Create a repository or open an existing one. Upload the contents of this folder to the root of the branch you want GitHub Pages to publish, or place them inside a publishing directory such as `/docs` depending on your repository settings.

Then enable GitHub Pages in the repository settings and point it to the correct branch/folder.

| Deployment style | What to upload |
| --- | --- |
| Root publishing | Upload all files in this folder to the repository root |
| `/docs` publishing | Upload all files in this folder into a `docs/` directory |

Because the package uses only relative paths, it is compatible with the standard GitHub Pages folder model.

## Step 7: Test the core flows

After deployment, test the product in this order.

| Flow | Expected result |
| --- | --- |
| Open the site before editing `config.js` | A warning appears telling you to create the config |
| Sign up with a normal account | The session area updates after authentication |
| Promote the owner account and sign in again | The publishing badge changes to owner-active |
| Publish a blog post | The post appears in the feed |
| Send a room message | The message appears in the community log |
| Save theme values | The colors update and remain after refresh |
| Save an AI key and send a prompt | The workspace sends a request to the configured AI endpoint |

## Account deletion and moderation notes

This package includes the data model required for deleting a user profile and cascading owned messages or posts when appropriate, because the foreign keys use `on delete cascade` for linked records. However, a complete production-grade account deletion workflow often needs additional review for moderation history, audit requirements, and retention expectations.

If you want stronger moderation, consider adding these later:

| Enhancement | Reason |
| --- | --- |
| Message reporting table | Lets users flag abusive content |
| Moderation role separate from owner | Avoids giving publishing power to every moderator |
| Soft deletion for posts | Preserves recoverability and audit context |

## Known constraints

This build is deliberately honest about what static hosting can and cannot do.

| Constraint | Explanation |
| --- | --- |
| No secure hidden AI secret | Static files are visible to users |
| Public anon key is normal | Security comes from row-level policies |
| Shared data requires a hosted service | GitHub Pages has no built-in database |
| Email workflows depend on the auth provider | GitHub Pages itself does not send transactional email |

## Suggested next refinement

If you later decide that you want a stronger AI workflow, the next architectural step is not to change the frontend first. Instead, add a secure backend proxy so the owner can keep a private AI credential off the client entirely. Until then, the current browser-only key model is the safest static-compatible compromise.

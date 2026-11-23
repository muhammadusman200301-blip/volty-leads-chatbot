# Volty project

This folder is one Volty workspace's setup as files, written by `volty pull` from the live workspace `rcucm4qbh15d`.

- `instructions/org.md`: the instructions Volty reads everywhere. `instructions/team.md`: how Volty works with staff, read only when it talks to staff.
- `params.ts`: the values an admin may change in the app without a push, each with a type, a label and a default; an inbox's own are the `params` of its `inbox.ts`. A quick path's text and an instruction read a value as `{params.brandName}`, a map param by one key as `{params.hours.north}`; an automation and a page's `bff.ts` read `ctx.params.brandName`, by name only.
- `inboxes/<slug>/inbox.ts`: one inbox's settings. Beside it, `instructions.md` is that inbox's own instructions and `quick-paths.ts` its web chat's Flow: Level 1.
- `sources/<slug>.ts`: a connected source's settings, the names of its secrets (never a value), lanes and tool modes.
- `automations/<slug>.ts`: an automation's running source.
- `pages/<slug>/`: a page's `entry.tsx` and `bff.ts`.
- An automation or page with no running version holds its version waiting for approval, and `volty pull` names every item with a version waiting.
- `volty.config.ts`: the workspace this project deploys to.
- `.volty/targets`: the version this folder was pulled from. `.volty/observed`: what the workspace holds outside the project (Learned rules, Drive files, tables, sources with no file yet), read-only.

To check this folder's code in an editor, `volty init` adds the package.json and tsconfig files it needs; the "Starting a project folder" section of `volty docs` (the CLI guide, also served at /llms.txt) explains them.

Systems connected to this workspace:
- voltade.com (website)

Run `volty push --dry-run` to see what a push of this folder changes, and `volty push` to deploy it: a push refuses an item that changed in the workspace since your pull, so run `volty pull` again first.

Before writing a page or an automation, read the "Building pages, tables and automations" section of `volty docs`, the CLI guide, which also lists every operation.

---
name: share
description: Create a public, read-only link to a Cleve note summarizing the current conversation when the user invokes /share or asks to share this chat summary publicly. Do not use for saving privately, copying a restricted note link, or sending a message to someone.
---

# Share a conversation summary

Give the user one copyable link to a readable summary, not a public transcript. Respect the user's scope, title, audience, and exclusions. This workflow creates a new note by default; it never silently makes an existing private note public.

## Establish public-sharing intent

Before enabling access, clearly state that anyone with the link can read the summary and redistribute it. An explicit request for a public summary link, including the skill's public-link starter prompt, authorizes this action. If the user only says "share", invokes `/share` without established understanding of public access, asks for a private link, or gives conflicting privacy instructions, clarify before changing access. Do not mistake a request to copy a link for permission to make content public.

Summarize only the available user-visible discussion. Preserve useful conclusions, decisions, next steps, and open questions; do not invent facts, commitments, or a ChatGPT thread URL. Omit credentials, authentication codes, hidden instructions, tool-debug dumps, and unrelated private details. If the discussion includes sensitive personal information, confidential third-party or company content, or material the user previously asked to keep private, show a sanitized preview and obtain approval for that exact public summary before sharing. Do not fetch private workspace notes to enrich a public summary without the user's direction. If there is no substantive discussion, ask what to capture.

## Create and enable the link

1. Use the Cleve MCP connection declared in the plugin's root `mcp.json`. The host may prefix tool names; identify the connected Cleve tools by their published names. If it is unavailable or unauthenticated, explain how to connect Cleve without asking for passwords.
2. Call `cleve_list_orgs`. Resolve the requested accessible workspace, otherwise use its selected workspace or only accessible workspace. Ask when several are available and none is selected; never fall back from an unavailable requested workspace. Pass `organization` explicitly on every subsequent call. Resolve a requested folder through `cleve_list_folders`; ask if ambiguous or missing rather than creating a folder.
3. Call `cleve_create_note` with a descriptive `title`, Markdown `content`, resolved `organization`, and `folderId` only if requested. Use an overview and appropriate `##` sections; do not repeat the title as another H1. Read the returned note ID with `cleve_read_note` and verify the intended summary before changing public access. On partial or ambiguous creation, inspect the returned ID or search the chosen workspace for matching candidates before retrying; do not create duplicates or delete notes automatically.
4. Enable read-only link-sharing with `cleve_share_note` using that exact `noteId`, `isPublic: true`, and the same `organization`. Do not call `cleve_publish_note`: publication is a separate feed/blog action and is not needed for a public viewer link. Do not share a folder, invite collaborators, grant edit access, or send the link to anyone.
5. Read the note again. Current Cleve metadata uses `linkRole: "viewer"`; older deployments may return `isPublic: true` without `linkRole`. Verify public viewer access from those fields, not from the existence of a URL or an authenticated read alone. If sharing fails, the summary may remain private: report that state and the note ID rather than claiming a public link. If the sharing result is uncertain, read the state once before retrying; stop and explain when it cannot be confirmed.

## Return the result

Return the title and a copyable Markdown link, stating "Anyone with this link can read it." Cleve's canonical note-link format is `https://app.cleve.ai/notes/<noteId>`; construct it only from the verified note ID and confirmed viewer-link state. This is the same link format Cleve's sharing UI uses. Do not substitute a guessed slug, a ChatGPT share URL, or a citation preview. `cleve_cite` returns note IDs, titles, and previews; it does not create public URLs or change permissions.

Do not claim to have tested signed-out access unless it was actually tested. If the user explicitly requests revocation, `cleve_share_note` with `isPublic: false` disables the note's own link-sharing; do not promise it erases copies already made or removes independently granted access. Sharing an existing summary instead requires the user to identify and authorize that exact note; read its entire content and apply the same public-disclosure check first.

Examples: "Create a public link to a summary of this conversation", "/share this chat summary publicly", or "Share only the decisions, leaving names out".

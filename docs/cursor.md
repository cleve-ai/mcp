# Cursor preparation and review

## Listing draft

- Name: Cleve
- Publisher: Cleve Sdn. Bhd.
- Repository: https://github.com/cleve-ai/mcp
- Website: https://cleve.ai
- Category suggestion: Productivity / knowledge management
- Short description: Search your Cleve workspace, save conversation summaries, and update existing notes.
- Description: Bring your Cleve workspace into Cursor. Find relevant notes, documents, and project knowledge and use them as context for your work. Save decisions and next steps as a new note, or incorporate them into the relevant existing document. When you explicitly want to share publicly, create a summary with a read-only link others can open. Requires a free Cleve account.
- Documentation: https://docs.cleve.ai/developers/mcp
- Support: https://cleve.ai/support
- Privacy: https://cleve.ai/privacy
- Demo: https://www.youtube.com/watch?v=z2zb765Tjls
- Logo: `assets/cleve-icon-square.svg` or `assets/directory-logo.png`

## Remaining checks

The integration files use MIT, with brand assets and trademarks excluded. See [license scope](../LICENSE-SCOPE.md). The public integration repository is [cleve-ai/mcp](https://github.com/cleve-ai/mcp). Repository publication is separate from Cursor Marketplace submission; the package has not been submitted to that marketplace yet.

1. Load a local copy in Cursor, verify skill discovery and OAuth, and perform a harmless read in the demo workspace.
2. Test the save, recall, update, and public-share workflows with synthetic demo data. Check read-back, formatting, existing-note identity, and signed-out viewer access. Do not claim those tests from file validation alone.
3. Review the listing and submit https://github.com/cleve-ai/mcp at https://cursor.com/marketplace/publish only when authorized.

The portable plugin identifier is `cleve`. The existing OpenAI submission uses its own app identifier; do not change that submitted package as part of this repository.

## Sources

- https://cursor.com/docs/plugins
- https://cursor.com/docs/reference/plugins
- https://agent-plugins.org/schemas/1.0.0/plugin.schema.json
- https://agent-plugins.org/schemas/1.0.0/mcp.schema.json

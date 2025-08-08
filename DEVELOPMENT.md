# VS Code Extension Development

## Running the Extension

1. Install dependencies:
   ```bash
   npm install
   ```

2. Compile the TypeScript:
   ```bash
   npm run compile
   ```

3. Open VS Code and press `F5` to run the extension in a new Extension Development Host window

4. Test the extension with Hugo projects containing include statements

## Testing

Create test files with Hugo include patterns:

```markdown
# Test Document

This includes a partial:
{{ partial "header.html" . }}

This includes a file:
{{< include "content/snippets/example.md" >}}

This reads a file:
{{< readfile "static/data/sample.json" >}}
```

## Building for Release

1. Install vsce (VS Code Extension Manager):
   ```bash
   npm install -g vsce
   ```

2. Package the extension:
   ```bash
   vsce package
   ```

3. Publish to marketplace:
   ```bash
   vsce publish
   ```

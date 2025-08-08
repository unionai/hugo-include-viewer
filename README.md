# Hugo Include Viewer

A Visual Studio Code extension that provides inline preview and navigation for included files in Hugo projects.

## Features

🔍 **Hover Preview**: Hover over include statements to see a preview of the included file content
📄 **CodeLens Integration**: Click to open or preview included files directly from the editor
🎯 **Multiple Include Patterns**: Supports various Hugo include patterns including:
- `{{< include "file.md" >}}`
- `{{ partial "partials/header.html" . }}`
- `{{< readfile "content/snippets/example.py" >}}`

✨ **Smart Path Resolution**: Automatically resolves include paths across common Hugo directories:
- Relative to current file
- Workspace root
- `content/` directory
- `layouts/partials/` directory
- `static/` directory
- `assets/` directory

🎨 **Syntax Highlighting**: Preview content with appropriate syntax highlighting based on file type
⚡ **Performance Optimized**: Caches file content for improved performance
⚙️ **Configurable**: Customize include patterns, preview length, and enable/disable features

## Installation

1. Install from the VS Code Marketplace: `hugo-include-viewer`
2. Or install manually: Download the `.vsix` file and install via `Extensions: Install from VSIX...`

## Usage

1. Open a Hugo project in VS Code
2. The extension automatically activates for markdown, HTML, and Hugo files
3. Hover over any include statement to see a preview of the included content
4. Click on CodeLens actions above include statements to open or preview files
5. Use the command palette for additional actions:
   - `Hugo Include Viewer: Refresh Include Previews`
   - `Hugo Include Viewer: Toggle Preview`

## Configuration

The extension provides several configuration options:

```json
{
  "hugo-include-viewer.enableInlinePreview": true,
  "hugo-include-viewer.enableHoverPreview": true,
  "hugo-include-viewer.enableCodeLens": true,
  "hugo-include-viewer.maxPreviewLines": 50,
  "hugo-include-viewer.includePatterns": [
    "{{<\\s*include\\s+[\"']([^\"']+)[\"'].*?>}}",
    "{{\\s*partial\\s+[\"']([^\"']+)[\"'].*?}}",
    "{{<\\s*readfile\\s+[\"']([^\"']+)[\"'].*?>}}"
  ]
}
```

## Supported Include Patterns

The extension recognizes these Hugo include patterns by default:

### Shortcodes
```hugo
{{< include "path/to/file.md" >}}
{{< readfile "content/snippets/example.py" >}}
```

### Partials
```hugo
{{ partial "partials/header.html" . }}
{{ partial "sidebar.html" . }}
```

### Custom Patterns
You can add your own include patterns using regular expressions in the configuration.

## Commands

- **Hugo Include Viewer: Refresh Include Previews** - Clear cache and refresh all previews
- **Hugo Include Viewer: Toggle Preview** - Enable/disable inline preview functionality
- **Hugo Include Viewer: Show Include Content** - Open included file in a new editor tab

## Requirements

- VS Code 1.97.0 or higher
- A Hugo project with include statements in your markdown or HTML files

## Known Issues

- Large included files may take a moment to load on first access
- Include paths must be relative to common Hugo directories

## Contributing

Found a bug or have a feature request? Please open an issue on our [GitHub repository](https://github.com/unionai/hugo-include-viewer).

## License

This extension is licensed under the MIT License. See the LICENSE file for details.

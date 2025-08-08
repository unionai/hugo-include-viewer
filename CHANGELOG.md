# Change Log

All notable changes to the "Hugo Include Viewer" extension will be documented in this file.

## [Unreleased]

### Planned Features
- Support for TOML and JSON front matter in included files
- Inline content expansion directly in the editor
- Support for nested includes
- Custom include pattern templates
- Performance improvements for large projects

## [0.1.0] - Initial Development

### Added
- Initial project setup and extension scaffolding
- Hugo include pattern recognition
- Hover provider for include content preview
- CodeLens provider for include navigation
- Smart path resolution across Hugo directories
- File content caching for performance
- Configurable include patterns and preview settings
- Support for multiple file types with syntax highlighting

### Features
- Hover over include statements to see content preview
- Click CodeLens actions to open or preview included files
- Support for common Hugo include patterns (include, partial, readfile)
- Automatic path resolution in Hugo project structure
- Configurable maximum preview length
- Command palette integration

### Supported Include Patterns
- `{{< include "file.md" >}}` - Hugo shortcode includes
- `{{ partial "partials/header.html" . }}` - Hugo partials
- `{{< readfile "content/snippets/example.py" >}}` - File content includes

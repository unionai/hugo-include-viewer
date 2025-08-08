import * as vscode from 'vscode';
import { HugoIncludeProvider } from './hugoIncludeProvider';

export class HugoHoverProvider implements vscode.HoverProvider {
    constructor(private includeProvider: HugoIncludeProvider) {}

    public async provideHover(
        document: vscode.TextDocument,
        position: vscode.Position,
        token: vscode.CancellationToken
    ): Promise<vscode.Hover | undefined> {
        const config = vscode.workspace.getConfiguration('hugo-include-viewer');
        const enabled = config.get<boolean>('enableHoverPreview', true);

        if (!enabled) {
            return undefined;
        }

        const includes = this.includeProvider.findIncludes(document);

        // Find if the cursor is over an include statement
        const include = includes.find(inc => inc.range.contains(position));
        if (!include) {
            return undefined;
        }

        const resolvedPath = this.includeProvider.resolveIncludePath(document, include.filePath);
        if (!resolvedPath) {
            return new vscode.Hover(
                new vscode.MarkdownString(`❌ **File not found**: ${include.filePath}`),
                include.range
            );
        }

        try {
            const preview = await this.includeProvider.getIncludePreview(resolvedPath);
            if (!preview) {
                return new vscode.Hover(
                    new vscode.MarkdownString(`❌ **Could not read file**: ${include.filePath}`),
                    include.range
                );
            }

            const markdown = new vscode.MarkdownString();
            markdown.appendMarkdown(`**📄 ${include.filePath}**\n\n`);

            // Detect file type for syntax highlighting
            const fileExtension = resolvedPath.split('.').pop()?.toLowerCase() || '';
            const languageMap: { [key: string]: string } = {
                'md': 'markdown',
                'html': 'html',
                'js': 'javascript',
                'ts': 'typescript',
                'css': 'css',
                'scss': 'scss',
                'yaml': 'yaml',
                'yml': 'yaml',
                'json': 'json',
                'py': 'python',
                'go': 'go'
            };

            const language = languageMap[fileExtension] || 'text';
            markdown.appendCodeblock(preview, language);

            markdown.appendMarkdown(`\n\n[Open file](command:hugo-include-viewer.showInclude?${encodeURIComponent(JSON.stringify([resolvedPath]))})`);

            return new vscode.Hover(markdown, include.range);
        } catch (error) {
            return new vscode.Hover(
                new vscode.MarkdownString(`❌ **Error reading file**: ${include.filePath}`),
                include.range
            );
        }
    }
}

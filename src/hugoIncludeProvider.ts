import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

export class HugoIncludeProvider {
    private cache: Map<string, string> = new Map();

    constructor() {}

    /**
     * Clear the file content cache
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * Find all include statements in a document
     */
    public findIncludes(document: vscode.TextDocument): IncludeMatch[] {
        const config = vscode.workspace.getConfiguration('hugo-include-viewer');
        const patterns = config.get<string[]>('includePatterns', []);

        const includes: IncludeMatch[] = [];
        const text = document.getText();
        const lines = text.split('\n');

        for (let lineIndex = 0; lineIndex < lines.length; lineIndex++) {
            const line = lines[lineIndex];

            for (const pattern of patterns) {
                const regex = new RegExp(pattern, 'g');
                let match;

                while ((match = regex.exec(line)) !== null) {
                    const filePath = match[1]; // First capture group should be the file path
                    const startPos = new vscode.Position(lineIndex, match.index);
                    const endPos = new vscode.Position(lineIndex, match.index + match[0].length);
                    const range = new vscode.Range(startPos, endPos);

                    includes.push({
                        range,
                        filePath,
                        fullMatch: match[0],
                        line: lineIndex
                    });
                }
            }
        }

        return includes;
    }

    /**
     * Resolve the actual file path for an include
     */
    public resolveIncludePath(document: vscode.TextDocument, includePath: string): string | null {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(document.uri);
        if (!workspaceFolder) {
            return null;
        }

        // Common Hugo paths to check
        const possiblePaths = [
            // Relative to current file
            path.resolve(path.dirname(document.uri.fsPath), includePath),
            // Relative to workspace root
            path.join(workspaceFolder.uri.fsPath, includePath),
            // Common Hugo directories
            path.join(workspaceFolder.uri.fsPath, 'content', includePath),
            path.join(workspaceFolder.uri.fsPath, 'layouts', 'partials', includePath),
            path.join(workspaceFolder.uri.fsPath, 'static', includePath),
            path.join(workspaceFolder.uri.fsPath, 'assets', includePath)
        ];

        for (const possiblePath of possiblePaths) {
            try {
                if (fs.existsSync(possiblePath) && fs.statSync(possiblePath).isFile()) {
                    return possiblePath;
                }
            } catch (error) {
                // Continue to next path
            }
        }

        return null;
    }

    /**
     * Get the content of an included file
     */
    public async getIncludeContent(filePath: string): Promise<string | null> {
        try {
            // Check cache first
            if (this.cache.has(filePath)) {
                return this.cache.get(filePath)!;
            }

            // Read file content
            const content = fs.readFileSync(filePath, 'utf8');

            // Cache the content
            this.cache.set(filePath, content);

            return content;
        } catch (error) {
            console.error(`Error reading include file ${filePath}:`, error);
            return null;
        }
    }

    /**
     * Get a preview of the include content (truncated)
     */
    public async getIncludePreview(filePath: string): Promise<string | null> {
        const content = await this.getIncludeContent(filePath);
        if (!content) {
            return null;
        }

        const config = vscode.workspace.getConfiguration('hugo-include-viewer');
        const maxLines = config.get<number>('maxPreviewLines', 50);

        const lines = content.split('\n');
        if (lines.length <= maxLines) {
            return content;
        }

        const preview = lines.slice(0, maxLines).join('\n');
        return `${preview}\n\n... (${lines.length - maxLines} more lines)`;
    }
}

export interface IncludeMatch {
    range: vscode.Range;
    filePath: string;
    fullMatch: string;
    line: number;
}

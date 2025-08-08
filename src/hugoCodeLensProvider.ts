import * as vscode from 'vscode';
import { HugoIncludeProvider } from './hugoIncludeProvider';

export class HugoCodeLensProvider implements vscode.CodeLensProvider {
    constructor(private includeProvider: HugoIncludeProvider) {}

    public async provideCodeLenses(
        document: vscode.TextDocument,
        token: vscode.CancellationToken
    ): Promise<vscode.CodeLens[]> {
        const config = vscode.workspace.getConfiguration('hugo-include-viewer');
        const enabled = config.get<boolean>('enableCodeLens', true);

        if (!enabled) {
            return [];
        }

        const includes = this.includeProvider.findIncludes(document);
        const codeLenses: vscode.CodeLens[] = [];

        for (const include of includes) {
            const resolvedPath = this.includeProvider.resolveIncludePath(document, include.filePath);

            if (resolvedPath) {
                // "Show Include Content" lens
                const showLens = new vscode.CodeLens(include.range, {
                    title: `👁️ Show: ${include.filePath}`,
                    command: 'hugo-include-viewer.showInclude',
                    arguments: [resolvedPath]
                });

                // "Preview Content" lens
                const previewLens = new vscode.CodeLens(include.range, {
                    title: '📄 Preview',
                    command: 'vscode.executeHoverProvider',
                    arguments: [document.uri, include.range.start]
                });

                codeLenses.push(showLens, previewLens);
            } else {
                // File not found lens
                const errorLens = new vscode.CodeLens(include.range, {
                    title: `❌ File not found: ${include.filePath}`,
                    command: ''
                });
                codeLenses.push(errorLens);
            }
        }

        return codeLenses;
    }

    public resolveCodeLens(
        codeLens: vscode.CodeLens,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<vscode.CodeLens> {
        return codeLens;
    }
}

import * as vscode from 'vscode';
import { HugoIncludeProvider } from './hugoIncludeProvider';
import { HugoCodeLensProvider } from './hugoCodeLensProvider';
import { HugoHoverProvider } from './hugoHoverProvider';

export function activate(context: vscode.ExtensionContext) {
    console.log('Hugo Include Viewer extension is now active!');

    // Create providers
    const includeProvider = new HugoIncludeProvider();
    const codeLensProvider = new HugoCodeLensProvider(includeProvider);
    const hoverProvider = new HugoHoverProvider(includeProvider);

    // Register providers for markdown and HTML files
    const documentSelector = [
        { scheme: 'file', language: 'markdown' },
        { scheme: 'file', language: 'html' },
        { scheme: 'file', language: 'hugo' }
    ];

    // Register CodeLens provider
    const codeLensDisposable = vscode.languages.registerCodeLensProvider(
        documentSelector,
        codeLensProvider
    );

    // Register Hover provider
    const hoverDisposable = vscode.languages.registerHoverProvider(
        documentSelector,
        hoverProvider
    );

    // Register commands
    const refreshCommand = vscode.commands.registerCommand(
        'hugo-include-viewer.refreshIncludes',
        () => {
            includeProvider.clearCache();
            // Refresh all CodeLens
            vscode.commands.executeCommand('vscode.executeCodeLensProvider');
            vscode.window.showInformationMessage('Hugo include previews refreshed');
        }
    );

    const togglePreviewCommand = vscode.commands.registerCommand(
        'hugo-include-viewer.togglePreview',
        () => {
            const config = vscode.workspace.getConfiguration('hugo-include-viewer');
            const current = config.get('enableInlinePreview', true);
            config.update('enableInlinePreview', !current, vscode.ConfigurationTarget.Workspace);
            vscode.window.showInformationMessage(
                `Hugo include preview ${!current ? 'enabled' : 'disabled'}`
            );
        }
    );

    const showIncludeCommand = vscode.commands.registerCommand(
        'hugo-include-viewer.showInclude',
        async (filePath: string) => {
            try {
                const document = await vscode.workspace.openTextDocument(filePath);
                await vscode.window.showTextDocument(document, vscode.ViewColumn.Beside);
            } catch (error) {
                vscode.window.showErrorMessage(`Could not open file: ${filePath}`);
            }
        }
    );

    // Watch for configuration changes
    const configChangeDisposable = vscode.workspace.onDidChangeConfiguration((event) => {
        if (event.affectsConfiguration('hugo-include-viewer')) {
            includeProvider.clearCache();
            vscode.commands.executeCommand('vscode.executeCodeLensProvider');
        }
    });

    // Add disposables to context
    context.subscriptions.push(
        codeLensDisposable,
        hoverDisposable,
        refreshCommand,
        togglePreviewCommand,
        showIncludeCommand,
        configChangeDisposable
    );
}

export function deactivate() {
    console.log('Hugo Include Viewer extension is now deactivated');
}

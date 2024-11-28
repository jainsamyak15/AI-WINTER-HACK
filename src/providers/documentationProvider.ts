import * as vscode from 'vscode';
import { BrianAPIService } from '../services/brianApiService';

export class DocumentationProvider {
    constructor(private brianApiService: BrianAPIService) {}

    async generateDocumentation() {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            const selectedText = editor.document.getText(editor.selection);
            if (!selectedText) {
                vscode.window.showErrorMessage('Please select code to document');
                return;
            }

            const prompt = `Generate comprehensive documentation for the following Solidity code:\n${selectedText}`;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating Documentation...',
                cancellable: false
            }, async () => {
                const knowledge = await this.brianApiService.getKnowledge(prompt);
                if (knowledge.response) {
                    const documentation = this.formatDocumentation(knowledge.response);
                    
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.start, documentation);
                    });
                } else {
                    vscode.window.showErrorMessage('No documentation response received');
                }
            });
        } catch (error) {
            const errorMessage = (error as Error).message;
            vscode.window.showErrorMessage(`Error generating documentation: ${errorMessage}`);
        }
    }

    private formatDocumentation(documentation: string): string {
        return `/**\n${documentation.split('\n').map(line => ` * ${line}`).join('\n')}\n */\n`;
    }
}

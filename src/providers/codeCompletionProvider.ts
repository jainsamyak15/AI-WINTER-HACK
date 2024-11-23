import * as vscode from 'vscode';
import { BrianAPIService } from '../services/brianApiService';

export class CodeCompletionProvider {
    constructor(private brianApiService: BrianAPIService) {}

    async completeCode() {
        try {
            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                vscode.window.showErrorMessage('No active editor found');
                return;
            }

            const document = editor.document;
            const position = editor.selection.active;
            const linePrefix = document.lineAt(position.line).text.substr(0, position.character);
            const prompt = `Complete the following Solidity code:\n${linePrefix}`;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating Code Completion...',
                cancellable: false
            }, async () => {
                const parameters = await this.brianApiService.getParameters(prompt);
                const completion = await this.brianApiService.getKnowledge(
                    `Generate code completion for: ${JSON.stringify(parameters)}`
                );

                editor.edit(editBuilder => {
                    editBuilder.insert(position, completion.response);
                });
            });
        } catch (error) {
            const errorMessage = (error as Error).message;
            vscode.window.showErrorMessage(`Error completing code: ${errorMessage}`);
        }
    }
}

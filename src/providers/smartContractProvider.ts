import * as vscode from 'vscode';
import { BrianAPIService } from '../services/brianApiService';

export class SmartContractProvider {
    constructor(private brianApiService: BrianAPIService) {}

    async generateSmartContract() {
        try {
            const prompt = await vscode.window.showInputBox({
                prompt: 'Enter your smart contract requirements',
                placeHolder: 'e.g., Create an ERC20 token with mint and burn functions'
            });

            if (!prompt) return;

            const editor = vscode.window.activeTextEditor;
            if (!editor) {
                const doc = await vscode.workspace.openTextDocument({
                    language: 'solidity',
                    content: ''
                });
                await vscode.window.showTextDocument(doc);
            }

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating Smart Contract...',
                cancellable: false
            }, async () => {
                const contractCode = await this.brianApiService.generateSmartContract(prompt);
                if (editor) {
                    editor.edit(editBuilder => {
                        editBuilder.insert(editor.selection.start, contractCode);
                    });
                }
            });
        } catch (error) {
            const errorMessage = (error as Error).message;
            vscode.window.showErrorMessage(`Error generating smart contract: ${errorMessage}`);
        }
    }
}
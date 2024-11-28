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

            if (!prompt) {
                return;
            }

            await vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Generating Smart Contract...',
                cancellable: false
            }, async (progress) => {
                try {
                    progress.report({ message: 'Calling Brian AI...' });
                    const contractCode = await this.brianApiService.generateSmartContract(prompt);
                    
                    if (!contractCode) {
                        throw new Error('No contract code was generated');
                    }

                    // Create a new untitled document with the contract code
                    const document = await vscode.workspace.openTextDocument({
                        language: 'solidity',
                        content: contractCode
                    });

                    // Show the document in the editor
                    await vscode.window.showTextDocument(document);
                    
                    vscode.window.showInformationMessage('Smart contract generated successfully!');
                } catch (error) {
                    const message = error instanceof Error ? error.message : 'Failed to generate smart contract';
                    throw new Error(message);
                }
            });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            vscode.window.showErrorMessage(`Error: ${errorMessage}`);
        }
    }
}
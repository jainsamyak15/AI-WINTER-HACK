import * as vscode from 'vscode';
import { BrianAPIService } from './services/brianApiService';
import { SmartContractProvider } from './providers/smartContractProvider';
import { DocumentationProvider } from './providers/documentationProvider';
import { CodeCompletionProvider } from './providers/codeCompletionProvider';
import { TransactionAnalysisProvider } from './providers/transactionAnalysisProvider';
import { NetworkSupportProvider } from './providers/networkSupportProvider';

export async function activate(context: vscode.ExtensionContext) {
    const brianApiService = new BrianAPIService(context.globalState);
    
    // Add API key command
    const setApiKeyCommand = vscode.commands.registerCommand('brian-ai.setApiKey', async () => {
        const apiKey = await vscode.window.showInputBox({
            prompt: 'Enter your Brian AI API Key',
            password: true
        });
        if (apiKey) {
            await brianApiService.setApiKey(apiKey);
            vscode.window.showInformationMessage('Brian AI API Key set successfully!');
        }
    });
    context.subscriptions.push(setApiKeyCommand);

    const smartContractProvider = new SmartContractProvider(brianApiService);
    const documentationProvider = new DocumentationProvider(brianApiService);
    const codeCompletionProvider = new CodeCompletionProvider(brianApiService);
    const transactionAnalysisProvider = new TransactionAnalysisProvider(brianApiService);
    const networkSupportProvider = new NetworkSupportProvider(brianApiService);

    // Register commands
    context.subscriptions.push(
        vscode.commands.registerCommand('brian-ai.generateSmartContract', () => smartContractProvider.generateSmartContract()),
        vscode.commands.registerCommand('brian-ai.generateDocumentation', () => documentationProvider.generateDocumentation()),
        vscode.commands.registerCommand('brian-ai.completeCode', () => codeCompletionProvider.completeCode()),
        vscode.commands.registerCommand('brian-ai.analyzeTransaction', () => transactionAnalysisProvider.analyzeTransaction()),
        vscode.commands.registerCommand('brian-ai.showNetworkSupport', () => networkSupportProvider.showNetworkSupport())
    );

    // Register status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusBarItem.command = 'brian-ai.showNetworkSupport';
    statusBarItem.text = '$(globe) Web3 Networks';
    statusBarItem.show();
    context.subscriptions.push(statusBarItem);
}

export function deactivate() {}
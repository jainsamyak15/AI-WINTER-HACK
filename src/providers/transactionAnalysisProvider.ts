import * as vscode from 'vscode';
import { BrianAPIService } from '../services/brianApiService';

export class TransactionAnalysisProvider {
    constructor(private brianApiService: BrianAPIService) {}

    async analyzeTransaction() {
        try {
            const prompt = await vscode.window.showInputBox({
                prompt: 'Enter your transaction requirements',
                placeHolder: 'e.g., Send 1 ETH from 0x123... to 0x456...'
            });

            if (!prompt) return;

            vscode.window.withProgress({
                location: vscode.ProgressLocation.Notification,
                title: 'Analyzing Transaction...',
                cancellable: false
            }, async () => {
                const transactionData = await this.brianApiService.getTransactions(prompt);
                this.displayTransactionAnalysis(transactionData);
            });
        } catch (error) {
            const errorMessage = (error as any).message || 'Unknown error';
            vscode.window.showErrorMessage(`Error analyzing transaction: ${errorMessage}`);
        }
    }

    private displayTransactionAnalysis(transactionData: any) {
        const panel = vscode.window.createWebviewPanel(
            'brian-ai.transactionAnalysis',
            'Transaction Analysis',
            vscode.ViewColumn.Beside,
            {}
        );

        panel.webview.html = `
            <html>
            <body>
                <h1>Transaction Analysis</h1>
                <pre>${JSON.stringify(transactionData, null, 2)}</pre>
            </body>
            </html>
        `;
    }
}
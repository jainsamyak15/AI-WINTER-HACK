import * as vscode from 'vscode';
import { BrianAPIService } from '../services/brianApiService';

export class NetworkSupportProvider {
    constructor(private brianApiService: BrianAPIService) {}

    async showNetworkSupport() {
        try {
            const supportedNetworks = await this.brianApiService.getSupportedNetworks();
            const supportedActions = await this.brianApiService.getSupportedActions();

            const panel = vscode.window.createWebviewPanel(
                'brian-ai.networkSupport',
                'Web3 Network Support',
                vscode.ViewColumn.Beside,
                {}
            );

            panel.webview.html = `
                <html>
                <body>
                    <h1>Web3 Network Support</h1>
                    <h2>Supported Networks</h2>
                    <ul>
                        ${supportedNetworks.map(network => `<li>${network}</li>`).join('')}
                    </ul>
                    <h2>Supported Actions</h2>
                    <pre>${JSON.stringify(supportedActions, null, 2)}</pre>
                </body>
                </html>
            `;
        } catch (error) {
            const errorMessage = (error as any).message || 'Unknown error';
            vscode.window.showErrorMessage(`Error fetching network support: ${errorMessage}`);
        }
    }
}
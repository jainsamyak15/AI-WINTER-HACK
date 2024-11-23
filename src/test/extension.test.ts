import * as assert from 'assert';
import * as vscode from 'vscode';
import { BrianAPIService } from '../services/brianApiService';

suite('Brian AI Extension Test Suite', () => {
    test('Extension should be present', () => {
        assert.ok(vscode.extensions.getExtension('brian-ai'));
    });

    test('Should register all commands', async () => {
        const commands = await vscode.commands.getCommands();
        assert.ok(commands.includes('brian-ai.generateSmartContract'));
        assert.ok(commands.includes('brian-ai.generateDocumentation'));
        assert.ok(commands.includes('brian-ai.completeCode'));
        assert.ok(commands.includes('brian-ai.analyzeTransaction'));
        assert.ok(commands.includes('brian-ai.showNetworkSupport'));
    });

    test('BrianAPIService should handle API errors gracefully', async () => {
        const service = new BrianAPIService(new MockMemento());
        try {
            await service.generateSmartContract('test prompt');
            assert.fail('Should have thrown an error');
        } catch (error) {
            assert.ok(error instanceof Error);
        }
    });
});

class MockMemento implements vscode.Memento {
    private storage = new Map<string, any>();

    get<T>(key: string): T | undefined;
    get<T>(key: string, defaultValue: T): T;
    get(key: string, defaultValue?: any) {
        return this.storage.get(key) ?? defaultValue;
    }

    update(key: string, value: any): Thenable<void> {
        this.storage.set(key, value);
        return Promise.resolve();
    }

    keys(): readonly string[] {
        return Array.from(this.storage.keys());
    }
}
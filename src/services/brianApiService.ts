import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import { BrianApiResponse, BrianApiError, SmartContractRequest, SmartContractResponse } from '../utils/types';

export class BrianAPIService {
    private readonly baseUrl = 'https://api.brianknows.org/api/v0/agent';
    private http: AxiosInstance;
    private apiKey: string;

    constructor(private readonly memento: vscode.Memento) {
        this.apiKey = this.memento.get<string>('brian-ai.apiKey') || '';
        this.http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'X-Brian-Api-Key': this.apiKey
            }
        });
    }

    async setApiKey(apiKey: string): Promise<void> {
        this.apiKey = apiKey;
        await this.memento.update('brian-ai.apiKey', apiKey);
        this.http.defaults.headers['X-Brian-Api-Key'] = apiKey;
    }

    async generateSmartContract(prompt: string): Promise<string> {
        try {
            const request: SmartContractRequest = {
                prompt,
                compile: false,
                messages: [{
                    sender: 'user',
                    content: prompt
                }]
            };

            const response = await this.http.post<any>('/smart-contract', request);
            
            // Add debug logging
            console.log('API Response:', JSON.stringify(response.data, null, 2));

            if (!response.data) {
                throw new Error('No response data received from the API');
            }

            // Handle different response formats
            let code: string;
            if (typeof response.data === 'string') {
                code = response.data;
            } else if (response.data.result) {
                code = typeof response.data.result === 'string' ? response.data.result : JSON.stringify(response.data.result);
            } else if (response.data.code) {
                code = response.data.code;
            } else {
                throw new Error('Unexpected response format from the API');
            }

            // Clean up the code if it contains markdown code blocks
            if (code.includes('```')) {
                code = code.replace(/```solidity\n?/, '').replace(/```\n?$/, '');
            }

            return code;
        } catch (error) {
            console.error('Smart Contract Generation Error:', error);
            throw this.handleError(error);
        }
    }

    async getKnowledge(prompt: string): Promise<BrianApiResponse> {
        try {
            const response = await this.http.post('/knowledge', { prompt });
            return {
                response: response.data.answer,
                documentation: response.data.explanation
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getParameters(prompt: string): Promise<any> {
        try {
            const response = await this.http.post('/parameters-extraction', { prompt });
            return response.data.parameters;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getTransactions(prompt: string): Promise<BrianApiResponse> {
        try {
            const response = await this.http.post('/transaction', { prompt });
            return {
                response: JSON.stringify(response.data.transactions),
                transactions: response.data.transactions
            };
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getSupportedNetworks(): Promise<string[]> {
        try {
            const response = await this.http.get('/networks');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getSupportedActions(): Promise<any> {
        try {
            const response = await this.http.get('/actions');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const apiError: BrianApiError = error.response?.data;
            if (error.response?.status === 401) {
                return new Error('Invalid or missing API key. Please set your API key using the "Brian AI: Set API Key" command.');
            }
            if (error.response?.status === 429) {
                return new Error('Too many requests. Please try again later.');
            }
            return new Error(`Brian AI Error: ${apiError?.message || error.message}`);
        }
        return error instanceof Error ? error : new Error('Unknown error occurred');
    }
}
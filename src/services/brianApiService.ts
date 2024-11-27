import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import { BrianApiResponse, BrianApiError } from '../utils/types';

export class BrianAPIService {
    private readonly baseUrl = 'https://api.brianknows.org/api/v0/agent';
    private apiKey: string;
    private http!: AxiosInstance;

    constructor(private readonly memento: vscode.Memento) {
        this.apiKey = this.memento.get<string>('brian-ai.apiKey') || '';
        this.initializeHttpClient();
    }

    private initializeHttpClient() {
        this.http = axios.create({
            baseURL: this.baseUrl,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
    }

    async setApiKey(apiKey: string): Promise<void> {
        this.apiKey = apiKey;
        await this.memento.update('brian-ai.apiKey', apiKey);
        this.initializeHttpClient();
    }

    async generateSmartContract(prompt: string): Promise<string> {
        try {
            const response = await this.http.post<BrianApiResponse>('/smart-contract', { prompt });
            return response.data.contract || '';
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getKnowledge(prompt: string): Promise<BrianApiResponse> {
        try {
            const response = await this.http.post<BrianApiResponse>('/knowledge', { prompt });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getParameters(prompt: string): Promise<any> {
        try {
            const response = await this.http.post<any>('/parameters-extraction', { prompt });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getTransactions(prompt: string): Promise<BrianApiResponse> {
        try {
            const response = await this.http.post<BrianApiResponse>('/transaction', { prompt });
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getSupportedNetworks(): Promise<string[]> {
        try {
            const response = await this.http.get<string[]>('/networks');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    async getSupportedActions(): Promise<any> {
        try {
            const response = await this.http.get<any>('/actions');
            return response.data;
        } catch (error) {
            throw this.handleError(error);
        }
    }

    private handleError(error: any): Error {
        if (axios.isAxiosError(error)) {
            const apiError: BrianApiError = error.response?.data;
            return new Error(`Brian API Error: ${apiError?.message || error.message}`);
        }
        return error instanceof Error ? error : new Error('Unknown error occurred');
    }
}
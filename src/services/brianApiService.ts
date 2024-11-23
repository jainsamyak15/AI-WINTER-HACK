import axios, { AxiosInstance } from 'axios';
import * as vscode from 'vscode';
import { BrianApiResponse, BrianApiError } from '../utils/types';

export class BrianAPIService {
    private readonly baseUrl = 'https://api.brianknows.org/api/v0';
    private apiKey: string;
    private http: AxiosInstance;

    constructor(globalState: vscode.Memento) {
        this.apiKey = globalState.get<string>('brian-ai.apiKey') || '';
        this.http = axios.create({
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            }
        });
    }

    async generateSmartContract(prompt: string): Promise<string> {
        try {
            const response = await this.http.post<BrianApiResponse>(`${this.baseUrl}/smart-contract`, { prompt });
            return response.data.contract || '';
        } catch (error) {
            this.handleError(error);
        }
    }

    async getKnowledge(prompt: string): Promise<BrianApiResponse> {
        try {
            const response = await this.http.post<BrianApiResponse>(`${this.baseUrl}/knowledge`, { prompt });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getParameters(prompt: string): Promise<any> {
        try {
            const response = await this.http.post<any>(`${this.baseUrl}/parameters-extraction`, { prompt });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getTransactions(prompt: string): Promise<BrianApiResponse> {
        try {
            const response = await this.http.post<BrianApiResponse>(`${this.baseUrl}/transaction`, { prompt });
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getSupportedNetworks(): Promise<string[]> {
        try {
            const response = await this.http.get<string[]>(`${this.baseUrl}/networks`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    async getSupportedActions(): Promise<any> {
        try {
            const response = await this.http.get<any>(`${this.baseUrl}/actions`);
            return response.data;
        } catch (error) {
            this.handleError(error);
        }
    }

    private handleError(error: any): never {
        if (axios.isAxiosError(error)) {
            const apiError: BrianApiError = error.response?.data;
            throw new Error(`Brian API Error: ${apiError.message}`);
        } else {
            throw error;
        }
    }
}
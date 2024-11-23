// src/utils/types.ts
export interface BrianApiResponse {
    response: string;
    documentation?: string;
    contract?: string;
    parameters?: any;
    transactions?: any;
    networks?: string[];
    actions?: any;
}

export interface BrianApiError {
    message: string;
    code?: number;
    status?: number;
}
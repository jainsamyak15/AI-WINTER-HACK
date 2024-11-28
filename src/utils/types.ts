export interface SmartContractResponse {
    result: string;
    abi: any | null;
    bytecode: string;
}

export interface BrianApiResponse {
    response?: string;
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

export interface SmartContractRequest {
    prompt: string;
    compile?: boolean;
    messages?: Array<{
        sender: string;
        content: string;
    }>;
}
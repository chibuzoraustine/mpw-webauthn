export declare const register: (merchant_id: string, unique_identifier: string) => Promise<{
    message: string;
    data: {
        credential_id: string;
        registration_session_id: string;
        response: {
            device_id: string;
            merchant_id: string;
        };
    };
}>;
export declare const authenticate: (credential_id: string, device_id: string, registration_session_id: string) => Promise<{
    message: string;
    data: {
        credential_id: string;
        registration_session_id: string;
        authentication_session_id: string;
    };
}>;
export declare class RequestError extends Error {
    message: string;
    data: object | unknown;
    readonly name: string;
    constructor(message?: string, data?: object | unknown, name?: string);
}

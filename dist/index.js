"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestError = exports.authenticate = exports.register = void 0;
const axios_1 = require("axios");
const apiUrl = 'https://chibuzornode.moipayway.dev/webauthn';
const bufferToBase64 = (buffer) => {
    return btoa(String.fromCharCode(...new Uint8Array(buffer)));
};
const base64ToBuffer = (base64) => {
    return Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)).buffer;
};
const register = (merchant_id, unique_identifier) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        isBrowser();
        const opt_resp = (yield axios_1.default.post(`${apiUrl}/registration-options`)).data;
        const { registrationOptions: credentialCreationOptions, registration_session_id } = opt_resp.data;
        console.log("registration_session_id", registration_session_id);
        console.log(JSON.parse(JSON.stringify(credentialCreationOptions)));
        credentialCreationOptions.challenge = new Uint8Array(credentialCreationOptions.challenge.data);
        credentialCreationOptions.user.id = new Uint8Array(credentialCreationOptions.user.id.data);
        credentialCreationOptions.user.name = 'chi@test.com';
        credentialCreationOptions.user.displayName = 'badboychi';
        console.log(credentialCreationOptions);
        const credential = yield navigator.credentials.create({
            publicKey: credentialCreationOptions
        });
        const credential_id = bufferToBase64(credential.rawId);
        const data = {
            rawId: credential_id,
            response: {
                attestationObject: bufferToBase64(credential.response.attestationObject),
                clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
                id: credential.id,
                type: credential.type
            }
        };
        const resp = (yield axios_1.default.post(`${apiUrl}/register`, {
            credential: JSON.stringify(data),
            registration_session_id: registration_session_id,
            merchant_id: merchant_id,
            unique_identifier: unique_identifier
        })).data;
        return ({
            message: "Registration successful",
            data: {
                credential_id: credential_id,
                registration_session_id: registration_session_id,
                response: resp.data
            }
        });
    }
    catch (e) {
        throw new RequestError('registration failed', e);
    }
});
exports.register = register;
const authenticate = (credential_id, device_id, registration_session_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        isBrowser();
        const auth_resp = (yield axios_1.default.post(`${apiUrl}/authentication-options`)).data;
        const { authnOptions: credentialRequestOptions, authentication_session_id } = auth_resp.data;
        console.log("authentication_session_id", authentication_session_id);
        credentialRequestOptions.challenge = new Uint8Array(credentialRequestOptions.challenge.data);
        credentialRequestOptions.allowCredentials = [
            {
                id: base64ToBuffer(credential_id),
                type: 'public-key',
                transports: ['internal']
            }
        ];
        const credential = yield navigator.credentials.get({
            publicKey: credentialRequestOptions
        });
        const data = {
            rawId: bufferToBase64(credential.rawId),
            response: {
                authenticatorData: bufferToBase64(credential.response.authenticatorData),
                signature: bufferToBase64(credential.response.signature),
                userHandle: bufferToBase64(credential.response.userHandle),
                clientDataJSON: bufferToBase64(credential.response.clientDataJSON),
                id: credential.id,
                type: credential.type
            }
        };
        const response = (yield axios_1.default.post(`${apiUrl}/authenticate`, {
            credential: JSON.stringify(data),
            authentication_session_id: authentication_session_id,
            registration_session_id: registration_session_id,
            device_id: device_id
        })).data;
        return ({
            message: "Athentication Successful",
            data: {
                credential_id: credential_id,
                registration_session_id: registration_session_id,
                authentication_session_id: authentication_session_id
            }
        });
    }
    catch (e) {
        throw new RequestError('Credential has expired, please register a new credential', e);
    }
});
exports.authenticate = authenticate;
class RequestError extends Error {
    constructor(message = "Bad Request", data = {}, name = "RequestError") {
        super(message);
        this.message = message;
        this.data = data;
        this.name = name;
    }
}
exports.RequestError = RequestError;
function isBrowser() {
    if (typeof window === 'undefined') {
        throw new Error('This library is intended for use in browser environments only.');
    }
}

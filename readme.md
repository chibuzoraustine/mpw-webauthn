# MoiPawWay WebAuthN

mpw-webauthn is a JavaScript library designed to streamline the integration of WebAuthn (Web Authentication) into web applications. WebAuthn is a powerful standard for secure and convenient user authentication on the web, offering strong cryptographic security while eliminating the need for passwords.

Moipayway introduces seamless WebAuthn services, providing users with robust and secure authentication experiences. Elevate your platform's security and user convenience with Moipayway's WebAuthn integration.

## Installation

Include the library in your project either via npm or by directly including the script in your HTML file.

```bash
npm install mpw-webauthn
```

## Usage

```javascript
import { register, authenticate } from "mpw-webauthn"

//registration 
try {
    const resp = await register("merchant_id", "unique_identifier");

    // store in local storage
    localStorage.setItem('credential', JSON.stringify({
      credential_id: resp.data.credential_id,
      registration_session_id: resp.data.registration_session_id,
      device_id: resp.data.response.device_id
    }));
    
    // If you want to view the response in the console
    console.log(resp)
}
catch (e) {
      console.error('Registration failed', e);
}


// Authenticating
try {
    const credential = JSON.parse(localStorage.getItem('credential')!);
    const response = await authenticate(credential.credential_id, credential.device_id, credential.registration_session_id);

    // If you want to view the response in the console
    console.log(response);
    }
catch (e) {
    console.error('Authentication failed', e);
}

```

## Conclusion

mpw-webauthn empowers developers to implement robust and secure authentication mechanisms in their web applications with minimal effort. By abstracting the complexities of WebAuthn and seamlessly integrating with Moipaway backend servers, the library offers a hassle-free solution for modern authentication requirements.

Enhance the security of your application and improve the user experience by incorporating mpw-webauthn today.
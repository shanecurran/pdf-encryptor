# Hello Function
[Evervault](https://evervault.com) makes it easy to encrypt data at source, process it in a Function — a secure, serverless function — and never store it unencrypted.

This is a simple Evervault Function example, to help get you up and running on the Evervault platform quickly.

## Getting started with Evervault

Evervault consists of two parts, encrypting your data at source, using either our Node SDK, or Browser and React SDKs and then sending that encrypted data to a Function to be processed securely.

This Function takes a payload that should contain a `name` key. Running the Function is very simple.

## The steps
1. Encrypt your data at source, using one of our SDKs.
2. Process the encrypted data in a Function

### Encrypting at source
```javascript
// This example uses the Evervault Node SDK.
const Evervault = require('@evervault/sdk');

// Initialize the client with your App's API key
const evervault = new Evervault('<YOUR-API-KEY>');

// Encrypt your data
const encrypted = await evervault.encrypt({ name: 'Claude Shannon' });
```

### Process your encrypted data in a Function
You should encrypt this payload using either our Node SDK or Browser SDK, then run it in the Hello Function:

```javascript
// Process the encrypted data in a Function
const result = await evervault.run('<YOUR_FUNCTION_NAME>', encrypted);
```

## Understanding the Function
This Function is very simple. Here is the full code:

```javascript
exports.handler = async (data) => {
  if (data.name && typeof data.name === "string") {
    console.debug(`A name of length ${data.name.length} has arrived into the Function.`);

    return {
      message: `Hello from a Function! It seems you have ${data.name.length} letters in your name`,
      name: await evervault.encrypt(data.name),
    };
  } else {
    console.debug('An empty name has arrived into the Function.');

    return {
      message: 'Hello from a Function! Send an encrypted `name` parameter to show Function decryption in action',
    };
  }
};
```

Or check it out in [index.js](./index.js).

--- 
If you want to know more about Evervault, check out our [documentation](https://docs.evervault.com).
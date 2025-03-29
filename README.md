# JetSetGo Wrapper App

This is a wrapper application designed to test JetSetGo SPAs in embedded mode. It provides Firebase authentication and passes the authentication token and tenant name to embedded child applications.

## Features

- Firebase authentication
- Token and tenant name extraction from Firebase claims
- Mechanism to embed child SPAs
- Support for both standalone and embedded modes for child apps

## Setup

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file with your Firebase configuration:
   ```
   VITE_API_URL=your_api_url
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   ```
4. Run the development server:
   ```
   npm run dev
   ```

## How to Add Child Apps

To add a child app to this wrapper for testing embedded mode, follow these steps:

### Method 1: Using npm link (for local development)

1. In your child app repository:
   ```bash
   npm link
   ```

2. In this wrapper app:
   ```bash
   npm link your-child-app-package-name
   ```

3. Import and use the child app in `EmbeddedApp.jsx`:
   ```jsx
   import ChildApp from 'your-child-app-package-name';
   
   // Then in your component:
   <ChildApp 
     authToken={authToken} 
     tenantName={tenantName} 
   />
   ```

### Method 2: Using direct import (for quick testing)

1. Build your child app:
   ```bash
   cd your-child-app
   npm run build
   ```

2. Copy the built files to a directory in this wrapper app (e.g., `public/child-apps/your-app-name/`)

3. Create a component to load the child app in `src/childApps/YourChildApp.jsx`:
   ```jsx
   import { useEffect, useRef } from 'react';
   
   const YourChildApp = ({ authToken, tenantName }) => {
     const containerRef = useRef(null);
     
     useEffect(() => {
       if (containerRef.current && window.YourChildAppInitFunction) {
         window.YourChildAppInitFunction(containerRef.current, {
           authToken,
           tenantName
         });
       }
     }, [containerRef, authToken, tenantName]);
     
     return <div ref={containerRef} className="child-app-container"></div>;
   };
   
   export default YourChildApp;
   ```

4. Update the `EmbeddedApp.jsx` to dynamically load the appropriate child app based on the URL parameter.

### Method 3: Using npm packages (for production)

1. Publish your child app as an npm package:
   ```bash
   cd your-child-app
   npm publish
   ```

2. Install the package in this wrapper app:
   ```bash
   npm install your-child-app-package-name
   ```

3. Import and use the child app in `EmbeddedApp.jsx` as shown in Method 1.

## Testing Embedded Mode

1. Log in to the wrapper app
2. Navigate to `/embedded/your-app-name` to see the embedded child app
3. Verify that the child app is using the authentication token and tenant name from the wrapper app
4. Confirm that the child app can make API calls using these credentials

## Authentication Flow

The wrapper app handles authentication through Firebase and passes the authentication details to child apps:

1. User logs in to the wrapper app
2. Wrapper app obtains Firebase token and tenant name
3. When navigating to an embedded child app, the wrapper passes these credentials as props
4. Child app uses these credentials for API calls instead of its own Firebase authentication

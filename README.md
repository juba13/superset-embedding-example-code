# Superset Embedding Example

This project demonstrates how to embed an Apache Superset dashboard into an Express application. It includes a route for generating HTML that embeds the dashboard 

If the CDN is unavailable, you can download the latest SDK from [@superset-ui/embedded-sdk](https://www.npmjs.com/package/@superset-ui/embedded-sdk) and store it in your project's public directory. This ensures that your dashboard embedding will still work properly.


## Prerequisites

- **Node.js** (v12+ recommended) and **npm** installed.
- A running Apache Superset instance configured for embedding. Key settings include:
  - \`EMBEDDED_SUPERSET: True\`
  - \`GUEST_ROLE_NAME\` (e.g., "Gamma")
  - \`GUEST_TOKEN_JWT_SECRET\`
  - \`GUEST_TOKEN_JWT_ALGO\`
  - \`GUEST_TOKEN_HEADER_NAME\`
  - \`GUEST_TOKEN_JWT_EXP_SECONDS\`

## Setup Steps

1. **Get the Code**

   Clone the repository to your local machine:
   ```bash
   git clone https://github.com/juba13/superset-embedding-example-code.git
   cd superset-embedding-example-code
   ```

2. **Superset Configuration**

   Ensure your Superset instance is configured with the key settings mentioned above. Update your \`superset_config.py\` (or use environment variables) accordingly.

3. **Create Guest Role and Guest User**

   - In Superset, **create a guest role** (for example, "Gamma") and assign it the permissions required to view dashboards.
   - **Create a guest user** and assign the guest role to that user.

4. **Create a Dashboard**

   - In Superset, create a dashboard.
   - Copy the **Dashboard ID** (a UUID) from Superset.
   - Open the \`index.js\` file in this project and update the following variables with your Superset credentials and dashboard ID:
     - \`username\`
     - \`password\`
     - \`dashboardId\`

5. **Install Dependencies and Run the Application**

   Install the Node.js dependencies:
   ```bash
   npm install
   ```
   Then start the server:
   ```bash
   npm run start
   ```

6. **Access the Embedded Dashboard**

   Open your browser and navigate to:
   ```
   http://localhost:9090/superset/html
   ```
   You should see your Superset dashboard embedded on the page.


## Conclusion

This example demonstrates embedding a Superset dashboard using guest tokens. Customize the code as needed to suit your environment and enjoy building your applications with embedded dashboards!


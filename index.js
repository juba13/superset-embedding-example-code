const express = require("express");
const fetch = require("node-fetch");
const path = require("path");

const app = express();
app.use(express.json());


// Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, "public")));


const supersetApiUrl = "http://localhost:8088";
const username = "admin";
const password = "admin";
const dashboardId='d773e0a6-ab06-47fa-bc89-1d92a77d9fa0';
// const dashboardId='b8863043-6c49-43f9-832b-1bb57630db84';

// Function to perform common steps: login, get CSRF token, and generate embedding token
async function getEmbeddingData() {
  // Step 1: Login and get credentials
  const credentialsResponse = await fetch(`${supersetApiUrl}/api/v1/security/login`, {
    method: "POST",
    body: JSON.stringify({ username, password, provider: "db", refresh: true }),
    headers: { "Content-Type": "application/json", Accept: "application/json" },
  });
  const credentials = await credentialsResponse.json();
  if (!credentials.access_token) {
    throw new Error("Failed to obtain credentials");
  }

  // Step 2: Get CSRF token
  const csrfResponse = await fetch(`${supersetApiUrl}/api/v1/security/csrf_token`, {
    headers: { Authorization: `Bearer ${credentials.access_token}` },
  });
  console.log(JSON.stringify({csrfResponse}))
  const sessionCookie = csrfResponse.headers.get("set-cookie");
  const csrf = await csrfResponse.json();
  if (!csrf.result) {
    throw new Error("Failed to obtain CSRF token");
  }

  // Step 3: Generate embedding token
  const embeddingResponse = await fetch(`${supersetApiUrl}/api/v1/security/guest_token/`, {
    method: "POST",
    body: JSON.stringify({
      user: { username, first_name: username, last_name: username },
      resources: [{ type: "dashboard", id: dashboardId }],
      rls: [],
    }),
    headers: {
      "X-CSRFToken": csrf.result,
      Authorization: `Bearer ${credentials.access_token}`,
      Cookie: sessionCookie,
      Referer: supersetApiUrl,
      "Content-Type": "application/json",
    },
  });

  if (!embeddingResponse.ok) {
    console.error(
      `Embedding request failed. Status: ${embeddingResponse.status}, ` +
      `StatusText: ${embeddingResponse.statusText}`
    );
    throw new Error("Failed to fetch embedding token");
  }

  const embedding = await embeddingResponse.json();

  if (!embedding.token) {
    throw new Error("Failed to fetch embedding token");
  }

  return embedding.token;
}

// Function to create HTML content using the embedding token
async function createHtmlContent(embeddingToken) {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard</title>
       <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body, html {
                width: 100%;
                height: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                background-color: #f4f4f4;
            }
            #dashboard-container {
                width: 100%;
                height: 100%;
                overflow: hidden;
                background: white;
            }
            iframe {
                width: 100%;
                height: 100%;
                border: none;
            }
        </style>
        <!-- Load Preset Embedded SDK -->
        <script src="/superset_ui_embedded_sdk_0_1_3.js"></script>
  </body>
    </head>
    <body>
        <div id="dashboard-container"></div>
        <script>
            // Embed the dashboard
            async function embedDashboard() {
                supersetEmbeddedSdk.embedDashboard({
                    id: '${dashboardId}', // Dashboard ID
                    supersetDomain: '${supersetApiUrl}', // Superset instance URL
                    mountPoint: document.getElementById("dashboard-container"),
                    fetchGuestToken: async () => '${embeddingToken}',
                    dashboardUiConfig: {
                        hideTitle: true,
                        hideTab: true ,
                        hideChartControls: false,
                        filters: {
                            visible: true,
                            expanded: false,
                        },
                    },
                });
            }
            // Call the embed function
            embedDashboard();
        </script>
    </body>
    </html>
  `;
}



// Endpoint to return HTML content
app.get("/", async (req, res) => {
  try {
    const embeddingToken = await getEmbeddingData();
    const htmlContent = await createHtmlContent(embeddingToken);
    console.log(htmlContent)
    res.setHeader("Content-Type", "text/html");
    res.send(htmlContent);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("An error occurred while generating the HTML.");
  }
});



const PORT = 9090;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

// ============================================
// DIRECTORY STRUCTURE:
// ============================================
// your-function/
//   ├── src/
//   │   └── main.ts
//   └── .gitignore (optional)
// ============================================

// ============================================
// FILE: src/main.ts
// ============================================

import { Client, Databases } from "https://deno.land/x/appwrite@11.0.0/mod.ts";

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(Deno.env.get("APPWRITE_FUNCTION_API_ENDPOINT") || "")
    .setProject(Deno.env.get("APPWRITE_FUNCTION_PROJECT_ID") || "")
    .setKey(Deno.env.get("APPWRITE_API_KEY") || "");

  const databases = new Databases(client);

  try {
    const databaseId = Deno.env.get("DATABASE_ID") || "your-database-id";
    const collectionId = Deno.env.get("COLLECTION_ID") || "your-collection-id";

    log("Fetching 10 documents from collection...");

    const documents = await databases.listDocuments(
      databaseId,
      collectionId,
      [],
      10
    );

    log(`Successfully fetched ${documents.documents.length} documents`);

    return res.json({
      success: true,
      data: documents.documents,
      total: documents.total,
    });
  } catch (err: any) {
    error("Error fetching documents: " + err.message);
    
    return res.json({
      success: false,
      error: err.message,
    }, 500);
  }
};


// ============================================
// DEPLOYMENT STEPS:
// ============================================

// 1. Create folder structure:
//    mkdir -p your-function/src
//    cd your-function

// 2. Create src/main.ts with the code above

// 3. In Appwrite Console:
//    - Go to Functions
//    - Click "Create Function"
//    - Choose "Deno" as runtime
//    - Set Entrypoint: src/main.ts
//    - Add Environment Variables:
//      * DATABASE_ID
//      * COLLECTION_ID
//      * APPWRITE_API_KEY

// 4. Deploy:
//    Option A - Manual Upload:
//      - Zip the entire folder (including src/ directory)
//      - Upload via Appwrite Console

//    Option B - CLI:
//      appwrite deploy function

//    Option C - Git:
//      - Connect your Git repository
//      - Push changes


// ============================================
// ALTERNATIVE: If using Appwrite CLI
// ============================================

// Create appwrite.json in project root:
/*
{
  "projectId": "your-project-id",
  "functions": [
    {
      "name": "fetchDocuments",
      "runtime": "deno-1.40",
      "entrypoint": "src/main.ts",
      "path": "functions/fetchDocuments",
      "execute": ["any"],
      "events": [],
      "schedule": "",
      "timeout": 15,
      "enabled": true,
      "logging": true,
      "scopes": [
        "databases.read",
        "collections.read",
        "documents.read"
      ]
    }
  ]
}
*/

// Then run:
// appwrite deploy function

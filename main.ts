// Appwrite Function using Deno
// File: main.ts

import { Client, Databases } from "https://deno.land/x/appwrite@11.0.0/mod.ts";

export default async ({ req, res, log, error }: any) => {
  const client = new Client()
    .setEndpoint(Deno.env.get("APPWRITE_FUNCTION_API_ENDPOINT") || "")
    .setProject(Deno.env.get("APPWRITE_FUNCTION_PROJECT_ID") || "")
    .setKey(Deno.env.get("APPWRITE_API_KEY") || "");

  const databases = new Databases(client);

  try {
    // Replace with your database ID and collection ID
    const databaseId = Deno.env.get("DATABASE_ID") || "your-database-id";
    const collectionId = Deno.env.get("COLLECTION_ID") || "your-collection-id";

    log("Fetching 10 documents from collection...");

    // Fetch 10 documents from the collection
    const documents = await databases.listDocuments(
      databaseId,
      collectionId,
      [
        // Query to limit results to 10
      ],
      10 // limit
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

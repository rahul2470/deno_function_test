import { Client, Databases, Query } from 'node-appwrite';

// Appwrite Functions automatically provide certain environment variables.
// These are used for the Client configuration.
const endpoint = process.env.APPWRITE_FUNCTION_ENDPOINT;
const projectId = process.env.APPWRITE_FUNCTION_PROJECT_ID;
const apiKey = process.env.APPWRITE_FUNCTION_API_KEY; // Requires read access to the database

// You must set these as environment variables when configuring your function
// in the Appwrite Console (e.g., DB_ID=your_database_id, COL_ID=your_collection_id)
const DATABASE_ID = process.env.DB_ID;
const COLLECTION_ID = process.env.COL_ID;

/**
 * Appwrite Function entry point.
 * @param {object} context The execution context object provided by Appwrite.
 */
module.exports = async (context) => {
  // 1. Validate environment variables
  if (!endpoint || !projectId || !apiKey) {
    context.log('Error: Appwrite Function environment variables (ENDPOINT, PROJECT_ID, API_KEY) must be set.');
    return context.res.json({ success: false, message: 'Missing Appwrite client configuration.' }, 500);
  }

  if (!DATABASE_ID || !COLLECTION_ID) {
    context.log('Error: Database ID (DB_ID) and Collection ID (COL_ID) environment variables must be set.');
    return context.res.json({ success: false, message: 'Missing database/collection configuration.' }, 500);
  }

  // 2. Initialize Appwrite Client
  const client = new Client()
    .setEndpoint(endpoint)
    .setProject(projectId)
    .setKey(apiKey); // Ensure this API key has 'databases.read' permission

  const databases = new Databases(client);

  try {
    context.log(`Attempting to fetch 5 documents from DB: ${DATABASE_ID}, Collection: ${COLLECTION_ID}...`);

    // 3. Execute the Query: Fetch documents with a limit of 5
    const response = await databases.listDocuments(
      DATABASE_ID,
      COLLECTION_ID,
      [
        Query.limit(5) // Limit the result to 5 documents
      ]
    );

    context.log(`Successfully fetched ${response.documents.length} documents.`);

    // 4. Print results to the console (standard output/logs)
    context.log("--- Fetched Documents (First 5) ---");
    response.documents.forEach((doc, index) => {
      // Print the document ID and any relevant fields (like 'name' or a small snippet)
      context.log(`[${index + 1}] ID: ${doc.$id}, Content Sample: ${JSON.stringify(doc).substring(0, 100)}...`);
    });
    context.log("-----------------------------------");

    // 5. Return a successful response
    return context.res.json({
      success: true,
      message: `Successfully retrieved ${response.documents.length} documents. Results are in the function logs.`,
      total: response.total,
      documentIds: response.documents.map(d => d.$id)
    });

  } catch (error) {
    context.log('Error fetching documents:');
    context.log(error.message);
    
    // Return an error response
    return context.res.json({
      success: false,
      message: 'Failed to fetch documents.',
      error: error.message
    }, 500);
  }
};

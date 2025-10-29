import { Client, Databases, Query } from 'node-appwrite';

// Appwrite Functions automatically provide certain environment variables.
// These are used for the Client configuration.
const endpoint = 'https://nyc.cloud.appwrite.io/v1';
const projectId = '68a184da002e018215ac'
const apiKey = 'standard_5f14eaacfef6c7ff4f9476441b0d49b82bc2f8d3e3fb5b8538aa774c95c7a629a3f7922a5ea8c66c3be3b90705c2e57a9af08dddb402c7630e5a8db800db677cb646318e0ccbf7d05170c2b6310d273512f3b7771e0165196b54475e5575d0322d0a9e67c8f38367e01290eeb5e4e28db1aa1f980c4f2dab311b31a0bf642a60'; // Requires read access to the database

// You must set these as environment variables when configuring your function
// in the Appwrite Console (e.g., DB_ID=your_database_id, COL_ID=your_collection_id)
const DATABASE_ID = '68a29509003a98c08fcc'
const COLLECTION_ID = '68a759670015ef944a21'

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

import { Client, Databases, Query } from "node-appwrite"

export default async ({ req, res, log, error }) => {
  try {
    // Initialize Appwrite client
    const client = new Client()
      .setEndpoint(process.env.APPWRITE_API_ENDPOINT)
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY)

    // Initialize Databases service
    const databases = new Databases(client)

    // Query the free_plan table/collection
    // Replace 'your_database_id' and 'free_plan' with your actual database and collection IDs
    const response = await databases.listDocuments(process.env.APPWRITE_DATABASE_ID, "free_plan", [
      // Limit to 10 rows
      Query.limit(10),
    ])

    log("Successfully fetched free plans:", response.documents.length)

    return res.json({
      success: true,
      count: response.documents.length,
      data: response.documents,
    })
  } catch (err) {
    error("Error fetching free plans:", err.message)
    return res.json(
      {
        success: false,
        error: err.message,
      },
      500,
    )
  }
}

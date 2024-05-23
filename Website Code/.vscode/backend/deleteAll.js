//Responsible for deleting everything in the Database
const { MongoClient } = require('mongodb');

async function deleteAllDocuments() {
  const uri = "mongodb+srv://kcstungal:pv5tXITn7WzhhO3L@cluster0.oduevtf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

  try {
    await client.connect();
    const database = client.db("Temp");
    const collection = database.collection("records");

    // Delete all documents in the collection
    const result = await collection.deleteMany({});
    console.log(`${result.deletedCount} documents were deleted`);
  } finally {
    await client.close();
  }
}

deleteAllDocuments().catch(console.error);
//To start server, enter in terminal: node server.js

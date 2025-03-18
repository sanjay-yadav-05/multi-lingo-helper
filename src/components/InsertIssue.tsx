import {React, useEffect } from "react";
import { MongoClient } from "mongodb";

const MONGO_URI = "YOUR_MONGODB_CONNECTION_STRINGmongodb+srv://yadav-sanjay:S%40nj%40yy%40d%40v%408483@cluster0.q4ojo.mongodb.net/"; // Store in .env for security

interface InsertIssueProps {
    issueSummary: string;
}

const InsertIssue: React.FC<InsertIssueProps> = ({ issueSummary }) => {
    useEffect(() => {
        const insertData = async () => {
            if (!issueSummary) return;

            const client = new MongoClient(MONGO_URI);

            try {
                await client.connect();
                const db = client.db("Query_resolver");
                const collection = db.collection("QueryStatement");

                const document = {
                    id: `U${Date.now()}`,
                    customerName: "John Doe",
                    accountType: "Premium",
                    netRevenue: Math.floor(Math.random() * 100000),
                    cibilScore: Math.floor(Math.random() * 300) + 600,
                    queryType: "Critical",
                    totalTransactions: Math.floor(Math.random() * 200),
                    description: issueSummary,
                    timestamp: new Date().toISOString(),
                    status: "New",
                };

                await collection.insertOne(document);
                console.log("✅ Data Inserted Successfully");
            } catch (error) {
                console.error("❌ Failed to insert data:", error);
            } finally {
                await client.close();
            }
        };

        insertData();
    }, [issueSummary]);

    return null;
};

export default InsertIssue;

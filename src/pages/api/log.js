import connectDB from '../../lib/db';
import ThreatLog from '../../models/Threat';

export default async function handler(req, res) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    try {
        await connectDB();
        const logs = await ThreatLog.find().sort({ timestamp: -1 }).limit(10);
        res.status(200).json({ logs });
    } catch (error) {
        console.error("Error fetching logs:", error);
        res.status(500).json({ error: error.message });
    }
}

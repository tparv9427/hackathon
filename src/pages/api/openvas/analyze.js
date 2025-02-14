analyze.jsimport Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { scanData } = req.body; // Scan results from OpenVAS

    if (!scanData) {
        return res.status(400).json({ error: 'Scan data is required' });
    }

    try {
        const prompt = `
        You are an AI cybersecurity expert analyzing OpenVAS scan reports.

        ### Task:
        1. Analyze vulnerabilities in the input data.
        2. Predict **threat levels (1-4)**:
           - **Level 1**: Low-risk vulnerabilities.
           - **Level 2**: Medium-risk threats requiring monitoring.
           - **Level 3**: High-risk threats requiring immediate action.
           - **Level 4**: Critical threats requiring firewall intervention.
        3. Suggest **mitigation strategies**.

        ### Input Data:
        ${JSON.stringify(scanData, null, 2)}

        ### Output:
        - Identified threats
        - Predicted threat levels
        - Recommended security actions
        `;

        const response = await groq.chat.completions.create({
            model: process.env.MODEL_NAME,
            messages: [{ role: 'user', content: prompt }],
        });

        res.status(200).json({ analysis: response.choices[0]?.message?.content || 'No response received' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

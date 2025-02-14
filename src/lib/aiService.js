// import Groq from 'groq-sdk';

// // Initialize the Groq client
// const groq = new Groq({
//   apiKey: process.env.GROQ_API_KEY,
// });

// export const detectThreats = async (data) => {
//   try {
//     // Format the input data for analysis
//     const prompt = `
//     You are an advanced cybersecurity AI developed By TechWithJoshi. Your role is tasked with detecting and preventing potential cybersecurity threats.

//     ### Task:
//     1. Analyze the provided data for unusual patterns, anomalies, or suspicious behaviors.
//     2. Classify potential threats into categories such as:
//        - Intrusion attempts (e.g., unauthorized access, brute force attacks)
//        - Malware detection (e.g., ransomware, viruses)
//        - Insider threats (e.g., anomalous behavior by authorized users)
//        - Network anomalies (e.g., unusual traffic patterns, DDoS attacks)
//     3. Provide detailed explanations for detected threats and suggest mitigation strategies.

//     ### Input Data:
//     {
//       "networkTrafficLogs": ${JSON.stringify(data, null, 2)},
//       "userBehaviorLogs": ${JSON.stringify(data, null, 2)}
//     }

//     ### Output:
//     1. Identify anomalies or suspicious behavior based on the input data.
//     2. Explain why the detected patterns are considered threats.
//     3. Suggest specific actions to mitigate these threats.
//     `;

//     // Call the Groq API to detect threats
//     const response = await groq.chat.completions.create({
//       model: process.env.MODEL_NAME,
//       messages: [
//         {
//           role: 'user',
//           content: prompt,
//         },
//       ],
//     });

//     // Return the detected threats
//     return response.choices[0]?.message?.content || 'No response text received';
//   } catch (error) {
//     console.error('Error detecting threats:', error.message || error);
//     throw error;
//   }
// };




import Groq from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const detectThreats = async (data) => {
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
        ${JSON.stringify(data, null, 2)}

        ### Output:
        - Identified threats
        - Predicted threat levels
        - Recommended security actions
        `;

        const response = await groq.chat.completions.create({
            model: process.env.MODEL_NAME,
            messages: [{ role: 'user', content: prompt }],
        });

        return response.choices[0]?.message?.content || 'No response received';
    } catch (error) {
        console.error('Error detecting threats:', error.message || error);
        throw error;
    }
};

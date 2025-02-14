import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { targetId } = req.body; // Target ID from OpenVAS

    if (!targetId) {
        return res.status(400).json({ error: 'Target ID is required' });
    }

    try {
        const scanCommand = `
            runuser -u _gvm -- gvm-cli socket --xml "
            <create_task>
                <name>Security Scan</name>
                <comment>Automated scan via API</comment>
                <config id='daba56c8-73ec-11df-a475-002264764cea'/>
                <target id='${targetId}'/>
            </create_task>
            "
        `;
        const { stdout } = await execPromise(scanCommand);
        res.status(200).json({ message: 'Scan started', response: stdout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


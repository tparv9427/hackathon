import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { taskId } = req.body; // OpenVAS scan task ID

    if (!taskId) {
        return res.status(400).json({ error: 'Task ID is required' });
    }

    try {
        const resultCommand = `runuser -u _gvm -- gvm-cli socket --xml "<get_reports task_id='${taskId}' details='1'/>"`;
        const { stdout } = await execPromise(resultCommand);
        res.status(200).json({ report: stdout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

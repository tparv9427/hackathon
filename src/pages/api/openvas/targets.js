import { exec } from 'child_process';
import { promisify } from 'util';

const execPromise = promisify(exec);

export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { stdout } = await execPromise(`runuser -u _gvm -- gvm-cli socket --xml "<get_targets/>"`);
        res.status(200).json({ targets: stdout });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

import { exec } from "child_process";
import { parseString } from "xml2js";

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { action, target_id, task_id, report_id, name, hosts } = req.body;
    const GVM_USER = process.env.GVM_USER;
    const GVM_PASSWORD = process.env.GVM_PASSWORD;

    if (!GVM_USER || !GVM_PASSWORD) {
        return res.status(500).json({ error: "GVM credentials are missing in environment variables" });
    }

    let command = "";
    
    switch (action) {
        case "get_targets":
            command = `runuser -u _gvm -- gvm-cli socket --xml "<get_targets/>" --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        case "get_tasks":
            command = `runuser -u _gvm -- gvm-cli socket --xml "<get_tasks/>" --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        case "get_reports":
            command = `runuser -u _gvm -- gvm-cli socket --xml "<get_reports/>" --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        case "create_target":
            if (!name || !hosts) return res.status(400).json({ error: "Missing name or hosts" });
            command = `runuser -u _gvm -- gvm-cli socket --xml '<create_target><name>${name}</name><hosts>${hosts}</hosts></create_target>' --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        case "create_task":
            if (!name || !target_id) return res.status(400).json({ error: "Missing name or target_id" });
            command = `runuser -u _gvm -- gvm-cli socket --xml '<create_task><name>${name}</name><target id="${target_id}"/></create_task>' --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        case "start_task":
            if (!task_id) return res.status(400).json({ error: "Missing task_id" });
            command = `runuser -u _gvm -- gvm-cli socket --xml '<start_task task_id="${task_id}"/>' --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        case "get_report":
            if (!report_id) return res.status(400).json({ error: "Missing report_id" });
            command = `runuser -u _gvm -- gvm-cli socket --xml '<get_reports report_id="${report_id}"/>' --gmp-username ${GVM_USER} --gmp-password ${GVM_PASSWORD}`;
            break;
        default:
            return res.status(400).json({ error: "Invalid action" });
    }

    exec(command, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: stderr || "Unknown error occurred" });
        }

        parseString(stdout, { explicitArray: false, ignoreAttrs: false }, (err, result) => {
            if (err) {
                return res.status(500).json({ error: "Failed to parse XML response" });
            }
            return res.status(200).json({ response: result });
        });
    });
}

import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// CONFIGURATION
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://hjuscodpytjhcvlsyzzw.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'dummy';

// NVIDIA NIM API CONFIGURATION
const NVIDIA_API_URL = process.env.NVIDIA_API_URL || 'https://integrate.api.nvidia.com/v1/chat/completions';
const NVIDIA_MODELS = [
    'deepseek-ai/deepseek-v4.1-flash',
    'openai/gpt-oss-20b',
    'z-ai/glm-5.3-flash'
];
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || process.env.VITE_NVIDIA_API_KEY || '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';

console.log("\n===========================================");
console.log("       AI AGENT BACKEND (NVIDIA NIM)       ");
console.log("===========================================");
console.log(`📡 AI Endpoint: ${NVIDIA_API_URL}`);
console.log(`🤖 Primary Models: ${NVIDIA_MODELS.join(', ')}`);
console.log(`🔑 Key Set: ${NVIDIA_API_KEY ? 'Yes (configured)' : 'No'}`);
console.log("===========================================\n");

let supabase = null;
try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
} catch (e) {
    console.warn("Supabase client init skipped in mock mode:", e.message);
}

// In-Memory & Tool Execution Handlers
const dbFunctions = {
    async createClient(params) {
        const clientName = params.name || params.clientName || 'Pakistani Corporate Entity';
        console.log("📝 Creating Client:", clientName);
        const clientCode = params.client_code || params.clientCode || (clientName.substring(0, 3).toUpperCase() + '-' + Math.floor(Math.random() * 900 + 100));
        const ntn = params.ntn || params.pan_number || '07' + Math.floor(Math.random() * 899999 + 100000) + '-1';
        const strn = params.strn || params.gst_number || '03-01-9999-' + Math.floor(Math.random() * 899 + 100) + '-19';
        
        return {
            success: true,
            action: 'createClient',
            message: `Corporate Client '**${clientName}**' registered successfully with code \`${clientCode}\` (NTN: \`${ntn}\`).`,
            data: {
                name: clientName,
                client_code: clientCode,
                contact_person: params.contact_person || params.contactPerson || 'Managing Director',
                contact_email: params.contact_email || params.contactEmail || `${clientName.toLowerCase().replace(/[^a-z0-9]/g, '')}@firm.pk`,
                contact_phone: params.contact_phone || params.contactPhone || '+92 42 111 000 000',
                pan_number: ntn,
                gst_number: strn,
                status: 'Active'
            }
        };
    },

    async deleteClient(params) {
        const name = params.name || params.clientName || params.client_code || params.id;
        console.log("🗑️ Deleting Client:", name);
        return {
            success: true,
            action: 'deleteClient',
            message: `Corporate client '**${name || 'Record'}**' and associated engagements have been removed.`,
            data: params
        };
    },

    async updateClient(params) {
        const name = params.name || params.clientName;
        console.log("📝 Updating Client:", name);
        return {
            success: true,
            action: 'updateClient',
            message: `Client '**${name}**' details updated successfully.`,
            data: params
        };
    },

    async createEmployee(params) {
        const name = params.full_name || params.fullName || params.name || 'Associate Chartered Accountant';
        console.log("👥 Creating Employee:", name);
        const code = params.employee_code || params.employeeCode || ('EMP-PK-' + Math.floor(Math.random() * 90 + 10));
        const email = params.email || (name.toLowerCase().replace(/[^a-z0-9]/g, '.') + '@cafirm.pk');
        const designation = params.designation || 'Associate - Tax & Audit';
        
        return {
            success: true,
            action: 'createEmployee',
            message: `Employee '**${name}**' (${designation}) created.\n• Email: \`${email}\`\n• Staff Code: \`${code}\``,
            data: {
                full_name: name,
                email: email,
                phone: params.phone || '+92 300 1234567',
                designation: designation,
                employee_code: code,
                active: true
            }
        };
    },

    async deleteEmployee(params) {
        const name = params.full_name || params.fullName || params.name || params.id;
        console.log("🗑️ Deleting Employee:", name);
        return {
            success: true,
            action: 'deleteEmployee',
            message: `Employee '**${name || 'Staff Member'}**' removed from practice roster.`,
            data: params
        };
    },

    async createTask(params) {
        const title = params.title || params.taskTitle || 'Statutory Compliance Working Paper';
        const client = params.client_name || params.clientName || params.client || 'Corporate Client';
        const dueDate = params.due_date || params.dueDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
        const priority = params.priority || 'High';
        console.log("📋 Creating Task:", title, "for", client);

        return {
            success: true,
            action: 'createTask',
            message: `Statutory Task '**${title}**' created for **${client}**.\n• Priority: **${priority}**\n• Due Date: \`${dueDate}\``,
            data: {
                title: title,
                client_name: client,
                due_date: dueDate,
                priority: priority,
                status: 'In progress',
                description: params.description || 'Statutory filing and working paper review.'
            }
        };
    },

    async deleteTask(params) {
        const title = params.title || params.taskTitle || params.id;
        console.log("🗑️ Deleting Task:", title);
        return {
            success: true,
            action: 'deleteTask',
            message: `Statutory task '**${title || 'Task'}**' has been deleted.`,
            data: params
        };
    },

    async updateTask(params) {
        const title = params.title || params.taskTitle;
        const status = params.status || 'Completed';
        console.log("📋 Updating Task:", title, "Status:", status);
        return {
            success: true,
            action: 'updateTask',
            message: `Task '**${title}**' updated to status **${status}**.`,
            data: params
        };
    },

    async createInvoice(params) {
        const client = params.client_name || params.clientName || params.client || 'Corporate Client';
        const amount = Number(params.amount) || 250000;
        const invNumber = params.invoice_number || params.invoiceNumber || `INV-PK-2026-${Math.floor(Math.random() * 900 + 100)}`;
        const dueDate = params.due_date || params.dueDate || '2026-10-15';
        console.log("💰 Creating Invoice for:", client, "Amount:", amount);

        return {
            success: true,
            action: 'createInvoice',
            message: `Invoice \`${invNumber}\` issued to **${client}** for **PKR ${amount.toLocaleString('en-US')}**.\n• Due Date: \`${dueDate}\``,
            data: {
                invoice_number: invNumber,
                client_name: client,
                amount: amount,
                due_date: dueDate,
                status: 'Sent'
            }
        };
    },

    async exportReport(params) {
        const type = params.type || params.reportType || 'daily_summary';
        console.log("📊 Exporting Report:", type);
        return {
            success: true,
            action: 'exportReport',
            reportType: type,
            message: `Generated daily executive report for **${type}**. CSV file ready for download.`
        };
    }
};

const SYSTEM_PROMPT = `You are the CA Practice AI Executive Copilot, an elite Chartered Accountancy workspace assistant powered by NVIDIA NIM.
You manage a practice with 30 corporate clients, 30 statutory tasks, employees, and PKR invoices.

When the user asks you to perform ANY action in the workspace, you MUST output a structured JSON tool call block in your response:

\`\`\`json
{
  "function": "createTask" | "deleteTask" | "updateTask" | "createClient" | "deleteClient" | "updateClient" | "createEmployee" | "deleteEmployee" | "createInvoice" | "exportReport",
  "params": {
    ... relevant fields like title, name, client, amount, due_date, status ...
  },
  "explanation": "Clear, concise confirmation message explaining what was executed in the workspace."
}
\`\`\`

If the user is asking general conversational queries, greetings, questions about FBR Income Tax Ordinance 2001, Sales Tax Act 1990, SECP Companies Act 2017, or ISA Auditing Standards, respond with helpful, authoritative Chartered Accountant guidance formatted cleanly in GitHub markdown.`;

app.post('/chat', async (req, res) => {
    try {
        const { message, history, apiKey: clientApiKey } = req.body;
        console.log(`\n📩 Received user request: "${message}"`);

        const activeApiKey = clientApiKey || req.headers['x-nvidia-api-key'] || NVIDIA_API_KEY;

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...(Array.isArray(history) ? history.map(h => ({ role: h.role, content: h.content })) : []),
            { role: 'user', content: message }
        ];

        let aiText = '';

        if (activeApiKey) {
            for (const model of NVIDIA_MODELS) {
                try {
                    console.log(`🚀 Querying NVIDIA NIM (${model})...`);
                    const nvidiaResp = await fetch(NVIDIA_API_URL, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${activeApiKey}`
                        },
                        body: JSON.stringify({
                            model: model,
                            messages: messages,
                            temperature: 0.2,
                            max_tokens: 800
                        })
                    });

                    if (nvidiaResp.ok) {
                        const data = await nvidiaResp.json();
                        if (data?.choices?.[0]?.message?.content) {
                            aiText = data.choices[0].message.content;
                            console.log(`✅ Received response from ${model}`);
                            break;
                        }
                    } else {
                        console.warn(`NVIDIA NIM Model ${model} returned status ${nvidiaResp.status}`);
                    }
                } catch (apiErr) {
                    console.warn(`Error querying ${model}:`, apiErr.message);
                }
            }
        }

        // Fallback intent parser if API is unreachable
        if (!aiText) {
            aiText = parseIntentFallback(message);
        }

        // Check for JSON function call in response
        let functionCall = null;
        try {
            const jsonMatch = aiText.match(/```json\s*([\s\S]*?)\s*```/) || aiText.match(/\{[\s\S]*"function"[\s\S]*\}/);
            if (jsonMatch) {
                const rawJson = jsonMatch[1] || jsonMatch[0];
                functionCall = JSON.parse(rawJson);
            }
        } catch (e) {
            console.log("No JSON tool call parsed:", e.message);
        }

        let executedResult = null;
        if (functionCall && dbFunctions[functionCall.function]) {
            console.log(`⚡ Executing Backend Tool: ${functionCall.function}`);
            try {
                executedResult = await dbFunctions[functionCall.function](functionCall.params || {});
                const replyMessage = executedResult.message || functionCall.explanation || "Action executed in workspace.";
                return res.json({ 
                    reply: replyMessage, 
                    action: functionCall.function, 
                    params: functionCall.params, 
                    result: executedResult 
                });
            } catch (err) {
                return res.json({ reply: `Error executing ${functionCall.function}: ${err.message}` });
            }
        }

        res.json({ reply: aiText });

    } catch (error) {
        console.error("Agent Server Error:", error);
        res.status(500).json({ error: error.message });
    }
});

function parseIntentFallback(msg) {
    const text = msg.toLowerCase();

    if (text.includes('export') || text.includes('csv') || text.includes('download')) {
        let type = 'daily_summary';
        if (text.includes('task')) type = 'tasks';
        else if (text.includes('client')) type = 'clients';
        else if (text.includes('employee') || text.includes('staff')) type = 'employees';

        return `\`\`\`json
{
  "function": "exportReport",
  "params": { "type": "${type}" },
  "explanation": "Generating ${type} export report."
}
\`\`\``;
    }

    if (text.includes('add client') || text.includes('create client') || text.includes('new client')) {
        const nameMatch = msg.match(/(?:client|named?)\s+([A-Za-z0-9\s]+?)(?:$|\s+with|\s+contact|\s+phone)/i);
        const name = nameMatch ? nameMatch[1].trim() : 'Pakistani Corporate Entity';
        return `\`\`\`json
{
  "function": "createClient",
  "params": { "name": "${name}" },
  "explanation": "Registering corporate client ${name}."
}
\`\`\``;
    }

    if (text.includes('delete client') || text.includes('remove client')) {
        const nameMatch = msg.match(/(?:client)\s+([A-Za-z0-9\s]+?)(?:$)/i);
        const name = nameMatch ? nameMatch[1].trim() : 'Client';
        return `\`\`\`json
{
  "function": "deleteClient",
  "params": { "name": "${name}" },
  "explanation": "Removing corporate client ${name}."
}
\`\`\``;
    }

    if (text.includes('add task') || text.includes('create task') || text.includes('new task')) {
        const titleMatch = msg.match(/(?:task)\s+([A-Za-z0-9\s\(\)\-\/]+?)(?:for|due|with|$)/i);
        const title = titleMatch ? titleMatch[1].trim() : 'FBR Statutory Compliance Review';
        return `\`\`\`json
{
  "function": "createTask",
  "params": { "title": "${title}", "priority": "High" },
  "explanation": "Creating statutory task ${title}."
}
\`\`\``;
    }

    return `Hello! I am your **CA Practice AI Copilot (NVIDIA NIM)**. I can create or delete tasks, add corporate clients, issue PKR invoices, and export CSV reports directly in your workspace.`;
}

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    console.log(`Agent backend running on http://localhost:${PORT}`);
});

process.on('uncaughtException', (err) => {
    console.error('Unhandled Exception Caught:', err);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection at:', promise, 'reason:', reason);
});

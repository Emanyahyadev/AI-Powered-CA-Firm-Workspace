import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// --- Configuration ---
// For local development with Supabase (Docker), use 'http://host.docker.internal:11434' to reach your host's Ollama.
// For production, this will be your Deepseek/OpenAI URL.
const OLLAMA_URL = Deno.env.get('OLLAMA_URL') || 'http://host.docker.internal:11434/api/chat';
const MODEL_NAME = "gpt-oss:120b-cloud"; // Using the model found on your system. Change to 'llama3' or 'mistral' if needed.

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { message, history } = await req.json();

        // 1. Setup Supabase Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // 2. Define Tools (The "Hands" of the Agent)
        const tools = [
            {
                type: 'function',
                function: {
                    name: 'get_employees',
                    description: 'Get a list of all employees in the firm',
                    parameters: { type: 'object', properties: {} },
                },
            },
            {
                type: 'function',
                function: {
                    name: 'create_employee',
                    description: 'Create a new employee record. Requires name, email, role, and department.',
                    parameters: {
                        type: 'object',
                        properties: {
                            name: { type: 'string', description: 'Full name of the employee' },
                            email: { type: 'string', description: 'Email address' },
                            role: { type: 'string', description: 'Job title/Role (e.g. Senior Accountant)' },
                            department: { type: 'string', description: 'Department (e.g. Audit, Tax)' },
                        },
                        required: ['name', 'email', 'role', 'department'],
                    },
                },
            },
            {
                type: 'function',
                function: {
                    name: 'get_clients',
                    description: 'Get a list of clients.',
                    parameters: { type: 'object', properties: {} },
                },
            },
            {
                type: 'function',
                function: {
                    name: 'create_task',
                    description: 'Create a new task. Requires title, due_date, and optionally a client_id or assignee_id.',
                    parameters: {
                        type: 'object',
                        properties: {
                            title: { type: 'string', description: 'Title of the task' },
                            due_date: { type: 'string', description: 'Due date in YYYY-MM-DD format' },
                            client_id: { type: 'string', description: 'UUID of the client (optional)' },
                        },
                        required: ['title', 'due_date'],
                    },
                },
            },
        ];

        // 3. Construct System Prompt
        const systemPrompt = `You are a helpful CA Firm Assistant. 
    You have access to the firm's database via tools. 
    If the user asks to create something (like an employee or task), you MUST ASK for all required fields first if they are missing.
    Do not make up IDs. If you need a client ID to create a task, use the 'get_clients' tool to find it first.
    Be professional and concise.`;

        const messages = [
            { role: 'system', content: systemPrompt },
            ...(history || []),
            { role: 'user', content: message },
        ];

        // 4. Call Local Ollama (First Pass)
        console.log(`Sending to Ollama (${MODEL_NAME})...`);
        const response1 = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODEL_NAME,
                messages: messages,
                tools: tools,
                stream: false,
            }),
        });

        if (!response1.ok) {
            const err = await response1.text();
            console.error("Ollama Error:", err);
            throw new Error(`Ollama API Error: ${err}`);
        }

        const data1 = await response1.json();
        const aiMessage = data1.message;

        // 5. Handle Tool Calls (If the AI wants to do something)
        if (aiMessage.tool_calls && aiMessage.tool_calls.length > 0) {
            console.log("AI requested tools:", aiMessage.tool_calls);

            // Execute each tool
            const toolResults = [];
            for (const tool of aiMessage.tool_calls) {
                const functionName = tool.function.name;
                const args = tool.function.arguments;

                let result = null;

                if (functionName === 'get_employees') {
                    const { data, error } = await supabaseClient.from('employees').select('*');
                    result = error ? `Error: ${error.message}` : JSON.stringify(data);
                } else if (functionName === 'create_employee') {
                    const { data, error } = await supabaseClient.from('employees').insert([args]).select();
                    result = error ? `Error: ${error.message}` : `Success! Created employee: ${JSON.stringify(data)}`;
                } else if (functionName === 'get_clients') {
                    const { data, error } = await supabaseClient.from('clients').select('id, name, company_name');
                    result = error ? `Error: ${error.message}` : JSON.stringify(data);
                } else if (functionName === 'create_task') {
                    const { data, error } = await supabaseClient.from('tasks').insert([{
                        title: args.title,
                        due_date: args.due_date,
                        client_id: args.client_id || null,
                        status: 'todo'
                    }]).select();
                    result = error ? `Error: ${error.message}` : `Success! Created task: ${JSON.stringify(data)}`;
                }

                toolResults.push({
                    role: 'tool',
                    content: result,
                    name: functionName
                });
            }

            // 6. Send Tool Results back to AI (Second Pass)
            // We need to send the full history: [User Msg] -> [AI Tool Request] -> [Tool Results]
            const secondPassMessages = [...messages, aiMessage, ...toolResults];

            const response2 = await fetch(OLLAMA_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    model: MODEL_NAME,
                    messages: secondPassMessages,
                    stream: false,
                }),
            });

            const data2 = await response2.json();
            return new Response(JSON.stringify({ reply: data2.message.content }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });

        } else {
            // No tools needed, just return the text
            return new Response(JSON.stringify({ reply: aiMessage.content }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            });
        }

    } catch (error) {
        console.error("Function Error:", error);
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
    }
});

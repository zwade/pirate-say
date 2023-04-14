import fetch from "node-fetch";

export type Role = "system" | "user" | "assistant";
export type Message = { role: Role; content: string };

export type GptResponse = {
    id: string;
    object: "chat.completion";
    created: number;
    model: string;
    usage: {
        prompt_tokens: string;
        completion_tokens: string;
        total_tokens: string;
    };
    choices: {
        message: {
            role: Role;
            content: string;
        };
        finish_reason: string;
        index: string;
    }[];
};

export class ConversationManager {
    private messages: Message[] = [];
    private bearerToken: string;

    public constructor(token: string) {
        this.bearerToken = token;
    }

    public writeMessage(role: Role, content: string) {
        this.messages.push({ role, content });
    }

    public async flushMessages() {
        const result = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.bearerToken}`,
            },
            body: JSON.stringify({
                model: "gpt-3.5-turbo",
                messages: this.messages,
            }),
        });

        if (!result.ok) {
            console.warn(`Failed to flush messages: ${await result.text()}`);
            return undefined;
        }

        const response = (await result.json()) as GptResponse;
        this.messages.push(response.choices[0].message);

        return response.choices[0].message.content;
    }
}

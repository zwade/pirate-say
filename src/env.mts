import { config as dotEnvConfig } from "dotenv";

const env = dotEnvConfig();

const _config = {
    discordToken: env.parsed?.DISCORD_TOKEN,
    clientId: env.parsed?.CLIENT_ID,
    openAiToken: env.parsed?.OPENAI_TOKEN,
}

const checkAll = <T extends Record<string, string | undefined>>(c: T) => {
    for (const key of Object.keys(c)) {
        if (c[key] === undefined) {
            throw new Error(`Missing environment variable: ${key}`);
        }
    }

    return c as { [K in keyof T]-?: NonNullable<T[K]> };
};

export const config = checkAll(_config);

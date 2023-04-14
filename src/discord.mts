import { REST, Client, GatewayIntentBits } from "discord.js";
import { config } from "./env.mjs";

export const DiscordRest = new REST({ version: "10" }).setToken(config.discordToken);

const _DiscordClient = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages] });
_DiscordClient.login(config.discordToken);

export const DiscordClient = await new Promise<Client<true>>((resolve) => _DiscordClient.on("ready", (client) => resolve(client)));

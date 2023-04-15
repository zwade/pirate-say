import { Routes, SlashCommandBuilder } from "discord.js"
import { getAllGuilds } from "./actions.mjs"
import { DiscordRest } from "./discord.mjs"
import { config } from "./env.mjs"

const commands = [
    new SlashCommandBuilder()
        .setName("pirate-say")
        .setDescription("Talk like a pirate!")
        .addStringOption((option) =>
            option
                .setName("message")
                .setDescription("The message to say")
                .setRequired(true)
        ),

    new SlashCommandBuilder()
        .setName("flag")
        .setDescription("Flag")
];

export const EstablishSlashCommands = async () => {
    const guilds = await getAllGuilds();
    const guildIds = guilds.map((guild) => guild.id);

    for (const guildId of guildIds) {
        await DiscordRest.put(Routes.applicationGuildCommands(config.clientId, guildId), { body: commands });
    }
}
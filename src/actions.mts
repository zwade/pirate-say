import { ApplicationCommandType } from "discord.js"
import { DiscordClient } from "./discord.mjs"
import { PirateSay } from "./pirate-say.mjs"
import { CheckRateLimit } from "./rate-limit.mjs"

export const getAllGuilds = async () => {
    const guilds = await DiscordClient.guilds.fetch()
    return [...guilds.values()]
}

export const ListenForCommands = () => {
    DiscordClient.on("interactionCreate", async (interaction) => {
        if (!interaction.isCommand()) return

        const { commandName } = interaction

        if (commandName === "pirate-say" && interaction.commandType === ApplicationCommandType.ChatInput) {
            const message = interaction.options.getString("message")

            if (!message) {
                interaction.reply({ content: "Avast Matey! Ye haven't sent anything", ephemeral: true });
                console.log(`User: ${interaction.user.username} tried to send an empty message`);
                return;
            }

            if (message.length > 200) {
                interaction.reply({ content: "Avast Matey! Ye have far too much to say", ephemeral: true });
                console.log(`User: ${interaction.user.username} tried to send a message that was too long: ${message}`);
                return;
            }

            const rateLimitSuccess = await CheckRateLimit(interaction.user.id, message);
            if (!rateLimitSuccess) {
                interaction.reply({ content: "Avast Matey! Ye be talkin' too much", ephemeral: true });
                console.log(`User: ${interaction.user.username} tried to send a message but hit the rate limit: ${message}`);
                return;
            }

            const pirateSay = await PirateSay(message);
            if (!pirateSay) {
                interaction.reply({ content: "Avast Matey! Something be amiss", ephemeral: true });
                console.log(`User: ${interaction.user.username} tried to send a message but something went wrong: ${message}`);
                return;
            }

            if (pirateSay.toLowerCase().startsWith("avast matey")) {
                interaction.reply({ content: pirateSay, ephemeral: true });
                console.log(`User: ${interaction.user.username} tried to send a message that was inappropriate: ${message}`);
                return;
            }

            interaction.reply(pirateSay);
            console.log(`User: ${interaction.user.username} sent a message: ${message}\nResponse: ${pirateSay}`);
        }
    })
}
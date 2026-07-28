require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});

const queue = new Map();

let queueMessage;

function createEmbed() {
  const players = [...queue.values()];

  return new EmbedBuilder()
    .setColor("#ff0055")
    .setTitle("⚽ VVLL Friendly Queue")
    .setDescription(
      `🟢 **Ready Players: ${players.length}**\n\n` +
      (players.length
        ? players.map(p => `• <@${p}>`).join("\n")
        : "No players are ready yet.")
    )
    .addFields({
      name: "⏰ Timer",
      value: "Players stay available for **2 hours** after joining."
    })
    .setFooter({
      text: "VVLL Friendly System"
    });
}

function buttons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId("join")
      .setLabel("🟢 Join Queue")
      .setStyle(ButtonStyle.Success),

    new ButtonBuilder()
      .setCustomId("leave")
      .setLabel("🔴 Leave Queue")
      .setStyle(ButtonStyle.Danger)
  );
}

client.once("ready", async () => {
  console.log(`✅ Online as ${client.user.tag}`);

  // Change this to the channel ID where you want the embed
  const channel = await client.channels.fetch("CHANNEL_ID_HERE");

  queueMessage = await channel.send({
    embeds: [createEmbed()],
    components: [buttons()]
  });
});

client.on("interactionCreate", async interaction => {
  if (!interaction.isButton()) return;

  const user = interaction.user.id;

  if (interaction.customId === "join") {
    queue.set(user, user);

    await interaction.reply({
      content: "✅ You joined the friendly queue!",
      ephemeral: true
    });
  }

  if (interaction.customId === "leave") {
    queue.delete(user);

    await interaction.reply({
      content: "❌ You left the friendly queue!",
      ephemeral: true
    });
  }

  if (queueMessage) {
    await queueMessage.edit({
      embeds: [createEmbed()],
      components: [buttons()]
    });
  }
});

client.login(process.env.TOKEN);
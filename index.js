require('dotenv').config()

// Set up client object
const { Client, Intents } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

// regex for matching broken android links
const linkRegex = /https:\/\/media\.discordapp\.net\/attachments\/\d{18}\/\d{18}\/.+\.(mp4|webm|mov)/g

client.once('ready', () => {
  console.log("Ready to fix some links");
})

client.on('messageCreate', async (msg) => {
  try {
    if (msg.author.bot) return;
    if (!msg.channel.permissionsFor(msg.guild.me).has("SEND_MESSAGES")) return;

    // Fix all the links in the message
    let links = [...msg.content.matchAll(linkRegex)];
    links = links.map(e => e[0]);
    links = links.map(e => e.replace('https://media.discordapp.net/', 'https://cdn.discordapp.com/'));

    if (links.length == 0) return;

    // Reply w/ mentions off w/ fixed links
    await msg.reply({
      content: `I fixed your links for you:\n${links.join('\n')}`,
      allowedMentions: { repliedUser: false },
    });

  } catch (e) {
    console.error(e);
  }
})

client.login(process.env.VIDEO_FIX_TOKEN)
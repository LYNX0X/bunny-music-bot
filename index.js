const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');
const play = require('play-dl');

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
});

const TOKEN = "MTQ4MDE0OTkwMzkyODg1NjYxOA.GLZzR-.6dAlU9ySHuj0borkpqfNWo4V1BtrUoD9hh0mRg";

client.once('ready', () => {
  console.log("🐰 Bunny (CB) is online!");
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "bunny") {

    const query = interaction.options.getString("song");
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.reply("Join a voice channel first!");
    }

    await interaction.reply(`🐰 Playing: ${query}`);

    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator
    });

    const result = await play.search(query, { limit: 1 });
    const stream = await play.stream(result[0].url);

    const resource = createAudioResource(stream.stream, { inputType: stream.type });

    const player = createAudioPlayer();

    connection.subscribe(player);

    player.play(resource);
  }
});

client.login(TOKEN);

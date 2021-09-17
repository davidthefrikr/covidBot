const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('deez')
		.setDescription('go on, use the command'),
		async execute(interaction){
			await interaction.reply('nuts');
		}
};

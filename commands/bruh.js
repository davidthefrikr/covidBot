const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bruh')
		.setDescription('브러 모멘트'),
		async execute(interaction){
			await interaction.reply('bruh moment');
		}
};

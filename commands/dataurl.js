const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dataurl')
		.setDescription('Shows you the link of where this data is being retrieved.'),
};

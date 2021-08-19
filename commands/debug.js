const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('debug')
		.setDescription('DEBUG:Sets the date back to 2021-08-15 to force post message in next 10 minutes'),
};
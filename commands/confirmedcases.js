const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confirmedcases')
		.setDescription('Reports to you the current amount of confirmed cases in LA.'),
};

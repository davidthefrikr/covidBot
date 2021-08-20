const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('dataurl')
		.setDescription('Shows you the link of where this data is being retrieved.'),
		async execute(interaction) {
			await interaction.reply('My [data](https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/latimes-county-totals.csv) is being retrieved from [here!](https://github.com/datadesk/california-coronavirus-data#latimes-county-totalscsv)');
		},
};

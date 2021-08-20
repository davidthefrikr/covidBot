const { SlashCommandBuilder } = require('@discordjs/builders');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('confirmedcases')
		.setDescription('Reports to you the current amount of confirmed cases in LA.'),
		/*temporarily stripped, need to figure out how to call covidDL from here
		async execute(interaction){
			covidDL();
			const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('COVID-19 Data')
			.setURL('http://publichealth.lacounty.gov/media/coronavirus/data/')
			.setAuthor('County of Los Angeles Public Health/Los Angeles Times')
			.setDescription('COVID-19 data provided by [the Los Angeles Times](https://github.com/datadesk/california-coronavirus-data#latimes-county-totalscsv) and is updated periodically')
			//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
			.addFields(
				{ name: 'As of', value: covidDate },
				{ name: '\u200B', value: '\u200B' },
				{ name: 'Confirmed Cases', value: covidConfirmed, inline: true },
				{ name: 'Confirmed Deaths', value: covidDeaths, inline: true },
				//{ name: 'New Confirmed Cases', value: covidNewConfirms, inline: true },
				//{ name: 'New Confirmed Deaths', value: covidNewDeaths, inline: true },
			)
			.addFields(
				{ name: '\u200B', value: '\u200B' },
				{ name: 'New Confirmed Cases', value: covidNewConfirms, inline: true },
				{ name: 'New Confirmed Deaths', value: covidNewDeaths, inline: true }
				)
			//.setImage('http://publichealth.lacounty.gov/media/coronavirus/images/graph-positivity.png')
			.setTimestamp()
			//.setFooter('Past 7 day average of reported positive COVID-19 tests, please note that images cache on Discord for up to an hour!');
				await interaction.reply({ embeds: [exampleEmbed] });
			// original text without embed, maybe use as a fallback command if user cannot see embeds later?
			//	await interaction.reply("There have been "+covidConfirmed+" confirmed cases and "+covidDeaths+" confirmed deaths from COVID-19 in "+covidCounty+ " County as of "+covidDate+"."+"\n"+"\n"+"There have been "+covidNewConfirms+" new cases reported and "+covidNewDeaths+" new deaths as of "+covidDate+".");
		}*/
};

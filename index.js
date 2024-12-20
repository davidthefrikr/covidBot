//stuff that's needed for bot to initialize
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, Message } = require('discord.js');
const { token } = require('./config.json');
const { covidReportChannel } = require('./config.json');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const request = require('request');


//setup bot + commands
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection();

const commands = [];
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

//bot client and guild ids here for faster development, change these out if we want to use the bot globally instead of just in one guild
const { clientId } = require('./config.json');
const { guildId } = require('./config.json');

//look in folder for commands and get them ready
for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: '9' }).setToken(token);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationGuildCommands(clientId, guildId),
			{ body: commands },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();

//download covid data
const covidinfo_URL = ('https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/latimes-county-totals.csv');
const csvFilePath = ('./covid_data.csv');
var covidData;
var covidDataLA;
var covidDateCurrent;
var covidConfirmedCurrent;

var covidDate;
var covidCounty;
//var covidFips;
var covidConfirmed;
var covidDeaths;
var covidNewConfirms;
var covidNewDeaths;

//function parses csv for los angeles county data and puts it into an array
function csvtoVar(){
    covidData = fs.readFileSync(csvFilePath)
    .toString() // convert Buffer to string
    .split('\n') // split string to lines
    .map(e => e.trim()) // remove white spaces for each line
    .map(e => e.split(',').map(e => e.trim())); // split each line to array

    covidDataLA = covidData[19];
    console.log(covidDataLA);

    covidDate = covidDataLA[0]
    covidCounty = covidDataLA[1]
    //covidFips = covidDataLA[2]
    covidConfirmed = covidDataLA[3]
    covidDeaths = covidDataLA[4]
    covidNewConfirms = covidDataLA[5]
    covidNewDeaths = covidDataLA[6]

    //console.log("There have been "+covidConfirmed+" confirmed cases of COVID-19 in "+covidCounty+ " as of "+covidDate+".");
    //console.log(covidData); debug console output
}

function covidDL(){
    console.log("Starting dataset download!");
    request(covidinfo_URL).pipe(fs.createWriteStream('covid_data.csv'));
    csvtoVar();
};

function sendHourlyReport(){
		const guild = client.guilds.cache.get(guildId);
		const channel = client.channels.cache.get(covidReportChannel);
		console.log(covidReportChannel+" is the channel ID");
		if (guild && channel) {
		/*client.channels.cache.get(covidReportChannel).send("There have been "+covidConfirmed+" confirmed cases and "+covidDeaths+" confirmed deaths from COVID-19 in "+covidCounty+ " County as of "+covidDate+"."+"\n"+"\n"+"There have been "+covidNewConfirms+" new cases reported and "+covidNewDeaths+" new deaths as of "+covidDate+".");
		deprecated code because hourly report always sends as embed now, use only if embeds somehow break*/
		const covidEmbed = new MessageEmbed()
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
		client.channels.cache.get(covidReportChannel).send({ embeds: [covidEmbed] });
		}
}
function hourlyCOVIDReport(){
    covidDL();
	console.log("covidDateCurrent: "+covidDateCurrent);
	console.log("covidDate: "+covidDate);
	console.log("covidConfirmed: "+covidConfirmed);
	if (covidConfirmedCurrent != covidDataLA[3] || covidDateCurrent != covidDataLA[0]){
		sendHourlyReport();
		console.log("updating covid data and sending message to server!");
		covidConfirmedCurrent = covidDataLA[3]
		covidDateCurrent = covidDataLA[0]
		console.log("covidDateCurrent: "+covidDateCurrent);
		console.log("covidDate: "+covidDate);
		console.log("covidConfirmed: "+covidConfirmed);
	}
	//if (message.channel.type === 'news') crosspost(message); 
	//try to crosspost it over to another server, looks like there's other code to do that, need to look at https://discordjs.guide/additional-info/changes-in-v13.html#messagemanager-crosspost
}

//commands
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'ping') {
		await interaction.reply('pong');
	}
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'debug') {
		console.log("original covidDateCurrent: "+covidDateCurrent)
		//covidDateCurrent=("2021-08-15");
		await interaction.reply('Set time to 2021-08-15!');
		console.log("covidDateCurrent set to "+covidDateCurrent);
	}
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'bruh') {
		await interaction.reply('브러 moment');
	}
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'dataurl') {
		await interaction.reply('My [data](https://raw.githubusercontent.com/datadesk/california-coronavirus-data/master/latimes-county-totals.csv) is being retrieved from [here!](https://github.com/datadesk/california-coronavirus-data#latimes-county-totalscsv)');
	}
});
client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === 'confirmedcases') {
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
		/* original text without embed, maybe use as a fallback command if user cannot see embeds later?
			await interaction.reply("There have been "+covidConfirmed+" confirmed cases and "+covidDeaths+" confirmed deaths from COVID-19 in "+covidCounty+ " County as of "+covidDate+"."+"\n"+"\n"+"There have been "+covidNewConfirms+" new cases reported and "+covidNewDeaths+" new deaths as of "+covidDate+".");
		*/
	}
});

//when all that done, put ready into terminal and set bot status
client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity('cases rise', { type: 'WATCHING' });
});


//login with bot token
client.login(token);


//have it scan every 10 minutes for new data via cron
var CronJob = require('cron').CronJob;
var job = new CronJob('*/10 * * * *', function() {
	hourlyCOVIDReport();
}, null, true, 'America/Los_Angeles');
job.start();
hourlyCOVIDReport();

//shit that's needed for code to game
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

//bot client and guild ids here for development
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

var covidDate;
var covidCounty;
//var covidFips;
var covidConfirmed;
var covidDeaths;
var covidNewConfirms;
var covidNewDeaths;

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
    //console.log(covidData);
   // console.log(JSON.stringify(data, '', 2)); // as json
}

function covidDL(){
    //fetch(covidinfo_URL).then(covid => covid.text());
    console.log("Starting dataset download!");
    request(covidinfo_URL).pipe(fs.createWriteStream('covid_data.csv'));
    csvtoVar();
};
//setInterval(function () { covidDL(); }, 3600*1000); // seconds * milliseconds, in this case every hour since the bot starts it auto updates

function sendHourlyReport(){
		const guild = client.guilds.cache.get(guildId);
		const channel = client.channels.cache.get(covidReportChannel);
		console.log(covidReportChannel+" is the channel ID");
		if (guild && channel) {
		client.channels.cache.get(covidReportChannel).send("There have been "+covidConfirmed+" confirmed cases and "+covidDeaths+" confirmed deaths from COVID-19 in "+covidCounty+ " as of "+covidDate+"."+"\n"+"\n"+"There have been "+covidNewConfirms+" new cases reported and "+covidNewDeaths+" new deaths as of "+covidDate+".");
		}
}
function hourlyCOVIDReport(){
    covidDL();
	sendHourlyReport();
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
		await interaction.reply("There have been "+covidConfirmed+" confirmed cases and "+covidDeaths+" confirmed deaths from COVID-19 in "+covidCounty+ " as of "+covidDate+"."+"\n"+"\n"+"There have been "+covidNewConfirms+" new cases reported and "+covidNewDeaths+" new deaths as of "+covidDate+".");
	}
});

//when all that shit done, put ready into terminal and set bot status
client.once('ready', () => {
	console.log('Ready!');
    client.user.setActivity('cases rise', { type: 'WATCHING' });
    //client.user.setActivity('deez nuts', { type: 'WATCHING' });
});


//login with bot token
client.login(token);


//have the hourly report happen every hour of each day, e.g. 7:00 and 6:00 using cron
var CronJob = require('cron').CronJob;
var job = new CronJob('0 0 */3 * * *', function() {
	hourlyCOVIDReport();
}, null, true, 'America/Los_Angeles');
job.start();
hourlyCOVIDReport();
//setInterval(function () { hourlyCOVIDReport(); }, 3600*1000); //every hour since the bot started, download new covid data and send message
//setInterval(function () { hourlyCOVIDReport(); }, 5*1000); //same as above but happens for 5 seconds for development testing
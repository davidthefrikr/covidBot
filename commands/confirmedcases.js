const { SlashCommandBuilder } = require('@discordjs/builders');
const { CSV_URL } = require('../config.json');
const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed, Message } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const request = require('request');

/*
------------------------------------------------------------------------
davidthefrikr here, this is literally the jankiest method that i could 
get this command to work from its separate .js file

i was trying to get it to just reuse stuff from index.js but variables 
are reeeeally disgusting with javascript and i'm not proficient enough 
in js to figure that out

THIS 100% NEEDS TO BE CLEANED UP AND MADE MORE EFFICIENT IN THE FUTURE
THIS 100% NEEDS TO BE CLEANED UP AND MADE MORE EFFICIENT IN THE FUTURE
THIS 100% NEEDS TO BE CLEANED UP AND MADE MORE EFFICIENT IN THE FUTURE

also if it ain't broke then don't fix it™
------------------------------------------------------------------------
*/


//download covid data
const covidinfo_URL = (CSV_URL);
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
//var covidNewDeaths;

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
    covidConfirmed = covidDataLA[4]
    covidDeaths = covidDataLA[8]
    covidNewConfirms = covidDataLA[6]
    //covidNewDeaths = covidDataLA[6]

    //console.log("There have been "+covidConfirmed+" confirmed cases of COVID-19 in "+covidCounty+ " as of "+covidDate+".");
    //console.log(covidData); debug console output
}

function covidDL(){
    console.log("Starting dataset download!");
    request(covidinfo_URL).pipe(fs.createWriteStream('covid_data.csv'));
    csvtoVar();
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('confirmedcases')
		.setDescription('Reports to you the current amount of confirmed cases in LA.'),
		//temporarily stripped, need to figure out how to call covidDL from here
		async execute(interaction){
			covidDL();
			const exampleEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('COVID-19 Data')
			.setURL('http://publichealth.lacounty.gov/media/coronavirus/data/')
			.setAuthor('California Department of Public Health')
			.setDescription('COVID-19 data provided by [the California Department of Public Health](https://github.com/datadesk/california-coronavirus-data#cdph-county-cases-deathscsv) and is updated periodically')
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
				{ name: 'Probable Cases', value: covidNewConfirms, inline: true },
				//{ name: 'New Confirmed Deaths', value: covidNewDeaths, inline: true }
				)
			//.setImage('http://publichealth.lacounty.gov/media/coronavirus/images/graph-positivity.png')
			.setTimestamp()
			//.setFooter('Past 7 day average of reported positive COVID-19 tests, please note that images cache on Discord for up to an hour!');
				await interaction.reply({ embeds: [exampleEmbed] });
			// original text without embed, maybe use as a fallback command if user cannot see embeds later?
			//	await interaction.reply("There have been "+covidConfirmed+" confirmed cases and "+covidDeaths+" confirmed deaths from COVID-19 in "+covidCounty+ " County as of "+covidDate+"."+"\n"+"\n"+"There have been "+covidNewConfirms+" new cases reported and "+covidNewDeaths+" new deaths as of "+covidDate+".");
		}
};

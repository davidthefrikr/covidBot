const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const https = require('https');
const request = require('request');
const fs = require('fs');
const url = ("https://shibe.online/api/shibes?count=1&urls=true&httpsUrls=true");
var shibeData;

function shibeDL(){
    console.log("Starting shibe download!");
    request(url).pipe(fs.createWriteStream('shibe.json'));
	shibeData = fs.readFileSync('./shibe.json')
    .toString() // convert Buffer to string
    // .split('\n') // split string to lines
    // .map(e => e.trim()) // remove white spaces for each line
    // .map(e => e.split(',').map(e => e.trim())); // split each line to array
	shibeData=shibeData.substring(2, shibeData.length-2);
	console.log(shibeData);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shibe')
		.setDescription('sends a polite shibe from https://shibe.online'),
		async execute(interaction){
			shibeDL();
			await interaction.reply(shibeData);
		}
};

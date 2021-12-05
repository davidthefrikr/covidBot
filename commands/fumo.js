const { SlashCommandBuilder } = require('@discordjs/builders');
const fetch = require('node-fetch');
const https = require('https');
const request = require('request');
const fs = require('fs');
const url = ("http://fumoapi.herokuapp.com/random");
var shibeData;

function shibeDL(){
    console.log("Starting shibe download!");
    request(url).pipe(fs.createWriteStream('fumo.json'));
	shibeData = fs.readFileSync('./fumo.json')
    .toString() // convert Buffer to string
    // .split('\n') // split string to lines
    // .map(e => e.trim()) // remove white spaces for each line
    // .map(e => e.split(',').map(e => e.trim())); // split each line to array
	shibeData=shibeData.substring(shibeData.indexOf("http"), shibeData.length-10);
	console.log(shibeData);
};

module.exports = {
	data: new SlashCommandBuilder()
		.setName('fumo')
		.setDescription('random fumo generator'),
		async execute(interaction){
			shibeDL();
			await interaction.reply(shibeData);
		}
};

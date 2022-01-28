const Eris = require('eris');
require('pluris')(Eris);
const fs = require('fs');

const configFile = fs.readFileSync('config.json');
const config = JSON.parse(configFile);

if (!config.token) {
    console.log("Please specify your token in config.")
    process.exit();
} else if (!config.prefix) {
    console.log("Please specify a prefix in config.")
    process.exit();
} else if (!config.guild) {
    console.log("Please specify a guild in config.")
    process.exit();
} else if (!config.content) {
    console.log("Please specify message content in config.")
    process.exit();
}

const client = new Eris.Client(config.token);
client.connect();

client.on('connect', async () => {
    console.clear()
    console.log(`[+] Ticket Responder by Luck`);
    console.log(`Client is ready!\n`)
});

//Commands
client.on('messageCreate', async (message) => {
    if (!message.content.startsWith(config.prefix) || message.author.bot || message.author.id != client.user.id) return;

    const args = message.content.slice(config.prefix.length).trim().split(' ');
    const command = args.shift().toLowerCase();

    if (command === 'ping') {
        message.delete();
        message.channel.createMessage('Pong');
    }
});

//Events
client.on("channelCreate", async (channel) => {
    if(channel.name.includes("ticket") && channel.guild.id === config.guild){
        console.log(`[${getDateTime()}] | New ticket detected - #${channel.name}.`)
        setTimeout(() => {
            channel.createMessage(config.content);
        }, 700)
    }
})

function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    return hour + ":" + min + ":" + sec;

}

process.on("unhandledRejection", (err) => {
    return console.log(`Got an unhandled rejection: ${err}`)
});
process.on("uncaughtException", (err) => {
    return console.log(`Got an unhandled exception: ${err}`)
});
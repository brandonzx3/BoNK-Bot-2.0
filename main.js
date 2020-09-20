const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const token = config.token;
const prefix = config.prefix;
const Command = require("./commands.js")(client, prefix);

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

new Command("vibe check", {name: "user", type: "string"}, function(user, message) {
    if(arguments < 3) {
        arguments[arguments.length - 2];
        return;
    }

    let rnd = Math.floor(Math.random() * 12);
    if(rnd >= 5) {
        message.channel.send(`${user} passed his vibe check`);
    } else {
        message.channel.send(`${user} failed his vibe check`);
    }
});

new Command("joe", function(message) {
    message.channel.send("joe mama"); 
});

const memes = require('./memes.json');

new Command("meme", function(message) {
    let rnd = memes[Math.floor(Math.random() * memes.length)];
    let attachment = new Discord.MessageAttachment(rnd);
    message.channel.send(attachment);
});

new Command("shame", {name: "name", type: "string"}, function(name, message) {
    if(arguments.length < 3){
        arguments[arguments.length - 2];
        return;
    }
    message.channel.send(`${name} how dare you!`);
});

client.login(token);
//imports
const mongoose = require('mongoose')
require('dotenv').config({path:'./config/.env'})
const connectDb = require('./config/db')
const {Client, GatewayIntentBits} = require('discord.js')
const Member = require ('./models/Member.js')
const moment = require ('moment-timezone')
const diff_minutes = require('./methods')

//connection
connectDb()


const prefix = '~'

//client instantiation and permission grants
const client = new Client({intents:[GatewayIntentBits.Guilds,GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers]})

//bot on ready
client.on('ready',() => {
console.log('bot is ready')
})

//message create
client.on('messageCreate',async(message) =>{
const args = message.content.slice(prefix.length).split(/ +/);
const command = args.shift().toLowerCase();


//enroll feature
if (message.content.includes("~enroll")) {
    if (message.content.split(" ").length === 3 && message.content.split(" ")[0].trim() ==='~enroll') {
      const firstName = message.content.split(" ")[1].trim();
      const lastName = message.content.split(" ")[2].trim();
  
      if (!firstName || !lastName) {
        message.reply("Empty values cannot be passed in as names");
      } else {
        const arr = [firstName, lastName].map(
          (word) => word.charAt(0).toUpperCase() + word.slice(1)
        );
        const discordID = message.author.id;
        const newStudent = new Member({
          firstName: arr[0],
          lastName: arr[1],
          discordID: discordID,
          bananaCount: 0,
          shameCount: 0,
        });
  
        console.log(newStudent);
  
        try {
          const result = await newStudent.save();
          message.reply("Welcome to The Websmith Clan");
          console.log(result);
        } catch (error) {
          console.log(error);
          message.reply("No double dipping fuckwad");
        }
      }
    } else {
      message.reply(
        `Something went wrong with enrollment, check if your augments are being passed in correctly`
      );
    }
  }



//checkin feature
if (message.content.includes('~checkin')){
    try {
        const result = await Member.findOneAndUpdate({discordID:message.author.id},{checkInTime:new Date()}, {new:true} )
        message.reply(`${result.firstName} has checked in at ${moment.tz(result.checkInTime, 'America/Los_Angeles').format('h:mm a')}. Stay for 30 minutes to acquire a 🍌`)
    } catch (error) {
        console.log(error)
        message.reply('Issue with checking in')
        
    }
}

if (message.content.includes('~checkout')){

    try {
       const result = await Member.findOne({discordID:message.author.id})
       if(!result.checkInTime){
        message.reply('You never even showed up bruh')
       }else{
        result.$set({checkOutTime: new Date()})
        console.log(diff_minutes(result.checkOutTime, result.checkInTime))
  
        const totalMinutes = diff_minutes(result.checkOutTime, result.checkInTime)
  
      if(totalMinutes>=1){
          result.$inc('bananaCount', 1)
          message.reply(`You checked in at ${moment.tz(result.checkInTime, 'America/Los_Angeles').format('h:mm a')}\nYou checked out at ${moment.tz(result.checkOutTime, 'America/Los_Angeles').format('h:mm a')}\nYou were in class for ${totalMinutes} minutes.\n You earned a 🍌!!!\nYou now have ${result.bananaCount} bananas.`)
          result.$set({checkInTime:null, checkOutTime:null})
          result.save()
      }else{
          result.$inc('shameCount', 1)
          message.reply(`You checked in at ${moment.tz(result.checkInTime, 'America/Los_Angeles').format('h:mm a')}\nYou checked out at ${moment.tz(result.checkOutTime, 'America/Los_Angeles').format('h:mm a')}\nYou were in class for ${totalMinutes} minutes.\n You trying to fuck me? You're only fucking yourself over. Any aspiring webdev would LOVE to be here right now. Shame on you, shame on your family, shame on your future generations. Shame shame shame. You receive no banana. Go back to class and start earning!\nYou now have ${result.shameCount} shame.`)
          result.$set({checkInTime:null, checkOutTime:null})
          result.save()
      }
  
       }
      
    } catch (error) {
        console.log(error)
        message.reply('Something happened at checkout')
        
    }}

    
    if (message.content.includes('~set')){
        if(message.author.id == 654928331216650250){
        const targetProperty = (message.content.split(' ')[1])
        const targetUserID = Number(message.content.split(' ')[2])
        const targetValue = Number(message.content.split(' ')[3])
      try {
        const result = await Member.findOne({discordID:targetUserID} )
        result.$set(targetProperty,targetValue)
        result.save()
        console.log(result)
        message.reply(`${result.firstName} now has ${targetProperty==='bananaCount'? result.bananaCount : result.shameCount} ${targetProperty==='bananaCount'? 'bananas' : 'shame'}. May Rakk have mercy on your soul.`)
      
      } catch (error) {
        console.log(error)
        message.reply('problem setting shame count')
      }
           
    }else{
        message.reply("You are not my master")
    }
}


if(message.content.includes('~getbananas')){
    try {
        const result = await Member.findOne({discordID:message.author.id})
        const banana = '🍌'
        message.reply(`You have ${result.bananaCount} bananas. ${banana.repeat(result.bananaCount)}`)
    } catch (error) {
        console.log(error)
        message.reply('Error getting banana count')
    }
}

if(message.content.includes('~getshame')){
    try {
        const result = await Member.findOne({discordID:message.author.id})
        const shames = '😭'
        message.reply(`You have ${result.shameCount} shame. ${shames.repeat(result.shameCount)}`)
    } catch (error) {
        console.log(error)
        message.reply('Error getting banana count')
    }
}



})




//bot login
 client.login(process.env.BOTTOKEN)

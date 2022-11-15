const mongoose = require('mongoose')
const connectDb = async () =>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_KEY,{dbName:'bananaDealer'})
        console.log(`MongoDB Connected`)
    } catch (error) {
        console.log(error)
    }
}

module.exports = connectDb

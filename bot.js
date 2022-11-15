const mongoose = require('mongoose')
require('dotenv').config({path:'./config/.env'})
const connectDb = require('./config/db')

connectDb()
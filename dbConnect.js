const mongoose = require('mongoose')

mongoose.connect("mongodb+srv://asma:asma123@cluster0.qar4cs1.mongodb.net/money" , {useNewUrlParser : true , useUnifiedTopology : true})

const connection = mongoose.connection

connection.on('error', err => console.log(err))

connection.on('connected' , () => console.log('Mongo DB Connection Successfull'))
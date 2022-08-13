const mongoose = require('mongoose')
const app = require(`./app`)
const dotenv = require(`dotenv`)

dotenv.config({ path: './config.env' })


const DB = process.env.DATABASE.replace('<password>', process.env.DATABASE_PASSWORD)


mongoose.connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false
}).then(con => {
    console.log("DB Connected Successfully");
})




const port = 3000 || process.env.PORT;
app.listen(port, (req, res) => {
    console.log("Successfully started");
})
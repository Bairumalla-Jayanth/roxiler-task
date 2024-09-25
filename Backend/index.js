let express = require("express")
let mongoose = require("mongoose")
const cors = require("cors")

const route = require("./Routes/productRoutes")
let app = express()
app.use(express.json())
app.use(cors())

// Establishing the connection with the database
mongoose.connect("mongodb://127.0.0.1:27017/roxilerdb").then(()=>{
    console.log("connected to database")
})

app.use("/api",route)
app.listen(5000)
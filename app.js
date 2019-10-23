const express = require('express')
const bodyParser = require("body-parser");
const app = express()
const port = 3000
const index = require("./routers/index")
const user = require("./routers/user")
const main = require("./routers/main")

//BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('./'));
app.use('/', index);
app.use('/user', user)
app.use('/main', main)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
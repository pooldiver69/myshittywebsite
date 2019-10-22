const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const index = require("./routers/index")
const user = require("./routers/user")

app.use(express.static('./'));
app.use('/', index);
app.use('/user', user)
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
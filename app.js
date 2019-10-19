const express = require('express')
const app = express()
const port = 3000
const path = require('path')
const index = require("./routers/index")

app.use(express.static('./'));
app.use('/', index);
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
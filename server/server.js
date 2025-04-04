const express = require('express')

const app = express()
const port = 3001

app.get('/api', (req, res) => {
    console.log('test')
    res.send('Hello World')
})

app.listen(port, ()=> {
    console.log(`app listening on port${port}`)
})
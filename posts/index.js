const express = require('express')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')
const axios = require('axios')
const cors = require('cors')

const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/posts', async (req, res) => {
    try{

        const id = randomBytes(4).toString('hex')
        const {title} = req.body
        posts[id] = {id, title}
        
        await axios.post('http://event-bus-srv:4005/events', {
            type: 'PostCreated',
            data: {
                id,
                title
            }
        })
        res.status(201).send(posts[id])
    } catch(error){
        console.error(error)
    }
})

app.post('/events', (req, res) => {
    const event = req.body
    console.log(`Event received: ${event.type}`)

    res.send({})
})

app.listen(4000, () => {
    console.log('Test log')
    console.log('Server running on port 4000')
})

module.exports = app
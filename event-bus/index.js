const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
//const cors = require('cors')

const app = express()

app.use(bodyParser.json())

const events = []

app.post('/events', (req, res) => {
    try{

        const event = req.body
        events.push(event)

        axios.post('http://posts-clusterip-srv:4000/events', event)
        axios.post('http://localhost:4001/events', event)
        axios.post('http://localhost:4002/events', event).catch(err => {})
        axios.post('http://localhost:4003/events', event)
        
        res.send({status: 'OK'})
    } catch(error){
        console.log(error)
    }

})

app.get('/events', (req, res) => {
    res.send(events)
})

app.listen(4005, () => {
    console.log('Server running on port 4005')
})

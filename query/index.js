const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const posts = {}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body
    switch(type){
        case 'PostCreated':
            posts[data.id] = {id: data.id, title: data.title, comments: []}
            console.log(`Event received: PostCreated`)
            res.status(200).send(posts[data.id])
            break
        case 'CommentCreated':
            posts[data.postId].comments.push({id: data.id, content: data.content})        
            console.log(`Event received: CommentCreated`)
            res.status(200).send(posts[data.postId]['comments'])
            break
        default:
            console.log("Event received: Unknown")
    }
})

app.listen(4002, () => {
    console.log("Server running on port 4002")
})

module.exports = app
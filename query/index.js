const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios')

const app = express()
app.use(cors())
app.use(bodyParser.json())

const posts = {}

const handleEvent = (type, data) => {
    if(type === 'PostCreated'){
        const {id, title,} = data
        posts[id] = {id, title, comments: []}
        console.log(`Event received: PostCreated`)
    }

    if(type === 'CommentCreated'){
        const {id, postId, content, status} = data
        posts[postId].comments.push({id, content, status})        
        console.log(`Event received: CommentCreated`)

    }

    if(type === 'CommentUpdated'){
        const {id, postId, content, status} = data
        const post = posts[postId]        
        const comment = post.comments.find(comment => comment.id === id)
        comment.status = status
        comment.content = content
        console.log(`Event received: CommentUpdated`)
    }
}

app.get('/posts', (req, res) => {
    res.send(posts)
})

app.post('/events', (req, res) => {
    const {type, data} = req.body    
    
    handleEvent(type, data)    
    res.send({})                     
    
})


app.listen(4002, async () => {
    console.log("Server running on port 4002")
    try {
        const res = await axios.get('http://localhost:4005/events')

        for(const event of res.data){
            console.log(`Processing event ${event.type}`)
            handleEvent(event.type, event.data)
        }
    } catch (error) {
        console.log(error.message)
    }
})

module.exports = app
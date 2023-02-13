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
    if(type === 'PostCreated'){
        const {id, title,} = data
        posts[id] = {id, title, comments: []}
        console.log(`Event received: PostCreated`)
        res.send(posts[id])
    }

    if(type === 'CommentCreated'){
        const {id, postId, content, status} = data
        posts[postId].comments.push({id, content, status})        
        console.log(`Event received: CommentCreated`)
        res.send(posts[postId]['comments'])

    }

    if(type === 'CommentUpdated'){
        const {id, postId, content, status} = data
        const post = posts[postId]        
        const comment = post.comments.find(comment => comment.id === id)
        comment.status = status
        comment.content = content
        console.log(`Event received: CommentUpdated`)
        res.send(posts[postId]['comments'])
    }
                            
    
})

app.listen(4002, () => {
    console.log("Server running on port 4002")
})

module.exports = app
const express = require('express')
const bodyParser = require('body-parser')
const {randomBytes} = require('crypto')
const cors = require('cors')
const axios = require('axios')


const app = express()
app.use(bodyParser.json())
app.use(cors())
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000"); // update to match the domain you will make the request from
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  })

const commentsByPostId = {}

app.get('/posts/:id/comments', (req, res) => {
    const id = req.params.id

    res.status(200).send(commentsByPostId[id] || [])
})

app.post('/posts/:id/comments', async (req, res) => {
    try {
        const commentId = randomBytes(4).toString('hex')
        const {content} = req.body
        const postId = req.params.id
        const comment = {id: commentId, content, status: 'pending'}
        commentsByPostId[postId] ? commentsByPostId[postId].push(comment) : commentsByPostId[postId] = [comment]
    
        await axios.post('http://localhost:4005/events', {
            type: 'CommentCreated',
            data: {
                id: commentId,
                content,
                postId,
                status: 'pending'
            }
        })
        res.status(201).send(commentsByPostId[postId])        
    } catch (error) {
        console.error(error)
    }
})

app.post('/events', async (req, res) => {
    const {type, data} = req.body
    console.log(`Event received: ${type}`)

    const {id, postId, content, status} = data

    if(type === 'CommentModerated'){
        const comments = commentsByPostId[postId]
        const comment = comments.find(comment => comment.id === id)
        comment.status = status

        await axios.post('http://localhost:4005/events', {
            type: 'CommentUpdated',
            data: {
                id, 
                postId,
                content,
                status
            }
        })
    }

    res.send({})
})

app.listen(4001, () => {
    console.log('server listening on port 4001')
})

module.exports = app

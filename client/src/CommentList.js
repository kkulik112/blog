import React, {useState, useEffect} from 'react'
import axios from 'axios'

const CommentList = ({postId}) => {

    const [comments, setComments] = useState([])

    const fetchData = async () => {        
            const res = await axios.get(`http://localhost:4001/posts/${postId}/comments`)
            setComments(res.data)                
    }

    useEffect(() => {
        fetchData()
    }, [setComments])


    return (
        <div>
            <h3>{comments.length} comments</h3>
            <ul>
                {comments.map(comment => <li key={comment.id}>
                    {comment.content}
                </li>)}
            </ul>
        </div>
    )
}

export default CommentList
import React from 'react'

const CommentList = ({comments}) => {

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
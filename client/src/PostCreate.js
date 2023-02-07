import React, {useState} from 'react'
import axios from 'axios'


const PostCreate = () => {

    const mainAxios = axios.create({
        baseURL: 'localhost:4000/'
    })

    const [title, setTitle] = useState('')

    const onSubmit = async (e) => {
        e.preventDefault()
        try {

            const payload = {title}

            await mainAxios.post('http://localhost:4000/posts', payload)

            setTitle('')
        } catch (error) {
            console.error('error')
        }

    }

    return (
        <div>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Title</label>
                    <input className="form-control" type="text" value={title} onChange={e => setTitle(e.target.value)} required/>
                </div>
                <button className="btn btn-primary" type="submit">Submit</button>
            </form>
            <hr/>
        </div>
    )
}

export default PostCreate
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [writer, setWriter] = useState('')


  useEffect(() => {
    fetch(`http://localhost:8081/api/posts/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
  }, [id])

  useEffect(() => {
    fetch(`http://localhost:8081/api/posts/${id}/comments`)
      .then((response) => response.json())
      .then((data) => setComments(data))
  }, [id])
  
  const handleCommentCreate = () => {
    fetch(`http://localhost:8081/api/posts/${id}/comments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content, writer }),
    })
      .then((response) => response.json())
      .then((newComment) => {
        setComments([...comments, newComment])
        setContent('')
        setWriter('')
      })
    }

    if (!post) return <div>로딩중...</div>

    return (
      <div>
        <h1>{post.title}</h1>
        <p>작성자: {post.writer}</p>
        <p>{post.content}</p>
        <hr />
        <h3>댓글</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {comment.writer}: {comment.content}
            </li>
          ))}
        </ul>
        <input
          type="text"
          placeholder="댓글 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          type="text"
          placeholder="작성자"
          value={writer}
          onChange={(e) => setWriter(e.target.value)}
        />
        <button onClick={handleCommentCreate}>댓글 작성</button>
      </div>
    )
  }
  
  export default PostDetail
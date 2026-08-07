import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:8081/api/posts/${id}`)
      .then((response) => response.json())
      .then((data) => setPost(data))
  }, [id])

  if (!post) return <div>로딩중...</div>

  return (
    <div>
      <h1>{post.title}</h1>
      <p>작성자: {post.writer}</p>
      <p>{post.content}</p>
    </div>
  )
}

export default PostDetail
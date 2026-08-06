import { useState, useEffect } from 'react'

function App() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetch('http://localhost:8081/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
  }, [])

  return (
    <div>
      <h1>게시판</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            {post.title} - {post.writer}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
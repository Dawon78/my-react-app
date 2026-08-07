import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function PostList() {

  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [writer, setWriter] = useState('')
  const [posts, setPosts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const titleInputRef = useRef(null)


  useEffect(() => {
    fetch('http://localhost:8081/api/posts')
      .then((response) => response.json())
      .then((data) => setPosts(data))
  }, [])

  const handleCreate = () => {
    fetch('http://localhost:8081/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, writer }),
    })
      .then((response) => response.json())
      .then((newPost) => {
        setPosts([...posts, newPost])
        setTitle('')
        setContent('')
        setWriter('')
        titleInputRef.current.focus()
      })
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:8081/api/posts/${id}`, {
      method: 'DELETE',
    }).then(() => {
      setPosts(posts.filter((post) => post.id !== id))
    })
  }

  const handleUpdate = (id) => {
    fetch(`http://localhost:8081/api/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, writer }),
    })
      .then((response) => response.json())
      .then((updatedPost) => {
        setPosts(posts.map((post) => (post.id === id ? updatedPost : post)))
        setEditingId(null)
        setTitle('')
        setContent('')
        setWriter('')
      })
  }

  return (
    <div>
      <h1>게시판</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <Link to={`/posts/${post.id}`}>{post.title}</Link> - {post.writer} - {post.createdAt}
            <button onClick={() => handleDelete(post.id)}>삭제</button>
            <button
              onClick={() => {
                setEditingId(post.id)
                setTitle(post.title)
                setContent(post.content)
                setWriter(post.writer)
              }}
            >
              수정
            </button>
          </li>
        ))}
      </ul>
      <div>
        <input
          type="text"
          ref={titleInputRef}
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              editingId ? handleUpdate(editingId) : handleCreate()
            }
          }}
        />
        <input
          type="text"
          placeholder="내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              editingId ? handleUpdate(editingId) : handleCreate()
            }
          }}
        />
        {!editingId && (
          <input
            type="text"
            placeholder="작성자"
            value={writer}
            onChange={(e) => setWriter(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                editingId ? handleUpdate(editingId) : handleCreate()
              }
            }}
          />
        )}
        {editingId ? (
          <button onClick={() => handleUpdate(editingId)}>수정 완료</button>
        ) : (
          <button onClick={handleCreate}>작성</button>
        )}
      </div>
    </div>
  )
}

export default PostList
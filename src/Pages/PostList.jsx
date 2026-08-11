import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'

function PostList() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [writer, setWriter] = useState('')
  const [posts, setPosts] = useState([])
  const [editingId, setEditingId] = useState(null)
  const titleInputRef = useRef(null)

  // 💡 페이징용 State 추가!
  const [page, setPage] = useState(0)          // 현재 페이지 (0부터 시작)
  const [totalPages, setTotalPages] = useState(0) // 전체 페이지 수

  // 💡 page가 변경될 때마다 해당 페이지 데이터 백엔드 요청
  useEffect(() => {
    fetch(`http://localhost:8081/api/posts?page=${page}`)
      .then((response) => response.json())
      .then((data) => {
        setPosts(data.content || [])   // Page 객체 내 실제 목록은 data.content
        setTotalPages(data.totalPages) // 전체 페이지 수 업데이트
      })
  }, [page])

  const handleCreate = () => {
    fetch('http://localhost:8081/api/posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content, writer }),
    })
      .then((response) => response.json())
      .then(() => {
        // 새 글을 등록하면 첫 페이지(0번)로 이동하면서 데이터 새로고침
        if (page === 0) {
          fetch('http://localhost:8081/api/posts?page=0')
            .then((res) => res.json())
            .then((data) => {
              setPosts(data.content || [])
              setTotalPages(data.totalPages)
            })
        } else {
          setPage(0)
        }
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
      // 삭제 후 현재 페이지 목록 다시 불러오기
      fetch(`http://localhost:8081/api/posts?page=${page}`)
        .then((res) => res.json())
        .then((data) => {
          setPosts(data.content || [])
          setTotalPages(data.totalPages)
        })
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
            <Link to={`/posts/${post.id}`}>{post.title}</Link> (조회수: {post.viewCount}) - {post.writer} - {post.createdAt}
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

      {/* 💡 하단 페이징 버튼 영역 추가! */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }}>
        <button 
          onClick={() => setPage(page - 1)} 
          disabled={page === 0}
        >
          이전
        </button>

        <span>
          {page + 1} / {totalPages === 0 ? 1 : totalPages} 페이지
        </span>

        <button 
          onClick={() => setPage(page + 1)} 
          disabled={page + 1 >= totalPages}
        >
          다음
        </button>
      </div>

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
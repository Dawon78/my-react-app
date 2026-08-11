import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function PostDetail() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [content, setContent] = useState('')
  const [writer, setWriter] = useState('')
  const [editingCommentId, setEditingCommentId] = useState(null) // 현재 수정 중인 댓글 ID
  const [editContent, setEditContent] = useState('')            // 수정 입력창의 텍스트



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

  // 1. [수정] 버튼 눌렀을 때: 수정 모드로 전환
  const handleStartEdit = (comment) => {
    setEditingCommentId(comment.id) // 수정할 댓글 ID 저장
    setEditContent(comment.content)  // 기존 댓글 내용을 입력창에 띄워줌
  }

  // 2. [저장] 버튼 눌렀을 때: 백엔드로 PUT 요청 보내기
  const handleCommentUpdate = (commentId) => {
    fetch(`http://localhost:8081/api/comments/${commentId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: editContent }),
    })
      .then((response) => response.json())
      .then((updatedComment) => {
        // 화면(state)의 댓글 목록 중 수정된 댓글만 쏙 교체
        setComments(
          comments.map((c) => (c.id === commentId ? updatedComment : c))
        )
        setEditingCommentId(null) // 수정 모드 종료
        setEditContent('')
      })
  }

  const handleCommentDelete = (commentId) => {
    fetch(`http://localhost:8081/api/comments/${commentId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // 백엔드 삭제 성공 시, 화면(state)에서도 해당 댓글 제거
          setComments(comments.filter((c) => c.id !== commentId))
        }
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
            {editingCommentId === comment.id ? (
              // 1. [수정 모드]일 때 보여줄 화면
              <>
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                />
                <button onClick={() => handleCommentUpdate(comment.id)}>저장</button>
                <button onClick={() => setEditingCommentId(null)}>취소</button>
              </>
            ) : (
              // 2. [일반 모드]일 때 보여줄 화면
              <>
                {comment.writer}: {comment.content}
                <button onClick={() => handleStartEdit(comment)}>수정</button>
                <button onClick={() => handleCommentDelete(comment.id)}>삭제</button>
              </>
            )}
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
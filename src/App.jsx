import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 1. 메인('/')으로 접속하면 게시글 목록('/posts')으로 자동 리다이렉트 */}
        <Route path="/" element={<Navigate to="/posts" replace />} />

        {/* 2. 게시글 목록 페이지 (/posts) */}
        <Route path="/posts" element={<PostList />} />

        {/* 3. 게시글 상세 페이지 (/posts/1, /posts/2 등) */}
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
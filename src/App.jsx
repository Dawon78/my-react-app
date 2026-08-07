import { BrowserRouter, Routes, Route } from 'react-router-dom'
import PostList from './pages/PostList'
import PostDetail from './pages/PostDetail'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostList />} />
        <Route path="/posts/:id" element={<PostDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
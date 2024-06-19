import { Blog, Home, Post1 } from "./pages"

import { BrowserRouter, Route, Routes } from "react-router-dom"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blog" element={<Blog />} />

        <Route path="/blog/socialsense" element={<Post1 />} />
      </Routes>
    </BrowserRouter>
  )
}

import { WorkRng } from "pages/workrng"

import { BrowserRouter, Route, Routes } from "react-router-dom"

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<>sup</>} />
        <Route path="/workrng" element={<WorkRng />} />
      </Routes>
    </BrowserRouter>
  )
}

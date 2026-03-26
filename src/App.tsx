import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Header } from "@/components/layout/header"
import { DashboardPage } from "@/pages/dashboard"
import { CreatePage } from "@/pages/create"
import { EditPage } from "@/pages/edit"
import { PreviewPage } from "@/pages/preview"

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/create" element={<CreatePage />} />
            <Route path="/edit/:id" element={<EditPage />} />
            <Route path="/preview/:id" element={<PreviewPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

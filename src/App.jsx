import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navigation from './components/navigation'
import Footer from './components/footer'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Login from './pages/Login'

function App() {
  return (
    <Router>
      <Navigation logo="https://placehold.co/150x50" />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
      <Footer />
    </Router>
  )
}

export default App

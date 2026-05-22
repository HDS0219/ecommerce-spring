import './App.css'
import Products from './pages/products'
import { Routes, Route, Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h1>TEST HOMEPAGE</h1>

      <Link to="/products">
        PRODUCTS
      </Link>
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  )
}

export default App
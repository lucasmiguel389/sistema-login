import Header from "./components/Header"
import Hero from "./components/Hero"
import Projects from "./components/Projects"
import Footer from "./components/Footer"
import "./App.css"

function App() {
  return (
    <div className="container">
      <Header />
      <Hero />
      <Projects />
      <Footer />
    </div>
  )
}

export default App
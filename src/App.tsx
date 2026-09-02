import { useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Workflow } from './components/Workflow'

function App() {
  useEffect(() => {
    const id = window.location.hash.replace('#', '')
    if (!id) return
    const node = document.getElementById(id)
    if (!node) return
    const t = window.setTimeout(() => {
      node.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, 120)
    return () => window.clearTimeout(t)
  }, [])

  return (
    <ReactLenis
      root
      options={{
        autoRaf: true,
        anchors: { offset: -100, duration: 1.15 },
        duration: 1.15,
        lerp: 0.08,
        smoothWheel: true,
      }}
    >
      <Cursor />
      <a className="skip-link" href="#about">
        Skip to content
      </a>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Workflow />
        <Contact />
      </main>
      <Footer />
    </ReactLenis>
  )
}

export default App

import { useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Cursor } from './components/Cursor'
import { Education } from './components/Education'
import { Experience } from './components/Experience'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Navbar } from './components/Navbar'
import { ProjectDetail } from './components/ProjectDetail'
import { Projects } from './components/Projects'
import { Skills } from './components/Skills'
import { Workflow } from './components/Workflow'

function HomePage() {
  const location = useLocation()

  useEffect(() => {
    const id = location.hash.replace('#', '')
    if (!id) return
    const node = document.getElementById(id)
    if (!node) return
    const t = window.setTimeout(() => {
      node.scrollIntoView({ behavior: 'instant', block: 'start' })
    }, 120)
    return () => window.clearTimeout(t)
  }, [location.hash])

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
        <Education />
        <Projects />
        <Workflow />
        <Contact />
      </main>
      <Footer />
    </ReactLenis>
  )
}

function ProjectPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [])

  return (
    <>
      <Cursor />
      <Navbar />
      <ProjectDetail />
      <Footer />
    </>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/work/:slug" element={<ProjectPage />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App

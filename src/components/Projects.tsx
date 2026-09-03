import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { type MouseEvent, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/site'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'

function TiltCard({
  children,
  to,
  className = '',
}: {
  children: ReactNode
  to: string
  className?: string
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [10, -10]), { stiffness: 220, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), { stiffness: 220, damping: 20 })
  const glareX = useTransform(x, [-0.5, 0.5], [0, 100])
  const glareY = useTransform(y, [-0.5, 0.5], [0, 100])
  const glare = useMotionTemplate`radial-gradient(circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.45), transparent 55%)`

  const onMove = (event: MouseEvent<HTMLAnchorElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    x.set((event.clientX - rect.left) / rect.width - 0.5)
    y.set((event.clientY - rect.top) / rect.height - 0.5)
  }

  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.div style={{ perspective: 900 }} className={className}>
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="project-tilt"
      >
        <Link to={to} className="project-card" onMouseMove={onMove} onMouseLeave={onLeave}>
          <motion.span className="project-glare" style={{ background: glare }} aria-hidden="true" />
          {children}
        </Link>
      </motion.div>
    </motion.div>
  )
}

export function Projects() {
  return (
    <section className="section work" id="work">
      <div className="container">
        <Reveal className="section-intro">
          <p className="section-kicker">Selected work</p>
          <h2 className="section-title">Projects built end to end.</h2>
        </Reveal>

        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 90} from={index % 2 === 0 ? 'left' : 'right'}>
              <TiltCard to={`/work/${project.slug}`}>
                <div className="project-cover">
                  <img src={project.cover} alt="" loading="lazy" />
                  <span className="project-year">{project.year}</span>
                </div>
                <div className="project-body">
                  <p className="project-tag">{project.tag}</p>
                  <h3>{project.name}</h3>
                  <p className="project-hook">{project.hook}</p>
                  <ul className="project-stack" aria-label={`${project.name} stack`}>
                    {project.stack.map((item) => (
                      <li key={item.id} title={item.name}>
                        <TechIcon id={item.id} title={item.name} />
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

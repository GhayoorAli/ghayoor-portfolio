'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/types/content'
import { Reveal } from './Reveal'
import { TechIcon } from './TechIcon'

export function Projects({ projects }: { projects: Project[] }) {
  return (
    <section className="section work" id="work">
      <div className="container">
        <Reveal className="section-intro section-intro-row">
          <div>
            <p className="section-kicker">Featured projects</p>
            <h2 className="section-title">Selected work</h2>
          </div>
          <a className="text-link" href="#contact">
            View all work →
          </a>
        </Reveal>

        <div className="project-grid">
          {projects.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70}>
              <motion.div whileHover={{ y: -6 }} transition={{ duration: 0.35 }}>
                <Link href={`/work/${project.slug}`} className="project-card">
                  <div className="project-cover">
                    <img src={project.cover} alt="" loading="lazy" />
                    <span className="project-year">{project.year}</span>
                  </div>
                  <div className="project-body">
                    <h3>{project.name}</h3>
                    <p className="project-tag">{project.tag}</p>
                    {project.stack.length > 0 ? (
                      <ul className="project-card-stack" aria-label={`${project.name} technology stack`}>
                        {project.stack.map((item) => (
                          <li key={`${project.slug}-${item.id}-${item.name}`}>
                            <TechIcon id={item.id} title={item.name} src={item.icon_url} />
                            <span>{item.name}</span>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </Link>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

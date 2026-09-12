'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Project } from '@/types/content'
import { MermaidDiagram } from './MermaidDiagram'
import { ProjectGallery } from './ProjectGallery'
import { TechIcon } from './TechIcon'

export function ProjectDetail({ project }: { project: Project }) {
  return (
    <main className="project-page">
      <motion.div
        className="container project-page-inner"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      >
        <Link className="project-back" href="/#work">
          ← Back to work
        </Link>

        <header className="project-hero">
          <p className="section-kicker">{project.tag}</p>
          <h1>{project.name}</h1>
          <p className="project-page-hook">{project.hook}</p>
          <div className="project-page-links">
            {project.links.live ? (
              <a className="btn btn-primary" href={project.links.live} target="_blank" rel="noreferrer">
                Live demo
              </a>
            ) : (
              <span className="project-link-note">No public live demo</span>
            )}
            {project.links.github ? (
              <a className="btn btn-ghost" href={project.links.github} target="_blank" rel="noreferrer">
                GitHub
              </a>
            ) : null}
          </div>
        </header>

        <figure className="project-page-cover">
          <img src={project.cover} alt={`${project.name} cover`} />
        </figure>

        {project.problem ? (
          <section className="project-section">
            <h2>The problem</h2>
            <p>{project.problem}</p>
          </section>
        ) : null}

        {project.role ? (
          <section className="project-section">
            <h2>My role</h2>
            <p>{project.role}</p>
          </section>
        ) : null}

        {project.stack.length > 0 ? (
          <section className="project-section">
            <h2>Tech stack</h2>
            <ul className="project-page-stack">
              {project.stack.map((item) => (
                <li key={`${item.id}-${item.name}`}>
                <TechIcon id={item.id} title={item.name} src={item.icon_url} />
                  <span>{item.name}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.features.length > 0 ? (
          <section className="project-section">
            <h2>Features</h2>
            <ul className="project-bullets">
              {project.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {project.architecture ? (
          <section className="project-section">
            <h2>Architecture</h2>
            <MermaidDiagram chart={project.architecture} title={`${project.name} architecture`} />
          </section>
        ) : null}

        {project.workflow ? (
          <section className="project-section">
            <h2>Meeting workflow</h2>
            <MermaidDiagram chart={project.workflow} title={`${project.name} workflow`} />
          </section>
        ) : null}

        {project.challenges.length > 0 ? (
          <section className="project-section">
            <h2>Challenges & solutions</h2>
            <div className="project-challenge-list">
              {project.challenges.map((item) => (
                <article key={item.title || item.problem} className="project-challenge">
                  <h3>{item.title}</h3>
                  <p>
                    <strong>Challenge:</strong> {item.problem}
                  </p>
                  <p>
                    <strong>Solution:</strong> {item.solution}
                  </p>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {project.gallery.length > 0 ? (
          <section className="project-section">
            <h2>Screenshots</h2>
            <ProjectGallery images={project.gallery} projectName={project.name} />
          </section>
        ) : null}

        {project.results ? (
          <section className="project-section">
            <h2>Results</h2>
            <p>{project.results}</p>
          </section>
        ) : null}
      </motion.div>
    </main>
  )
}

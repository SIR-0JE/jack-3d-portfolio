import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'
import type { ProjectData } from '../context/PortfolioContext'
import FadeIn from '../components/FadeIn'
import { ArrowRight } from 'lucide-react'

interface ProjectCardProps {
  project: ProjectData
  index: number
  totalCards: number
  sectionRef: React.RefObject<HTMLDivElement | null>
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, totalCards, sectionRef }) => {
  const cardRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  })

  // Stacking scale calculation
  const progressRatio = totalCards > 1 ? index / (totalCards - 1) : 0
  const targetScale = 1 - (totalCards - 1 - index) * 0.03

  const scale = useTransform(
    scrollYProgress,
    [progressRatio * 0.8, 1],
    [1, targetScale]
  )

  const borderRadius = 'clamp(40px, 5vw, 60px)'

  return (
    <div
      className="min-h-[60vh] sm:min-h-[70vh] py-6 sm:py-8 flex items-start sticky top-24 md:top-32"
      style={{ top: `${index * 28}px` }}
    >
      <motion.div
        ref={cardRef}
        style={{
          scale,
          transformOrigin: 'top center',
          borderRadius,
        }}
        className="w-full border-2 border-[#D7E2EA] bg-[#0C0C0C] p-5 sm:p-7 md:p-9 overflow-hidden flex flex-col gap-6"
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-white/5 pb-4">
          <div 
            className="flex items-baseline gap-4 sm:gap-6 cursor-pointer group"
            onClick={() => { window.location.hash = `#/project/${project.num}` }}
          >
            <span
              className="hero-heading font-black leading-none group-hover:opacity-80 transition-opacity"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {project.num}
            </span>
            <div className="flex flex-col">
              <span className="text-purple-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                {project.category}
              </span>
              <h2
                className="text-white font-black uppercase tracking-tight group-hover:text-purple-400 transition-colors"
                style={{ fontSize: 'clamp(1.1rem, 2.5vw, 2.2rem)' }}
              >
                {project.name}
              </h2>
            </div>
          </div>
          <button
            onClick={() => { window.location.hash = `#/project/${project.num}` }}
            className="rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-6 py-2.5 sm:px-8 sm:py-3 text-xs sm:text-sm transition-colors duration-200 hover:bg-[#D7E2EA]/10 cursor-pointer bg-transparent"
          >
            View Project
          </button>
        </div>

        {/* Dynamic Project Hook Description */}
        <div className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light font-sans max-w-3xl">
          {project.template_type === 'casestudy' && project.problem_statement ? (
            <p><strong>Problem Solved: </strong>{project.problem_statement}</p>
          ) : (
            <p>{project.description}</p>
          )}
        </div>

        {/* Visual Showcase with Glassmorphic Metric Overlay */}
        <div 
          className="relative flex gap-3 sm:gap-4 cursor-pointer overflow-hidden rounded-[30px]"
          onClick={() => { window.location.hash = `#/project/${project.num}` }}
        >
          {/* Left stacked images - 40% */}
          <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
            {project.col1img1 && (
              <img
                src={project.col1img1}
                alt={`${project.name} mockup 1`}
                loading="lazy"
                className="w-full object-cover"
                style={{
                  height: 'clamp(120px, 15vw, 200px)',
                  borderRadius: 'clamp(15px, 2vw, 25px)',
                }}
              />
            )}
            {project.col1img2 && (
              <img
                src={project.col1img2}
                alt={`${project.name} mockup 2`}
                loading="lazy"
                className="w-full object-cover"
                style={{
                  height: 'clamp(140px, 20vw, 280px)',
                  borderRadius: 'clamp(15px, 2vw, 25px)',
                }}
              />
            )}
          </div>

          {/* Right main image - 60% */}
          <div style={{ width: '60%' }} className="relative">
            {project.col2img && (
              <img
                src={project.col2img}
                alt={`${project.name} visual preview`}
                loading="lazy"
                className="w-full h-full object-cover"
                style={{
                  minHeight: 'clamp(270px, 35vw, 490px)',
                  borderRadius: 'clamp(15px, 2vw, 25px)',
                }}
              />
            )}
          </div>

          {/* Glassmorphic Metrics Badge Overlay - overlaps bottom-left of images container */}
          {project.template_type === 'casestudy' && project.success_metrics && project.success_metrics.length > 0 && (
            <div className="absolute bottom-6 left-6 z-20 bg-white/10 backdrop-blur-md border border-white/10 px-4 py-2.5 rounded-2xl shadow-xl max-w-[80%] pointer-events-none select-none">
              <span className="text-white text-xs sm:text-sm font-bold tracking-wide flex items-center gap-1.5 font-sans">
                {project.success_metrics[0]}
              </span>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  )
}

interface ProjectsSectionProps {
  /** When true, shows only the first 2 projects as a teaser with a "View All Work" CTA */
  preview?: boolean
}

const ProjectsSection: React.FC<ProjectsSectionProps> = ({ preview = false }) => {
  const { data } = usePortfolio()
  const sectionRef = useRef<HTMLDivElement>(null)

  // In preview mode, limit to the first 2 projects
  const visibleProjects = preview ? data.projects.slice(0, 2) : data.projects
  const TOTAL = visibleProjects.length

  return (
    <section
      id="projects-section"
      ref={sectionRef}
      className="bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]
        -mt-10 sm:-mt-12 md:-mt-14 z-10 relative
        px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32"
    >
      {/* Section heading */}
      <FadeIn delay={0} y={40} className="mb-16 sm:mb-20 md:mb-28">
        <h2
          className="hero-heading font-black uppercase leading-none tracking-tight text-center"
          style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
        >
          Work
        </h2>
        {preview && (
          <p className="text-center text-neutral-500 text-xs uppercase tracking-widest mt-4 font-semibold">
            Featured Outcomes
          </p>
        )}
      </FadeIn>

      {/* Project cards */}
      <div className="flex flex-col gap-0">
        {visibleProjects.map((project, index) => (
          <ProjectCard
            key={project.num + '-' + index}
            project={project}
            index={index}
            totalCards={TOTAL}
            sectionRef={sectionRef}
          />
        ))}
      </div>

      {/* "View All Work" CTA — only shown in preview mode */}
      {preview && (
        <FadeIn delay={0.2} y={30} className="flex justify-center mt-20 sm:mt-24 md:mt-28">
          <button
            onClick={() => { window.location.hash = '#/projects' }}
            className="group relative flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full
              bg-transparent border-2 border-[#D7E2EA]/30 text-[#D7E2EA]
              text-sm sm:text-base font-bold uppercase tracking-widest
              hover:border-[#D7E2EA] hover:bg-[#D7E2EA]/5
              transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <span className="absolute inset-0 w-0 bg-gradient-to-r from-purple-600/10 to-transparent group-hover:w-full transition-all duration-500 rounded-full" />
            <span className="relative">View All Work</span>
            <ArrowRight
              size={17}
              className="relative transition-transform duration-300 group-hover:translate-x-1.5"
            />
          </button>
        </FadeIn>
      )}
    </section>
  )
}

export default ProjectsSection

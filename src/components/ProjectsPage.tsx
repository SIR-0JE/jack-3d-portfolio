import React, { useRef, useState, useMemo } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePortfolio } from '../context/PortfolioContext'
import type { ProjectData } from '../context/PortfolioContext'
import FadeIn from './FadeIn'
import { ExternalLink, Hammer } from 'lucide-react'

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

  const borderRadius = 'clamp(30px, 4vw, 50px)'

  return (
    <div
      className="min-h-[90vh] sm:h-[85vh] flex items-start sticky top-28 md:top-36 pb-12"
      style={{ top: `${index * 32}px` }}
    >
      <motion.div
        ref={cardRef}
        style={{
          scale,
          transformOrigin: 'top center',
          borderRadius,
        }}
        className="w-full border border-neutral-800 bg-[#0E0E0E] p-5 sm:p-7 md:p-9 shadow-2xl flex flex-col gap-6 sm:gap-8 justify-between"
      >
        {/* Card Header */}
        <div className="flex items-center justify-between gap-4 flex-wrap border-b border-white/5 pb-4">
          <div className="flex items-baseline gap-4 sm:gap-6">
            <span
              className="hero-heading font-black leading-none"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 100px)' }}
            >
              {project.num}
            </span>
            <div className="flex flex-col">
              <span className="text-purple-400 font-bold uppercase tracking-widest text-[10px] sm:text-xs">
                {project.category}
              </span>
              <h2
                className="text-white font-black uppercase tracking-tight"
                style={{ fontSize: 'clamp(1.2rem, 3vw, 2.4rem)' }}
              >
                {project.name}
              </h2>
            </div>
          </div>

          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#D7E2EA]/20 text-[#D7E2EA] font-medium uppercase tracking-widest text-xs hover:bg-[#D7E2EA]/10 hover:border-white transition-all cursor-pointer"
            >
              Live Project
              <ExternalLink size={12} />
            </a>
          )}
        </div>

        {/* Card Main: Left Image Grid, Right Detailed metadata & Main Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Detailed Project Info - 4 cols */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Role</span>
              <span className="text-sm font-semibold text-neutral-300 uppercase tracking-wide">{project.role || 'Creator'}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Details</span>
              <p className="text-xs sm:text-sm text-neutral-400 font-light leading-relaxed">
                {project.description || 'Redesigning brand parameters and creating clean high-end visuals.'}
              </p>
            </div>

            {project.tools && project.tools.length > 0 && (
              <div className="flex flex-col gap-1.5 mt-2">
                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold flex items-center gap-1">
                  <Hammer size={10} />
                  Tools Used
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {project.tools.map((tool, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 text-[10px] rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-widest font-mono"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Visual Showcase - 8 cols */}
          <div className="lg:col-span-8 flex gap-3 sm:gap-4">
            {/* Left stacked images - 40% */}
            <div className="flex flex-col gap-3 sm:gap-4" style={{ width: '40%' }}>
              {project.col1img1 && (
                <img
                  src={project.col1img1}
                  alt={`${project.name} gallery 1`}
                  className="w-full object-cover shadow-lg"
                  style={{
                    height: 'clamp(100px, 14vw, 180px)',
                    borderRadius: 'clamp(15px, 2vw, 25px)',
                  }}
                />
              )}
              {project.col1img2 && (
                <img
                  src={project.col1img2}
                  alt={`${project.name} gallery 2`}
                  className="w-full object-cover shadow-lg"
                  style={{
                    height: 'clamp(120px, 18vw, 240px)',
                    borderRadius: 'clamp(15px, 2vw, 25px)',
                  }}
                />
              )}
            </div>

            {/* Right main image - 60% */}
            <div style={{ width: '60%' }}>
              {project.col2img && (
                <img
                  src={project.col2img}
                  alt={`${project.name} main visual`}
                  className="w-full object-cover shadow-lg"
                  style={{
                    height: 'clamp(230px, 32vw, 440px)',
                    borderRadius: 'clamp(15px, 2vw, 25px)',
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

const ProjectsPage: React.FC = () => {
  const { data } = usePortfolio()
  const sectionRef = useRef<HTMLDivElement>(null)
  
  // Filter state
  const [activeFilter, setActiveFilter] = useState<'All' | 'Client' | 'Personal'>('All')

  // Filter projects dynamically
  const filteredProjects = useMemo(() => {
    if (activeFilter === 'All') return data.projects
    return data.projects.filter(
      (proj) => proj.category.trim().toLowerCase() === activeFilter.toLowerCase()
    )
  }, [data.projects, activeFilter])

  const totalCards = filteredProjects.length

  return (
    <div
      ref={sectionRef}
      className="min-h-screen bg-[#0C0C0C] pt-32 pb-44 px-5 sm:px-8 md:px-10"
    >
      {/* Title */}
      <FadeIn delay={0} y={40} className="mb-10 text-center">
        <h1
          className="hero-heading font-black uppercase leading-none tracking-tight"
          style={{ fontSize: 'clamp(2.5rem, 10vw, 110px)' }}
        >
          Work
        </h1>
        <p className="text-xs text-neutral-500 uppercase tracking-widest mt-3">
          Detailed catalog of client projects and design experiments
        </p>
      </FadeIn>

      {/* Filter Tabs */}
      <FadeIn delay={0.1} y={20} className="flex justify-center gap-3 mb-16">
        {(['All', 'Client', 'Personal'] as const).map((filter) => {
          const isActive = activeFilter === filter
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 cursor-pointer border
                ${isActive ? 'bg-purple-600 border-purple-500 text-white shadow-[0_0_15px_rgba(168,85,247,0.25)]' : 'bg-transparent border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'}`}
            >
              {filter}
            </button>
          )
        })}
      </FadeIn>

      {/* Projects List Container */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-0 min-h-[50vh]">
        {totalCards > 0 ? (
          filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.num + '-' + project.name + '-' + index}
              project={project}
              index={index}
              totalCards={totalCards}
              sectionRef={sectionRef}
            />
          ))
        ) : (
          <FadeIn delay={0.1} y={10} className="text-center py-16">
            <span className="text-neutral-500 uppercase tracking-widest text-sm font-semibold">
              No projects found in this category.
            </span>
          </FadeIn>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage

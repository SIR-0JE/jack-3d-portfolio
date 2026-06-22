import React, { useEffect } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import FadeIn from './FadeIn'
import { ArrowLeft, ExternalLink, ShieldAlert, Award, Hammer, Compass, CheckCircle2 } from 'lucide-react'

interface ProjectDetailPageProps {
  projectNum: string
}

const ProjectDetailPage: React.FC<ProjectDetailPageProps> = ({ projectNum }) => {
  const { data } = usePortfolio()

  // Find the current project
  const projectIndex = data.projects.findIndex((p) => p.num === projectNum)
  const project = data.projects[projectIndex]

  // Scroll to top when loading a project case study
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' as any })
  }, [projectNum])

  if (!project) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col items-center justify-center p-6">
        <ShieldAlert size={64} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold uppercase tracking-widest mb-2">Project Not Found</h2>
        <p className="text-neutral-500 mb-6 text-center max-w-sm">
          The project case study you are looking for does not exist or has been removed.
        </p>
        <button
          onClick={() => { window.location.hash = '#/' }}
          className="flex items-center gap-2 px-6 py-3 rounded-full border border-neutral-700 hover:border-white transition-all text-sm font-semibold uppercase tracking-wider bg-transparent cursor-pointer"
        >
          <ArrowLeft size={16} />
          Go back home
        </button>
      </div>
    )
  }

  // Next / Prev navigation
  const nextProject = data.projects[(projectIndex + 1) % data.projects.length]
  const prevProject = data.projects[(projectIndex - 1 + data.projects.length) % data.projects.length]

  const handleNavigate = (num: string) => {
    window.location.hash = `#/project/${num}`
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-white pt-28 pb-36 px-5 sm:px-8 md:px-12 lg:px-16 overflow-hidden">
      {/* Navigation & Header */}
      <div className="max-w-6xl mx-auto flex items-center justify-between mb-8 sm:mb-12">
        <button
          onClick={() => { window.history.back() }}
          className="group flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
          Back to list
        </button>

        <span className="text-neutral-600 font-mono text-sm tracking-widest">
          PROJECT {project.num} / {data.projects.length.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Case Study Header Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 mb-12 sm:mb-16">
        {/* Left header text */}
        <div className="lg:col-span-8 flex flex-col gap-4">
          <FadeIn delay={0} y={30}>
            <span className="text-purple-400 font-bold uppercase tracking-widest text-xs sm:text-sm">
              {project.category} Case Study
            </span>
          </FadeIn>
          <FadeIn delay={0.1} y={40}>
            <h1
              className="hero-heading font-black uppercase leading-none tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 8vw, 90px)' }}
            >
              {project.name}
            </h1>
          </FadeIn>
          <FadeIn delay={0.2} y={30}>
            <p className="text-neutral-400 text-sm sm:text-base md:text-lg leading-relaxed font-light max-w-2xl mt-2">
              {project.description}
            </p>
          </FadeIn>
        </div>

        {/* Right Project Meta Block */}
        <div className="lg:col-span-4 bg-neutral-900/30 border border-neutral-800/80 p-6 sm:p-8 rounded-[30px] flex flex-col gap-6 self-start z-10">
          <FadeIn delay={0.25} y={20} className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
                <Award size={10} />
                Role
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                {project.role || 'Creator'}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
                <Compass size={10} />
                Category
              </span>
              <span className="text-xs sm:text-sm font-semibold text-neutral-300 uppercase tracking-wide">
                {project.category}
              </span>
            </div>
          </FadeIn>

          <FadeIn delay={0.3} y={20} className="flex flex-col gap-2 border-t border-neutral-800/80 pt-4">
            <span className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold flex items-center gap-1">
              <Hammer size={10} />
              Tools & Technologies
            </span>
            <div className="flex flex-wrap gap-1.5">
              {project.tools && project.tools.length > 0 ? (
                project.tools.map((tool, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2.5 py-1 text-[10px] rounded-md bg-neutral-900 border border-neutral-800 text-neutral-400 uppercase tracking-widest font-mono"
                  >
                    {tool}
                  </span>
                ))
              ) : (
                <span className="text-xs text-neutral-600 font-mono">None specified</span>
              )}
            </div>
          </FadeIn>

          {/* Conditional Action Button */}
          {project.liveUrl ? (
            <FadeIn delay={0.35} y={20} className="border-t border-neutral-800/80 pt-4">
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-full bg-purple-600 border border-purple-500 text-white font-bold uppercase tracking-widest text-xs hover:bg-purple-700 hover:shadow-[0_0_15px_rgba(168,85,247,0.4)] transition-all cursor-pointer"
              >
                Launch Live Project
                <ExternalLink size={14} />
              </a>
            </FadeIn>
          ) : (
            <FadeIn delay={0.35} y={20} className="border-t border-neutral-800/80 pt-4">
              <div className="text-center py-2.5 px-4 rounded-xl bg-neutral-900/40 border border-neutral-800/60 text-neutral-500 text-[10px] uppercase tracking-wider font-bold">
                Project Visual Showcase (Not Live)
              </div>
            </FadeIn>
          )}
        </div>
      </div>

      {/* Primary Visual Showcase Banner */}
      <div className="max-w-6xl mx-auto mb-16 sm:mb-24 z-0 relative">
        <FadeIn delay={0.2} y={50}>
          <div className="w-full h-[40vh] sm:h-[50vh] md:h-[60vh] rounded-[40px] overflow-hidden border border-neutral-800">
            {project.col2img && (
              <img
                src={project.col2img}
                alt={`${project.name} main layout`}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </FadeIn>
      </div>

      {/* Case Study Narrative Sections */}
      <div className="max-w-4xl mx-auto flex flex-col gap-16 sm:gap-24 mb-20 sm:mb-28">
        
        {/* Challenge Section */}
        {project.challenge && (
          <FadeIn delay={0.1} y={30} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-b border-neutral-900 pb-12">
            <div className="md:col-span-4">
              <h2 className="text-[#D7E2EA] text-sm uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                The Challenge
              </h2>
            </div>
            <div className="md:col-span-8 text-neutral-300 font-light text-sm sm:text-base leading-relaxed">
              {project.challenge}
            </div>
          </FadeIn>
        )}

        {/* Mid-Grid Showcase Gallery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full my-4">
          <FadeIn delay={0.1} y={40} className="w-full">
            <div className="rounded-[30px] overflow-hidden border border-neutral-800/40 h-[220px] sm:h-[320px]">
              {project.col1img1 && (
                <img
                  src={project.col1img1}
                  alt="Process highlight 1"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </FadeIn>
          <FadeIn delay={0.2} y={40} className="w-full">
            <div className="rounded-[30px] overflow-hidden border border-neutral-800/40 h-[220px] sm:h-[320px]">
              {project.col1img2 && (
                <img
                  src={project.col1img2}
                  alt="Process highlight 2"
                  className="w-full h-full object-cover"
                />
              )}
            </div>
          </FadeIn>
        </div>

        {/* Process Section */}
        {project.process && (
          <FadeIn delay={0.1} y={30} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10 border-b border-neutral-900 pb-12">
            <div className="md:col-span-4">
              <h2 className="text-[#D7E2EA] text-sm uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                The Process
              </h2>
            </div>
            <div className="md:col-span-8 text-neutral-300 font-light text-sm sm:text-base leading-relaxed">
              {project.process}
            </div>
          </FadeIn>
        )}

        {/* Extra Showcase Images Grid */}
        {project.extraImages && project.extraImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full my-4">
            {project.extraImages.map((img, i) => (
              <FadeIn key={i} delay={0.1 * i} y={30} className="w-full">
                <div className="rounded-[30px] overflow-hidden border border-neutral-800/40 h-[220px] sm:h-[320px]">
                  <img
                    src={img}
                    alt={`Case Study view ${i + 3}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        )}

        {/* Solution & Outcome Section */}
        {project.solution && (
          <FadeIn delay={0.1} y={30} className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-10">
            <div className="md:col-span-4">
              <h2 className="text-[#D7E2EA] text-sm uppercase tracking-widest font-black flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                The Outcome
              </h2>
            </div>
            <div className="md:col-span-8 flex flex-col gap-4 text-neutral-300 font-light text-sm sm:text-base leading-relaxed">
              {project.solution}
              <div className="flex items-center gap-2.5 text-xs text-green-400 font-bold uppercase tracking-wider mt-2 font-mono">
                <CheckCircle2 size={14} /> Success Delivery
              </div>
            </div>
          </FadeIn>
        )}
      </div>

      {/* Case Study Bottom Navigation Footer */}
      <div className="max-w-6xl mx-auto border-t border-neutral-900 pt-10 flex flex-col sm:flex-row gap-6 justify-between items-center text-center">
        <button
          onClick={() => handleNavigate(prevProject.num)}
          className="group flex flex-col items-center sm:items-start gap-1 bg-transparent border-none cursor-pointer"
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Previous Project</span>
          <span className="text-[#D7E2EA] font-bold text-sm sm:text-base group-hover:text-purple-400 transition-colors uppercase">
            &larr; {prevProject.name}
          </span>
        </button>

        <button
          onClick={() => handleNavigate(nextProject.num)}
          className="group flex flex-col items-center sm:items-end gap-1 bg-transparent border-none cursor-pointer"
        >
          <span className="text-[10px] text-neutral-500 uppercase tracking-widest font-bold">Next Project</span>
          <span className="text-[#D7E2EA] font-bold text-sm sm:text-base group-hover:text-purple-400 transition-colors uppercase">
            {nextProject.name} &rarr;
          </span>
        </button>
      </div>
    </div>
  )
}

export default ProjectDetailPage

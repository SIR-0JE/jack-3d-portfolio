import React, { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import type { ProjectData, CaseStudyProject, VisualSnackProject } from '../context/PortfolioContext'
import {
  Lock,
  LogOut,
  Plus,
  Trash2,
  Upload,
  Layers,
  Sliders,
  Briefcase,
  PlusCircle,
  Eye,
  Settings,
  Grid,
  Info,
  CheckCircle
} from 'lucide-react'

// Image uploader / input helper
interface ImageInputProps {
  label: string
  value: string
  onChange: (val: string) => void
}

const ImageInput: React.FC<ImageInputProps> = ({ label, value, onChange }) => {
  const [dragActive, setDragActive] = useState(false)

  const handleFile = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onload = (e) => {
        if (e.target?.result) {
          onChange(e.target.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const isBase64 = value ? value.startsWith('data:image/') : false

  return (
    <div className="flex flex-col gap-2 bg-[#141414] p-4 rounded-xl border border-neutral-800">
      <label className="text-xs font-semibold tracking-wider uppercase text-neutral-400">{label}</label>

      {/* Image Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-700 bg-black group mb-2">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-[10px] text-neutral-300 font-mono tracking-tighter truncate max-w-[90%]">
              {isBase64 ? 'Base64 Local Image' : value}
            </span>
          </div>
        </div>
      )}

      {/* Inputs */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          value={isBase64 ? '' : value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={isBase64 ? '[Local base64 image uploaded - paste URL to overwrite]' : 'Paste Image URL...'}
          className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
        />

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1
            ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/20'}`}
        >
          <Upload size={14} className="text-neutral-500" />
          <span className="text-[10px] text-neutral-400">Drag & drop or click to upload local file</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      </div>
    </div>
  )
}

const AdminPanel: React.FC = () => {
  const {
    data,
    updateHero,
    updateAbout,
    updateService,
    updateProject,
    addProject,
    deleteProject,
    updateMarquee,
    resetToDefault,
  } = usePortfolio()

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('portfolio_authenticated') === 'true'
  })
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')

  // Editing tabs
  const [activeTab, setActiveTab] = useState<'hero' | 'about' | 'services' | 'projects' | 'marquee'>('hero')
  
  // Custom case study editor tab navigation
  const [editingProjectIndex, setEditingProjectIndex] = useState<number | null>(null)
  const [caseStudyTab, setCaseStudyTab] = useState<'context' | 'research' | 'process' | 'features' | 'impact'>('context')

  // Auto save visual prompt state
  const [isSaving, setIsSaving] = useState(false)

  // Trigger brief auto-save indicator
  const triggerAutoSaveIndicator = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
    }, 800)
  }

  // New Project Form state
  const [newProj, setNewProj] = useState<ProjectData>({
    num: '',
    category: 'Civic Tech',
    name: '',
    col1img1: '',
    col1img2: '',
    col2img: '',
    description: '',
    role: 'UI/UX Designer',
    tools: [],
    liveUrl: '',
    template_type: 'casestudy',
    problem_statement: '',
    research_insights: [],
    process_gallery: [],
    solution_features: [],
    success_metrics: [],
  })

  // New Timeline Item State
  const [newTimeline, setNewTimeline] = useState({
    year: '',
    role: '',
    company: '',
    description: '',
  })

  // New Marquee Item State
  const [newMarqueeUrl, setNewMarqueeUrl] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim().toLowerCase() === 'admin' && password === '1234') {
      setIsAuthenticated(true)
      sessionStorage.setItem('portfolio_authenticated', 'true')
      setLoginError('')
    } else {
      setLoginError('Invalid username or password.')
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('portfolio_authenticated')
  }

  const exitAdminMode = () => {
    window.location.hash = ''
  }

  // Handle adding new project
  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newProj.name || !newProj.num) {
      alert('Please fill out at least project name and index number.')
      return
    }
    addProject(newProj)
    triggerAutoSaveIndicator()
    // reset form
    setNewProj({
      num: '',
      category: 'Civic Tech',
      name: '',
      col1img1: '',
      col1img2: '',
      col2img: '',
      description: '',
      role: 'UI/UX Designer',
      tools: [],
      liveUrl: '',
      template_type: 'casestudy',
      problem_statement: '',
      research_insights: [],
      process_gallery: [],
      solution_features: [],
      success_metrics: [],
    })
  }

  // Handle adding timeline milestones
  const handleAddTimelineSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTimeline.year || !newTimeline.role || !newTimeline.company) {
      alert('Please fill out Year, Role, and Company fields.')
      return
    }
    updateAbout({
      timeline: [...(data.about.timeline || []), newTimeline],
    })
    triggerAutoSaveIndicator()
    setNewTimeline({
      year: '',
      role: '',
      company: '',
      description: '',
    })
  }

  const handleDeleteTimelineItem = (idx: number) => {
    updateAbout({
      timeline: data.about.timeline.filter((_, i) => i !== idx),
    })
    triggerAutoSaveIndicator()
  }

  const addMarqueeItem = () => {
    if (newMarqueeUrl) {
      updateMarquee([...data.marquee, newMarqueeUrl])
      setNewMarqueeUrl('')
      triggerAutoSaveIndicator()
    }
  }

  const deleteMarqueeItem = (idx: number) => {
    updateMarquee(data.marquee.filter((_, i) => i !== idx))
    triggerAutoSaveIndicator()
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex items-center justify-center p-6 font-sans">
        <form onSubmit={handleLogin} className="w-full max-w-md bg-[#111] border border-neutral-800 p-8 rounded-[40px] flex flex-col gap-6 shadow-2xl">
          <div className="flex flex-col gap-2 items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-bold uppercase tracking-widest text-white mt-2">Design Console</h1>
            <p className="text-xs text-neutral-500">Authentication required to customize portfolio tokens.</p>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="admin"
                className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500"
                required
              />
            </div>
          </div>

          {loginError && (
            <span className="text-red-400 text-xs text-center font-semibold bg-red-950/20 border border-red-900/30 py-2.5 rounded-xl">
              {loginError}
            </span>
          )}

          <button
            type="submit"
            className="w-full py-3.5 bg-purple-600 border border-purple-500 hover:bg-purple-700 text-white text-xs font-bold uppercase tracking-widest rounded-full transition-all cursor-pointer"
          >
            Access Dashboard
          </button>

          <button
            type="button"
            onClick={exitAdminMode}
            className="text-xs text-neutral-500 hover:text-neutral-300 text-center transition-colors cursor-pointer"
          >
            Go Back to Portfolio
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0C0C0C] text-[#D7E2EA] flex flex-col font-sans">
      
      {/* Top Header */}
      <header className="fixed top-0 left-0 w-full bg-[#111] border-b border-neutral-800 px-6 py-4 flex justify-between items-center z-40">
        <div className="flex items-center gap-3">
          <span className="text-base sm:text-lg font-black uppercase tracking-tight text-white">Niyi.Dashboard</span>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[10px] text-neutral-400 font-mono">
            {isSaving ? (
              <span className="flex items-center gap-1.5 text-purple-400">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
                Auto-saving...
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-green-400">
                <CheckCircle size={10} />
                Synced to LocalStorage
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={exitAdminMode}
            className="flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 hover:border-neutral-700 rounded-full text-xs font-semibold uppercase tracking-wider text-neutral-300 cursor-pointer transition-colors"
          >
            <Eye size={12} />
            View Site
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 bg-red-950/20 hover:bg-red-950/40 border border-red-900/30 rounded-full text-xs font-semibold uppercase tracking-wider text-red-400 cursor-pointer transition-colors"
          >
            <LogOut size={12} />
            Exit
          </button>
        </div>
      </header>

      {/* Main layout wrapper */}
      <div className="flex-1 flex pt-[73px]">
        {/* Left Sidebar navigation */}
        <aside className="w-64 bg-[#0E0E0E] border-r border-neutral-800 p-6 flex flex-col gap-2 h-[calc(100vh-73px)] fixed left-0 top-[73px] z-30">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 px-3 mb-2">Sections</span>
          
          {(['hero', 'about', 'services', 'projects', 'marquee'] as const).map((tab) => {
            const isActive = activeTab === tab
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab)
                  setEditingProjectIndex(null)
                }}
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none text-left
                  ${isActive ? 'bg-purple-600 text-white font-black shadow-[0_0_15px_rgba(168,85,247,0.15)]' : 'bg-transparent text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
              >
                {tab === 'hero' && <Grid size={14} />}
                {tab === 'about' && <Info size={14} />}
                {tab === 'services' && <Sliders size={14} />}
                {tab === 'projects' && <Briefcase size={14} />}
                {tab === 'marquee' && <Settings size={14} />}
                {tab}
              </button>
            )
          })}

          <div className="mt-auto border-t border-neutral-900 pt-4 px-3 flex flex-col gap-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all details back to Niyi UI default template values?')) {
                  resetToDefault()
                  triggerAutoSaveIndicator()
                }
              }}
              className="text-[10px] text-neutral-500 hover:text-red-400 transition-colors uppercase tracking-widest font-bold bg-transparent border-none text-left cursor-pointer"
            >
              Reset to Defaults
            </button>
          </div>
        </aside>

        {/* Right content view area */}
        <main className="flex-1 min-h-[calc(100vh-73px)] pl-64 p-8 bg-[#0C0C0C]">
          
          {/* HERO SECTION EDITING */}
          {activeTab === 'hero' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Hero Specs</h2>
                <p className="text-xs text-neutral-500">Edit the hook message, subtitles, and magnetic face-swap portraits.</p>
              </div>

              <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Headline</label>
                  <textarea
                    value={data.hero.title}
                    onChange={(e) => {
                      updateHero({ title: e.target.value })
                      triggerAutoSaveIndicator()
                    }}
                    rows={2}
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Subtitle Spec</label>
                  <input
                    type="text"
                    value={data.hero.subtitle}
                    onChange={(e) => {
                      updateHero({ subtitle: e.target.value })
                      triggerAutoSaveIndicator()
                    }}
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ImageInput
                    label="Neutral Face Portrait"
                    value={data.hero.portrait}
                    onChange={(val) => {
                      updateHero({ portrait: val })
                      triggerAutoSaveIndicator()
                    }}
                  />
                  <ImageInput
                    label="Hover Smiling Face Portrait"
                    value={data.hero.portraitHover}
                    onChange={(val) => {
                      updateHero({ portraitHover: val })
                      triggerAutoSaveIndicator()
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ABOUT SECTION EDITING */}
          {activeTab === 'about' && (
            <div className="flex flex-col gap-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">About & Journey</h2>
                <p className="text-xs text-neutral-500">Edit Niyi's bio narrative, decorative details, and timeline journeyman records.</p>
              </div>

              <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Bio Description</label>
                  <textarea
                    value={data.about.description}
                    onChange={(e) => {
                      updateAbout({ description: e.target.value })
                      triggerAutoSaveIndicator()
                    }}
                    rows={4}
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 resize-none font-sans"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Capabilities (Comma separated)</label>
                  <input
                    type="text"
                    value={data.about.skills.join(', ')}
                    onChange={(e) => {
                      updateAbout({
                        skills: e.target.value.split(',').map((s) => s.trim()).filter(Boolean),
                      })
                      triggerAutoSaveIndicator()
                    }}
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Journey timeline */}
              <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3">Journey timeline</h3>
                <div className="flex flex-col gap-4">
                  {data.about.timeline.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#0C0C0C] p-4 rounded-xl border border-neutral-800">
                      <div>
                        <span className="text-xs text-purple-400 font-bold">{item.year}</span>
                        <h4 className="text-sm font-bold text-white uppercase">{item.role} at {item.company}</h4>
                      </div>
                      <button
                        onClick={() => handleDeleteTimelineItem(idx)}
                        className="text-red-500 hover:text-red-400 text-xs bg-transparent border-none cursor-pointer uppercase tracking-wider font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>

                {/* Form to add timeline */}
                <form onSubmit={handleAddTimelineSubmit} className="flex flex-col gap-4 border-t border-neutral-800 pt-4 mt-2">
                  <div className="grid grid-cols-3 gap-4">
                    <input
                      type="text"
                      placeholder="Year (e.g. 2024 - Present)"
                      value={newTimeline.year}
                      onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200"
                    />
                    <input
                      type="text"
                      placeholder="Role (e.g. Lead Designer)"
                      value={newTimeline.role}
                      onChange={(e) => setNewTimeline({ ...newTimeline, role: e.target.value })}
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200"
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={newTimeline.company}
                      onChange={(e) => setNewTimeline({ ...newTimeline, company: e.target.value })}
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200"
                    />
                  </div>
                  <textarea
                    placeholder="Short description of achievements..."
                    value={newTimeline.description}
                    onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                    rows={2}
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 resize-none font-sans"
                  />
                  <button type="submit" className="self-end py-2 px-6 bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase tracking-wider rounded-lg">
                    Add Milestone
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* PROJECTS SECTION EDITING */}
          {activeTab === 'projects' && (
            <div className="flex flex-col gap-6 max-w-5xl">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Projects & Spec Templates</h2>
                <p className="text-xs text-neutral-500">Configure case studies or visual designs here. Autosaver tracks changes live.</p>
              </div>

              {editingProjectIndex === null ? (
                // Project Listing in Dashboard
                <div className="flex flex-col gap-4">
                  {data.projects.map((proj, idx) => (
                    <div key={idx} className="bg-[#111] p-5 rounded-2xl border border-neutral-800 flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <span className="text-base font-black text-neutral-500">{proj.num}</span>
                        <div>
                          <h3 className="text-base font-bold text-white uppercase tracking-tight">{proj.name}</h3>
                          <span className="px-2.5 py-0.5 rounded-full bg-purple-600/10 border border-purple-500/20 text-[9px] uppercase tracking-widest text-purple-400 font-bold font-mono">
                            {proj.template_type === 'casestudy' ? 'Deep Case Study' : 'Visual Snack'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setEditingProjectIndex(idx)}
                          className="px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-xs font-bold uppercase hover:bg-neutral-800 text-white cursor-pointer transition-colors"
                        >
                          Edit Content & Tabs
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm('Delete this project?')) deleteProject(idx)
                          }}
                          className="p-2 rounded-lg bg-red-950/20 border border-red-900/30 hover:bg-red-950/40 text-red-400 cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Add project block */}
                  <div className="bg-[#111] p-6 rounded-[30px] border border-neutral-800 flex flex-col gap-4 mt-4">
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
                      <PlusCircle size={16} />
                      Create New Project
                    </h3>
                    <form onSubmit={handleAddProjectSubmit} className="flex flex-col gap-4">
                      {/* Master Switch */}
                      <div className="grid grid-cols-2 gap-4 bg-[#0C0C0C] p-2.5 rounded-2xl border border-neutral-800">
                        <button
                          type="button"
                          onClick={() => setNewProj({ ...newProj, template_type: 'casestudy' })}
                          className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none
                            ${newProj.template_type === 'casestudy' ? 'bg-purple-600 text-white' : 'bg-transparent text-neutral-400'}`}
                        >
                          Deep Case Study
                        </button>
                        <button
                          type="button"
                          onClick={() => setNewProj({ ...newProj, template_type: 'visual' })}
                          className={`py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer border-none
                            ${newProj.template_type === 'visual' ? 'bg-purple-600 text-white' : 'bg-transparent text-neutral-400'}`}
                        >
                          Visual Snack
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <input
                          type="text"
                          placeholder="Order Index (e.g. 03)"
                          value={newProj.num}
                          onChange={(e) => setNewProj({ ...newProj, num: e.target.value })}
                          className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200"
                          required
                        />
                        <input
                          type="text"
                          placeholder="Category tag (e.g. Civic Tech)"
                          value={newProj.category}
                          onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                          className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200"
                        />
                        <input
                          type="text"
                          placeholder="Project Name"
                          value={newProj.name}
                          onChange={(e) => setNewProj({ ...newProj, name: e.target.value })}
                          className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200"
                          required
                        />
                      </div>

                      <textarea
                        placeholder="Core brief context details..."
                        value={newProj.description}
                        onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                        rows={2}
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 resize-none font-sans"
                      />

                      <button type="submit" className="py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold uppercase tracking-wider text-xs rounded-xl cursor-pointer">
                        Insert Project
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                // SPECIFIC INDIVIDUAL PROJECT EDITOR VIEW (TABS & FIELDS)
                (() => {
                  const proj = data.projects[editingProjectIndex]
                  const isCaseStudy = proj.template_type === 'casestudy'

                  return (
                    <div className="bg-[#111] p-6 sm:p-8 rounded-[40px] border border-neutral-800 flex flex-col gap-6">
                      <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
                        <button
                          onClick={() => setEditingProjectIndex(null)}
                          className="text-xs text-neutral-500 hover:text-white uppercase tracking-widest font-bold bg-transparent border-none cursor-pointer"
                        >
                          &larr; Back to list
                        </button>
                        <h3 className="text-base font-bold text-white uppercase tracking-tight">
                          Editing: {proj.name} ({isCaseStudy ? 'Case Study' : 'Visual Snack'})
                        </h3>
                      </div>

                      {/* General Setup fields */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 bg-[#0C0C0C] p-5 rounded-2xl border border-neutral-800">
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Category</label>
                          <input
                            type="text"
                            value={proj.category}
                            onChange={(e) => {
                              updateProject(editingProjectIndex, { category: e.target.value })
                              triggerAutoSaveIndicator()
                            }}
                            className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Name</label>
                          <input
                            type="text"
                            value={proj.name}
                            onChange={(e) => {
                              updateProject(editingProjectIndex, { name: e.target.value })
                              triggerAutoSaveIndicator()
                            }}
                            className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Role</label>
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => {
                              updateProject(editingProjectIndex, { role: e.target.value })
                              triggerAutoSaveIndicator()
                            }}
                            className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold">Live URL</label>
                          <input
                            type="text"
                            value={proj.liveUrl}
                            onChange={(e) => {
                              updateProject(editingProjectIndex, { liveUrl: e.target.value })
                              triggerAutoSaveIndicator()
                            }}
                            className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                          />
                        </div>
                      </div>

                      {/* --- CONDITIONAL CASE STUDY VIEW TABS --- */}
                      {isCaseStudy ? (
                        (() => {
                          const cs = proj as CaseStudyProject
                          return (
                            <div className="flex flex-col gap-6">
                              {/* Sub tab navigation */}
                              <div className="flex border-b border-neutral-800 gap-1.5 pb-2 overflow-x-auto">
                                {(['context', 'research', 'process', 'features', 'impact'] as const).map((tab) => {
                                  const isActive = caseStudyTab === tab
                                  return (
                                    <button
                                      key={tab}
                                      onClick={() => setCaseStudyTab(tab)}
                                      className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer bg-transparent border-none transition-colors
                                        ${isActive ? 'text-purple-400 bg-purple-500/10' : 'text-neutral-500 hover:text-white'}`}
                                    >
                                      {tab}
                                    </button>
                                  )
                                })}
                              </div>

                              {caseStudyTab === 'context' && (
                                <div className="flex flex-col gap-4">
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Brief Overview Description</label>
                                    <textarea
                                      value={cs.description}
                                      onChange={(e) => {
                                        updateProject(editingProjectIndex, { description: e.target.value })
                                        triggerAutoSaveIndicator()
                                      }}
                                      rows={3}
                                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 resize-none font-sans"
                                    />
                                  </div>
                                  <div className="flex flex-col gap-1">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Problem Statement</label>
                                    <textarea
                                      value={cs.problem_statement || ''}
                                      onChange={(e) => {
                                        updateProject(editingProjectIndex, { problem_statement: e.target.value })
                                        triggerAutoSaveIndicator()
                                      }}
                                      rows={3}
                                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 resize-none font-sans"
                                    />
                                  </div>
                                </div>
                              )}

                              {caseStudyTab === 'research' && (
                                <div className="flex flex-col gap-4">
                                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Research Insights (One per line)</label>
                                  <textarea
                                    value={cs.research_insights ? cs.research_insights.join('\n') : ''}
                                    onChange={(e) => {
                                      updateProject(editingProjectIndex, {
                                        research_insights: e.target.value.split('\n').filter(Boolean)
                                      })
                                      triggerAutoSaveIndicator()
                                    }}
                                    rows={5}
                                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 font-sans"
                                    placeholder="e.g. 70% of respondents browse civic info exclusively via mobile viewports."
                                  />
                                </div>
                              )}

                              {caseStudyTab === 'process' && (
                                <div className="flex flex-col gap-4">
                                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Process Gallery Images</label>
                                  <div className="flex flex-wrap gap-2 mb-4">
                                    {(cs.process_gallery || []).map((img, pgIdx) => (
                                      <div key={pgIdx} className="relative group w-20 h-20 rounded-lg overflow-hidden border border-neutral-800">
                                        <img src={img} className="w-full h-full object-cover" />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const list = [...(cs.process_gallery || [])]
                                            list.splice(pgIdx, 1)
                                            updateProject(editingProjectIndex, { process_gallery: list })
                                            triggerAutoSaveIndicator()
                                          }}
                                          className="absolute inset-0 bg-red-600/80 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-xs font-bold"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                    <div className="w-20 h-20 rounded-lg border border-dashed border-neutral-700 hover:border-purple-500 transition-colors flex items-center justify-center relative cursor-pointer overflow-hidden">
                                      <label className="flex flex-col items-center justify-center w-full h-full text-[10px] text-neutral-500 hover:text-purple-400 cursor-pointer">
                                        <span>+ Upload</span>
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => {
                                            const file = e.target.files?.[0]
                                            if (file) {
                                              const reader = new FileReader()
                                              reader.onloadend = () => {
                                                updateProject(editingProjectIndex, {
                                                  process_gallery: [...(cs.process_gallery || []), reader.result as string]
                                                })
                                                triggerAutoSaveIndicator()
                                              }
                                              reader.readAsDataURL(file)
                                            }
                                          }}
                                          className="hidden"
                                        />
                                      </label>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <ImageInput
                                      label="Thumbnail 1 Image"
                                      value={cs.col1img1}
                                      onChange={(val) => {
                                        updateProject(editingProjectIndex, { col1img1: val })
                                        triggerAutoSaveIndicator()
                                      }}
                                    />
                                    <ImageInput
                                      label="Thumbnail 2 Image"
                                      value={cs.col1img2}
                                      onChange={(val) => {
                                        updateProject(editingProjectIndex, { col1img2: val })
                                        triggerAutoSaveIndicator()
                                      }}
                                    />
                                  </div>
                                </div>
                              )}

                              {caseStudyTab === 'features' && (
                                <div className="flex flex-col gap-4">
                                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">High-Fi Key Features</label>
                                  <div className="flex flex-col gap-4">
                                    {(cs.solution_features || []).map((feat, fIdx) => (
                                      <div key={fIdx} className="bg-[#0C0C0C] p-4 rounded-xl border border-neutral-800 flex justify-between items-center gap-4">
                                        <div className="flex-1 flex flex-col gap-1">
                                          <span className="text-white text-xs font-bold uppercase">{feat.title}</span>
                                          <span className="text-[10px] text-neutral-400 font-light leading-relaxed">{feat.description}</span>
                                        </div>
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const list = [...(cs.solution_features || [])]
                                            list.splice(fIdx, 1)
                                            updateProject(editingProjectIndex, { solution_features: list })
                                            triggerAutoSaveIndicator()
                                          }}
                                          className="text-red-500 hover:text-red-400 font-bold uppercase text-[10px] bg-transparent border-none cursor-pointer"
                                        >
                                          Remove
                                        </button>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Quick inline feature input block */}
                                  <div className="border border-neutral-800 p-4 rounded-xl mt-2 flex flex-col gap-3">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">+ New Feature Block</span>
                                    <div className="grid grid-cols-2 gap-3">
                                      <input
                                        type="text"
                                        id="new-feat-title"
                                        placeholder="Feature Title..."
                                        className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                                      />
                                      <input
                                        type="text"
                                        id="new-feat-desc"
                                        placeholder="Feature Description..."
                                        className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                                      />
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const titleEl = document.getElementById('new-feat-title') as HTMLInputElement
                                        const descEl = document.getElementById('new-feat-desc') as HTMLInputElement
                                        if (titleEl && descEl && titleEl.value) {
                                          updateProject(editingProjectIndex, {
                                            solution_features: [
                                              ...(cs.solution_features || []),
                                              {
                                                title: titleEl.value,
                                                description: descEl.value,
                                                image_url: cs.col2img // link to main cover by default
                                              }
                                            ]
                                          })
                                          triggerAutoSaveIndicator()
                                          titleEl.value = ''
                                          descEl.value = ''
                                        }
                                      }}
                                      className="self-end py-1.5 px-4 bg-purple-600 hover:bg-purple-500 text-white rounded text-[10px] font-bold uppercase"
                                    >
                                      Add Feature
                                    </button>
                                  </div>
                                </div>
                              )}

                              {caseStudyTab === 'impact' && (
                                <div className="flex flex-col gap-4">
                                  <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Success Metrics (One per line)</label>
                                    <textarea
                                      value={cs.success_metrics ? cs.success_metrics.join('\n') : ''}
                                      onChange={(e) => {
                                        updateProject(editingProjectIndex, {
                                          success_metrics: e.target.value.split('\n').filter(Boolean)
                                        })
                                        triggerAutoSaveIndicator()
                                      }}
                                      rows={4}
                                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 font-sans"
                                      placeholder="e.g. 📈 Increased voter registration turnout by 40%."
                                    />
                                  </div>

                                  <div className="flex flex-col gap-2 border-t border-neutral-800/80 pt-4 mt-2">
                                    <ImageInput
                                      label="Main Case Study Cover Image"
                                      value={cs.col2img}
                                      onChange={(val) => {
                                        updateProject(editingProjectIndex, { col2img: val })
                                        triggerAutoSaveIndicator()
                                      }}
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })()
                      ) : (
                        // --- CONDITIONAL VISUAL SNACK VIEW EDITOR ---
                        (() => {
                          const vs = proj as VisualSnackProject
                          return (
                            <div className="flex flex-col gap-6">
                              <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Brief Context details</label>
                                <textarea
                                  value={vs.brief_context || vs.description}
                                  onChange={(e) => {
                                    updateProject(editingProjectIndex, {
                                      brief_context: e.target.value,
                                      description: e.target.value
                                    })
                                    triggerAutoSaveIndicator()
                                  }}
                                  rows={3}
                                  className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-xs text-neutral-200 resize-none font-sans"
                                  placeholder="Evaluating responsive colors against ambient neon lighting..."
                                />
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Left Visual main asset uploader */}
                                <ImageInput
                                  label="Main Snack Mockup Visual (Media Asset)"
                                  value={vs.media_url || vs.col2img}
                                  onChange={(val) => {
                                    updateProject(editingProjectIndex, {
                                      media_url: val,
                                      col2img: val
                                    })
                                    triggerAutoSaveIndicator()
                                  }}
                                />

                                {/* Right Design System Builder */}
                                <div className="flex flex-col gap-4 p-5 bg-[#0C0C0C] border border-neutral-800 rounded-2xl">
                                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-1.5">
                                    <Sliders size={12} />
                                    Design Swatches Builder
                                  </span>

                                  {/* Swatch color row */}
                                  <div className="flex flex-col gap-2">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Colors Swatches</span>
                                    <div className="flex flex-wrap gap-2.5">
                                      {(vs.design_system?.colors || []).map((col, idx) => (
                                        <div key={idx} className="flex items-center gap-1.5 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md relative group">
                                          <span 
                                            className="w-3.5 h-3.5 rounded-full border border-white/10"
                                            style={{ backgroundColor: col }}
                                          />
                                          <span className="text-[9px] font-mono">{col}</span>
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const colorsList = [...(vs.design_system?.colors || [])]
                                              colorsList.splice(idx, 1)
                                              updateProject(editingProjectIndex, {
                                                design_system: {
                                                  colors: colorsList,
                                                  typography: vs.design_system?.typography || []
                                                }
                                              })
                                              triggerAutoSaveIndicator()
                                            }}
                                            className="text-red-500 hover:text-red-400 font-bold ml-1 text-[9px] bg-transparent border-none cursor-pointer"
                                          >
                                            x
                                          </button>
                                        </div>
                                      ))}
                                      
                                      {/* Add Color swatches inline block */}
                                      <div className="flex items-center gap-1.5">
                                        <input
                                          type="color"
                                          id="color-picker-input"
                                          defaultValue="#8B5CF6"
                                          className="w-6 h-6 rounded border-none bg-transparent cursor-pointer"
                                        />
                                        <button
                                          type="button"
                                          onClick={() => {
                                            const picker = document.getElementById('color-picker-input') as HTMLInputElement
                                            if (picker) {
                                              const colorsList = [...(vs.design_system?.colors || [])]
                                              colorsList.push(picker.value)
                                              updateProject(editingProjectIndex, {
                                                design_system: {
                                                  colors: colorsList,
                                                  typography: vs.design_system?.typography || []
                                                }
                                              })
                                              triggerAutoSaveIndicator()
                                            }
                                          }}
                                          className="px-2 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 rounded text-[9px] font-bold uppercase cursor-pointer"
                                        >
                                          + Add
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Swatch fonts row */}
                                  <div className="flex flex-col gap-2 mt-2">
                                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Typography Fonts (Comma separated)</span>
                                    <input
                                      type="text"
                                      value={vs.design_system?.typography ? vs.design_system.typography.join(', ') : ''}
                                      onChange={(e) => {
                                        updateProject(editingProjectIndex, {
                                          design_system: {
                                            colors: vs.design_system?.colors || [],
                                            typography: e.target.value.split(',').map((t) => t.trim()).filter(Boolean)
                                          }
                                        })
                                        triggerAutoSaveIndicator()
                                      }}
                                      placeholder="e.g. Kanit Black, Inter Medium"
                                      className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })()
                      )}
                    </div>
                  )
                })()
              )}
            </div>
          )}

          {/* SERVICES EDITING */}
          {activeTab === 'services' && (
            <div className="flex flex-col gap-6 max-w-3xl">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Services & Focus Capabilities</h2>
                <p className="text-xs text-neutral-500">Edit the structural services listings displayed on the homepage price/service grid.</p>
              </div>

              <div className="flex flex-col gap-6">
                {data.services.map((service, index) => (
                  <div key={index} className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Index (e.g. 01)</label>
                        <input
                          type="text"
                          value={service.num}
                          onChange={(e) => {
                            updateService(index, { num: e.target.value })
                            triggerAutoSaveIndicator()
                          }}
                          className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                        />
                      </div>
                      <div className="flex flex-col gap-1 col-span-2">
                        <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Name</label>
                        <input
                          type="text"
                          value={service.name}
                          onChange={(e) => {
                            updateService(index, { name: e.target.value })
                            triggerAutoSaveIndicator()
                          }}
                          className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Description</label>
                      <textarea
                        value={service.desc}
                        onChange={(e) => {
                          updateService(index, { desc: e.target.value })
                          triggerAutoSaveIndicator()
                        }}
                        rows={2}
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 resize-none font-sans"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MARQUEE SECTION EDITING */}
          {activeTab === 'marquee' && (
            <div className="flex flex-col gap-6 max-w-4xl">
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Marquee Image Board</h2>
                <p className="text-xs text-neutral-500">Edit the GIF resources running on horizontal marquee strips.</p>
              </div>

              <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-widest mb-1">Add Image to Marquee</h3>
                <div className="flex flex-col gap-3">
                  <ImageInput
                    label="New Marquee Image Source"
                    value={newMarqueeUrl}
                    onChange={(val) => setNewMarqueeUrl(val)}
                  />
                  <button
                    onClick={addMarqueeItem}
                    disabled={!newMarqueeUrl}
                    className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-40 disabled:hover:bg-purple-600 text-white font-semibold uppercase tracking-widest text-xs py-3.5 rounded-xl cursor-pointer transition-colors"
                  >
                    <Plus size={14} />
                    Add to Marquee Board
                  </button>
                </div>
              </div>

              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mt-4">Current Images ({data.marquee.length})</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {data.marquee.map((src, index) => (
                  <div key={index} className="relative rounded-xl overflow-hidden border border-neutral-800 bg-neutral-900 group aspect-video">
                    <img src={src} alt={`Marquee item ${index}`} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2">
                      <button
                        onClick={() => deleteMarqueeItem(index)}
                        className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg flex items-center justify-center cursor-pointer transition-colors"
                        title="Remove Image"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <span className="absolute bottom-2 left-2 bg-black/80 px-2 py-0.5 rounded text-[10px] text-neutral-400 font-mono">
                      #{index + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default AdminPanel

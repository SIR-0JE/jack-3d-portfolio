import React, { useState } from 'react'
import { usePortfolio } from '../context/PortfolioContext'
import type { ProjectData } from '../context/PortfolioContext'
import {
  Lock,
  LogOut,
  ExternalLink,
  Plus,
  Trash2,
  Upload,
  Layers,
  Info,
  Sliders,
  Briefcase,
  FileImage,
  RefreshCw,
  PlusCircle,
  Eye,
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

  const isBase64 = value.startsWith('data:image/')

  return (
    <div className="flex flex-col gap-2 bg-[#141414] p-4 rounded-xl border border-neutral-800">
      <label className="text-sm font-semibold tracking-wider uppercase text-neutral-400">{label}</label>

      {/* Image Preview */}
      {value && (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-neutral-700 bg-black group mb-2">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-xs text-neutral-300 font-mono tracking-tighter truncate max-w-[90%]">
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
          className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
        />

        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-3 text-center transition-colors cursor-pointer flex flex-col items-center justify-center gap-1
            ${dragActive ? 'border-purple-500 bg-purple-500/10' : 'border-neutral-800 hover:border-neutral-700 hover:bg-neutral-800/20'}`}
        >
          <Upload size={16} className="text-neutral-500" />
          <span className="text-xs text-neutral-400">Drag & drop or click to upload local file</span>
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

  // New Project Form state
  const [newProj, setNewProj] = useState<ProjectData>({
    num: '',
    category: 'Client',
    name: '',
    col1img1: '',
    col1img2: '',
    col2img: '',
    description: '',
    role: '',
    tools: [],
    liveUrl: '',
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
    // reset form
    setNewProj({
      num: '',
      category: 'Client',
      name: '',
      col1img1: '',
      col1img2: '',
      col2img: '',
      description: '',
      role: '',
      tools: [],
      liveUrl: '',
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
  }

  // Handle marquee operations
  const addMarqueeItem = () => {
    if (newMarqueeUrl.trim()) {
      updateMarquee([...data.marquee, newMarqueeUrl.trim()])
      setNewMarqueeUrl('')
    }
  }

  const deleteMarqueeItem = (idx: number) => {
    updateMarquee(data.marquee.filter((_, i) => i !== idx))
  }

  // Login view
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0C0C0C] flex flex-col items-center justify-center font-sans px-4">
        <div className="w-full max-w-md bg-[#111] border border-neutral-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Glass background details */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-600/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-600/20 rounded-full blur-3xl" />

          <div className="flex flex-col items-center gap-2 mb-8 relative">
            <div className="w-12 h-12 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-center">
              <Lock size={20} className="text-neutral-300" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase mt-2">Portfolio Admin</h1>
            <p className="text-xs text-neutral-500 uppercase tracking-widest">Sign in to edit portfolio details</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4 relative">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-xs px-4 py-3 rounded-lg text-center font-medium">
                {loginError}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. admin"
                className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••"
                className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 bg-white hover:bg-neutral-200 text-[#0C0C0C] font-semibold uppercase tracking-widest text-xs py-4 rounded-xl cursor-pointer transition-all duration-200 hover:scale-[1.01]"
            >
              Authenticate
            </button>
          </form>

          <button
            onClick={exitAdminMode}
            className="w-full mt-4 flex items-center justify-center gap-2 border border-neutral-800 hover:bg-neutral-900/50 text-neutral-400 text-xs uppercase tracking-widest py-3 rounded-xl cursor-pointer transition-colors"
          >
            <Eye size={12} />
            View Live Portfolio
          </button>
        </div>
      </div>
    )
  }

  // Dashboard View
  return (
    <div className="min-h-screen bg-[#0C0C0C] font-sans flex text-neutral-200">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-neutral-800 flex flex-col justify-between flex-shrink-0 bg-[#0E0E0E]">
        <div>
          {/* Header */}
          <div className="p-6 border-b border-neutral-800 flex items-center justify-between">
            <div>
              <h1 className="font-bold text-white text-lg tracking-tight uppercase">Admin Panel</h1>
              <p className="text-[10px] text-neutral-500 uppercase tracking-widest font-semibold">Active Session</p>
            </div>
            <button
              onClick={exitAdminMode}
              title="View Live Site"
              className="p-2 hover:bg-neutral-800 rounded-lg text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <ExternalLink size={16} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 flex flex-col gap-1">
            <button
              onClick={() => setActiveTab('hero')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors uppercase tracking-wider cursor-pointer text-left
                ${activeTab === 'hero' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Sliders size={16} />
              Hero Section
            </button>

            <button
              onClick={() => setActiveTab('about')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors uppercase tracking-wider cursor-pointer text-left
                ${activeTab === 'about' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Info size={16} />
              About Section
            </button>

            <button
              onClick={() => setActiveTab('services')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors uppercase tracking-wider cursor-pointer text-left
                ${activeTab === 'services' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Layers size={16} />
              Services list
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors uppercase tracking-wider cursor-pointer text-left
                ${activeTab === 'projects' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <Briefcase size={16} />
              Projects
            </button>

            <button
              onClick={() => setActiveTab('marquee')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors uppercase tracking-wider cursor-pointer text-left
                ${activeTab === 'marquee' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-900'}`}
            >
              <FileImage size={16} />
              Marquee Images
            </button>
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-neutral-800 flex flex-col gap-2">
          <button
            onClick={() => {
              if (window.confirm('Restore default design template? All local changes will be lost.')) {
                resetToDefault()
              }
            }}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-neutral-800 hover:bg-neutral-900 text-xs font-semibold uppercase tracking-wider text-neutral-400 hover:text-white rounded-xl cursor-pointer transition-colors"
          >
            <RefreshCw size={12} />
            Reset Default
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full px-4 py-2 border border-red-900/30 hover:bg-red-950/20 text-xs font-semibold uppercase tracking-wider text-red-400 hover:text-red-300 rounded-xl cursor-pointer transition-colors"
          >
            <LogOut size={12} />
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <main className="flex-1 p-8 overflow-y-auto max-w-4xl">
        {/* HERO SECTION EDITING */}
        {activeTab === 'hero' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Hero Section Editor</h2>
              <p className="text-xs text-neutral-500">Modify the text, visual, and layout details for the main hero landing view.</p>
            </div>

            <div className="flex flex-col gap-4 bg-[#111] p-6 rounded-2xl border border-neutral-800">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Headline Text</label>
                <input
                  type="text"
                  value={data.hero.title}
                  onChange={(e) => updateHero({ title: e.target.value })}
                  placeholder="Hi, i'm jack"
                  className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Subtext Description</label>
                <textarea
                  value={data.hero.subtitle}
                  onChange={(e) => updateHero({ subtitle: e.target.value })}
                  placeholder="a 3d creator driven by crafting striking and unforgettable projects"
                  rows={3}
                  className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans resize-none"
                />
              </div>

              <ImageInput
                label="Hero Portrait Image"
                value={data.hero.portrait}
                onChange={(val) => updateHero({ portrait: val })}
              />

              <ImageInput
                label="Hero Portrait Hover (Smiling)"
                value={data.hero.portraitHover || ''}
                onChange={(val) => updateHero({ portraitHover: val })}
              />
            </div>
          </div>
        )}

        {/* ABOUT SECTION EDITING */}
        {activeTab === 'about' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">About Section Editor</h2>
              <p className="text-xs text-neutral-500">Edit content and the absolute positioned corner decorative 3D assets.</p>
            </div>

            <div className="flex flex-col gap-4 bg-[#111] p-6 rounded-2xl border border-neutral-800">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Section Title</label>
                <input
                  type="text"
                  value={data.about.title}
                  onChange={(e) => updateAbout({ title: e.target.value })}
                  placeholder="About me"
                  className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Animated Paragraph (Character Reveal)</label>
                <textarea
                  value={data.about.description}
                  onChange={(e) => updateAbout({ description: e.target.value })}
                  placeholder="With more than five years of experience..."
                  rows={5}
                  className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans resize-none"
                />
              </div>
            </div>

            <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mt-4 mb-2">Corner Decor Images</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ImageInput
                label="Top-Left (Moon Icon)"
                value={data.about.decorMoon}
                onChange={(val) => updateAbout({ decorMoon: val })}
              />
              <ImageInput
                label="Top-Right (Lego Icon)"
                value={data.about.decorLego}
                onChange={(val) => updateAbout({ decorLego: val })}
              />
              <ImageInput
                label="Bottom-Left (3D object)"
                value={data.about.decorP59}
                onChange={(val) => updateAbout({ decorP59: val })}
              />
              <ImageInput
                label="Bottom-Right (3D Group)"
                value={data.about.decorGroup}
                onChange={(val) => updateAbout({ decorGroup: val })}
              />
            </div>

            {/* Skills List Editor */}
            <div className="flex flex-col gap-4 bg-[#111] p-6 rounded-2xl border border-neutral-800 mt-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3">
                Skills & Capabilities
              </h3>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Skills (Comma separated list)
                </label>
                <input
                  type="text"
                  value={data.about.skills ? data.about.skills.join(', ') : ''}
                  onChange={(e) =>
                    updateAbout({
                      skills: e.target.value
                        .split(',')
                        .map((s) => s.trim())
                        .filter(Boolean),
                    })
                  }
                  placeholder="e.g. Cinema 4D, Spline, Figma, Blender"
                  className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                />
              </div>
            </div>

            {/* Experience Timeline Editor */}
            <div className="flex flex-col gap-4 bg-[#111] p-6 rounded-2xl border border-neutral-800 mt-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3">
                Experience Timeline
              </h3>

              {/* List current items */}
              <div className="flex flex-col gap-4">
                {data.about.timeline && data.about.timeline.map((item, index) => (
                  <div key={index} className="p-4 bg-[#0C0C0C] border border-neutral-800 rounded-xl flex flex-col gap-3">
                    <div className="flex items-center justify-between border-b border-neutral-850 pb-2">
                      <span className="text-xs font-bold text-neutral-500 font-mono">Milestone #{index + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleDeleteTimelineItem(index)}
                        className="flex items-center gap-1.5 px-2.5 py-1 bg-red-950/20 hover:bg-red-950/40 text-red-400 text-xs font-semibold uppercase tracking-wider rounded-lg border border-red-900/30 cursor-pointer transition-colors"
                      >
                        <Trash2 size={10} />
                        Delete
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-neutral-500">Year</label>
                        <input
                          type="text"
                          value={item.year}
                          onChange={(e) => {
                            const updated = [...data.about.timeline]
                            updated[index] = { ...updated[index], year: e.target.value }
                            updateAbout({ timeline: updated })
                          }}
                          className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-neutral-500">Role</label>
                        <input
                          type="text"
                          value={item.role}
                          onChange={(e) => {
                            const updated = [...data.about.timeline]
                            updated[index] = { ...updated[index], role: e.target.value }
                            updateAbout({ timeline: updated })
                          }}
                          className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-bold uppercase text-neutral-500">Company</label>
                        <input
                          type="text"
                          value={item.company}
                          onChange={(e) => {
                            const updated = [...data.about.timeline]
                            updated[index] = { ...updated[index], company: e.target.value }
                            updateAbout({ timeline: updated })
                          }}
                          className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase text-neutral-500">Milestone Achievements</label>
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const updated = [...data.about.timeline]
                          updated[index] = { ...updated[index], description: e.target.value }
                          updateAbout({ timeline: updated })
                        }}
                        rows={2}
                        className="bg-[#111] border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-purple-500 resize-none"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Form to add new timeline milestone */}
              <div className="p-4 border border-dashed border-neutral-800 rounded-xl flex flex-col gap-3 mt-2">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest flex items-center gap-1.5">
                  <PlusCircle size={14} className="text-neutral-400" />
                  Add Journey Milestone
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    value={newTimeline.year}
                    onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                    placeholder="e.g. 2024 - Present"
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newTimeline.role}
                    onChange={(e) => setNewTimeline({ ...newTimeline, role: e.target.value })}
                    placeholder="e.g. Lead Designer"
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none"
                  />
                  <input
                    type="text"
                    value={newTimeline.company}
                    onChange={(e) => setNewTimeline({ ...newTimeline, company: e.target.value })}
                    placeholder="e.g. Acme Agency"
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none"
                  />
                </div>
                <textarea
                  value={newTimeline.description}
                  onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                  placeholder="Key accomplishments..."
                  rows={2}
                  className="bg-[#0C0C0C] border border-neutral-800 rounded-lg px-3 py-2 text-xs text-neutral-200 focus:outline-none resize-none"
                />
                <button
                  type="button"
                  onClick={handleAddTimelineSubmit}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold uppercase tracking-wider text-[10px] py-2.5 rounded-lg cursor-pointer transition-colors"
                >
                  Insert Milestone
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SERVICES EDITING */}
        {activeTab === 'services' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Services List Editor</h2>
              <p className="text-xs text-neutral-500">Edit the detailed services items displayed on the white background block.</p>
            </div>

            <div className="flex flex-col gap-4">
              {data.services.map((service, index) => (
                <div key={index} className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Service #{index + 1}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1 col-span-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Number Index</label>
                      <input
                        type="text"
                        value={service.num}
                        onChange={(e) => updateService(index, { num: e.target.value })}
                        placeholder="e.g. 01"
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1 col-span-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Name</label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) => updateService(index, { name: e.target.value })}
                        placeholder="e.g. 3D Modeling"
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Description</label>
                    <textarea
                      value={service.desc}
                      onChange={(e) => updateService(index, { desc: e.target.value })}
                      placeholder="Service details..."
                      rows={2}
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PROJECTS EDITING */}
        {activeTab === 'projects' && (
          <div className="flex flex-col gap-6">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-1">Projects & Sticky Stack Editor</h2>
              <p className="text-xs text-neutral-500">Add, update, or remove portfolio items inside the cards container.</p>
            </div>

            {/* List of projects */}
            <div className="flex flex-col gap-6">
              {data.projects.map((proj, index) => (
                <div key={index} className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <span className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Project Card #{index + 1}</span>
                    <button
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete "${proj.name || 'this project'}"?`)) {
                          deleteProject(index)
                        }
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-950/20 hover:bg-red-950/40 text-red-400 hover:text-red-300 text-xs font-semibold uppercase tracking-wider rounded-lg border border-red-900/30 cursor-pointer transition-colors"
                    >
                      <Trash2 size={12} />
                      Delete Project
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Order Num</label>
                      <input
                        type="text"
                        value={proj.num}
                        onChange={(e) => updateProject(index, { num: e.target.value })}
                        placeholder="e.g. 01"
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Category Tag</label>
                      <input
                        type="text"
                        value={proj.category}
                        onChange={(e) => updateProject(index, { category: e.target.value })}
                        placeholder="e.g. Client, Personal"
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Name</label>
                      <input
                        type="text"
                        value={proj.name}
                        onChange={(e) => updateProject(index, { name: e.target.value })}
                        placeholder="Project Name..."
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Project Role</label>
                      <input
                        type="text"
                        value={proj.role || ''}
                        onChange={(e) => updateProject(index, { role: e.target.value })}
                        placeholder="e.g. Creative Director"
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Live Project URL</label>
                      <input
                        type="text"
                        value={proj.liveUrl || ''}
                        onChange={(e) => updateProject(index, { liveUrl: e.target.value })}
                        placeholder="https://..."
                        className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Project Description</label>
                    <textarea
                      value={proj.description || ''}
                      onChange={(e) => updateProject(index, { description: e.target.value })}
                      placeholder="Enter detailed description of the project achievements..."
                      rows={2}
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-1 mt-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Tools Used (Comma separated)</label>
                    <input
                      type="text"
                      value={proj.tools ? proj.tools.join(', ') : ''}
                      onChange={(e) =>
                        updateProject(index, {
                          tools: e.target.value
                            .split(',')
                            .map((t) => t.trim())
                            .filter(Boolean),
                        })
                      }
                      placeholder="e.g. Figma, Blender, Cinema 4D"
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                    <ImageInput
                      label="Left Col Image 1 (Small)"
                      value={proj.col1img1}
                      onChange={(val) => updateProject(index, { col1img1: val })}
                    />
                    <ImageInput
                      label="Left Col Image 2 (Medium)"
                      value={proj.col1img2}
                      onChange={(val) => updateProject(index, { col1img2: val })}
                    />
                    <ImageInput
                      label="Right Col Main Image (Tall)"
                      value={proj.col2img}
                      onChange={(val) => updateProject(index, { col2img: val })}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Form to add a new project */}
            <div className="bg-[#111] p-6 rounded-2xl border border-neutral-800 flex flex-col gap-4 mt-6">
              <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-800 pb-3 flex items-center gap-2">
                <PlusCircle size={16} className="text-neutral-400" />
                Add New Project
              </h3>

              <form onSubmit={handleAddProjectSubmit} className="flex flex-col gap-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Order Index (e.g., 04)</label>
                    <input
                      type="text"
                      value={newProj.num}
                      onChange={(e) => setNewProj({ ...newProj, num: e.target.value })}
                      placeholder="e.g. 04"
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Category Tag</label>
                    <input
                      type="text"
                      value={newProj.category}
                      onChange={(e) => setNewProj({ ...newProj, category: e.target.value })}
                      placeholder="e.g. Client / Personal"
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Project Name</label>
                    <input
                      type="text"
                      value={newProj.name}
                      onChange={(e) => setNewProj({ ...newProj, name: e.target.value })}
                      placeholder="New Project Title..."
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Project Role</label>
                    <input
                      type="text"
                      value={newProj.role}
                      onChange={(e) => setNewProj({ ...newProj, role: e.target.value })}
                      placeholder="e.g. Creative Director"
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Live Project URL</label>
                    <input
                      type="text"
                      value={newProj.liveUrl}
                      onChange={(e) => setNewProj({ ...newProj, liveUrl: e.target.value })}
                      placeholder="https://..."
                      className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Project Description</label>
                  <textarea
                    value={newProj.description}
                    onChange={(e) => setNewProj({ ...newProj, description: e.target.value })}
                    placeholder="Enter detailed description of the project achievements..."
                    rows={2}
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans resize-none"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-neutral-400">Tools Used (Comma separated)</label>
                  <input
                    type="text"
                    value={newProj.tools ? newProj.tools.join(', ') : ''}
                    onChange={(e) =>
                      setNewProj({
                        ...newProj,
                        tools: e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="e.g. Figma, Blender, Cinema 4D"
                    className="bg-[#0C0C0C] border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-200 focus:outline-none focus:border-purple-500 font-sans"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <ImageInput
                    label="Left Col Image 1"
                    value={newProj.col1img1}
                    onChange={(val) => setNewProj({ ...newProj, col1img1: val })}
                  />
                  <ImageInput
                    label="Left Col Image 2"
                    value={newProj.col1img2}
                    onChange={(val) => setNewProj({ ...newProj, col1img2: val })}
                  />
                  <ImageInput
                    label="Right Col Main Image"
                    value={newProj.col2img}
                    onChange={(val) => setNewProj({ ...newProj, col2img: val })}
                  />
                </div>

                <button
                  type="submit"
                  className="mt-2 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-semibold uppercase tracking-widest text-xs py-3.5 rounded-xl cursor-pointer transition-colors"
                >
                  <Plus size={14} />
                  Insert New Project
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MARQUEE SECTION EDITING */}
        {activeTab === 'marquee' && (
          <div className="flex flex-col gap-6">
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
  )
}

export default AdminPanel

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface HeroData {
  title: string
  subtitle: string
  portrait: string
  portraitHover: string
}

export interface TimelineItem {
  year: string
  role: string
  company: string
  description: string
}

export interface AboutData {
  title: string
  description: string
  decorMoon: string
  decorP59: string
  decorLego: string
  decorGroup: string
  skills: string[]
  timeline: TimelineItem[]
}

export interface ServiceData {
  num: string
  name: string
  desc: string
}

// Shared project properties
export interface BaseProject {
  num: string // used as ID
  category: string
  name: string
  col1img1: string // thumbnail helper
  col1img2: string // thumbnail helper
  col2img: string // main thumbnail
  description: string
  role: string
  tools: string[]
  liveUrl: string
}

// Discriminated Union types
export interface CaseStudyProject extends BaseProject {
  template_type: 'casestudy'
  problem_statement: string
  research_insights: string[] // bullet points
  process_gallery: string[] // wireframe assets etc
  solution_features: Array<{
    title: string
    description: string
    image_url: string
  }>
  success_metrics: string[] // e.g. ["📈 Increased voter turnout by 40%"]
}

export interface VisualSnackProject extends BaseProject {
  template_type: 'visual'
  media_url: string
  brief_context: string
  design_system?: {
    colors: string[]
    typography: string[]
  }
}

export type ProjectData = CaseStudyProject | VisualSnackProject

export interface PortfolioData {
  hero: HeroData
  marquee: string[]
  about: AboutData
  services: ServiceData[]
  projects: ProjectData[]
}

const defaultPortfolioData: PortfolioData = {
  hero: {
    title: "I design digital products that solve complex problems.",
    subtitle: 'Niyi — UI/UX & Product Designer.',
    portrait: 'https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png',
    portraitHover: '/smiling_portrait.png',
  },
  marquee: [
    'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
    'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
    'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
    'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
    'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
    'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
  ],
  about: {
    title: 'About me',
    description: "With more than five years of experience in product design, i focus on user research, UI systems, and high-fidelity interaction design. I build clean, high-performance interfaces that connect businesses with their users.",
    decorMoon: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    decorP59: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    decorLego: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    decorGroup: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    skills: ['UI/UX Design', 'Interaction Systems', 'Information Architecture', 'User Research', 'Framer Motion', 'Product Strategy'],
    timeline: [
      {
        year: '2024 - Present',
        role: 'Senior Product Designer',
        company: 'Voterix Tech',
        description: 'Led user research and logic workflows for the Voterix platform, introducing accessible UI architectures that improved voter registration rates by 40%.'
      },
      {
        year: '2022 - 2024',
        role: 'UI/UX Designer',
        company: 'Electify Lab',
        description: 'Designed interactive civic dashboards and logic wireframes for government and ngo clients.'
      },
      {
        year: '2020 - 2022',
        role: 'Product Designer',
        company: 'DesignPro Studio',
        description: 'Crafted design systems, visual mockups, and high-fidelity product prototypes for early stage startups.'
      }
    ]
  },
  services: [
    {
      num: '01',
      name: 'User Research',
      desc: 'Conducting deep user interviews, mapping persona logic, and building information architecture to guide product decisions.',
    },
    {
      num: '02',
      name: 'Interaction Design',
      desc: 'Creating high-fidelity, interactive animations and transitions that make product workflows clear, responsive, and delightful.',
    },
    {
      num: '03',
      name: 'Design Systems',
      desc: 'Structuring unified tokens, component systems, and documentation guidelines that enable fast, scalable developer handoff.',
    },
  ],
  projects: [
    {
      num: '01',
      category: 'Civic Tech',
      name: 'Voterix App',
      col1img1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1img2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2img:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
      description: 'An accessible mobile voting registry helping citizens find polling places, review candidate backgrounds, and securely check registration statuses.',
      role: 'Lead UI/UX Designer',
      tools: ['Figma', 'React', 'Framer Motion'],
      liveUrl: 'https://voterix.org',
      template_type: 'casestudy',
      problem_statement: 'Voter registration platforms are frequently dense and difficult to navigate on mobile devices, leading to lower engagement rates among young voters.',
      research_insights: [
        '70% of respondents browse civic info exclusively via mobile viewports.',
        'Users abandon registration if forms require more than three multi-step segments.',
        'Simplified color tokens and progress indicators reduce cognitive load by 25%.'
      ],
      process_gallery: [
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85'
      ],
      solution_features: [
        {
          title: '3-Step Easy Registration',
          description: 'A structured workflow utilizing verified government API endpoints to index data in seconds.',
          image_url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85'
        }
      ],
      success_metrics: [
        '📈 Increased voter turnout by 40%.'
      ]
    },
    {
      num: '02',
      category: 'Visual Design',
      name: 'Glassmorphic HUD',
      col1img1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1img2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2img:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
      description: 'A design study on glassmorphic HUD interfaces incorporating real-time ambient lighting and neon highlights.',
      role: 'UI Designer',
      tools: ['Figma', 'Photoshop'],
      liveUrl: '',
      template_type: 'visual',
      media_url: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
      brief_context: 'Created to evaluate user reaction speeds against glass-textured UI layers and bright, glowing outline parameters.',
      design_system: {
        colors: ['#8B5CF6', '#10B981', '#0C0C0C'],
        typography: ['Kanit Black', 'Inter Medium']
      }
    }
  ],
}

interface PortfolioContextType {
  data: PortfolioData
  updateHero: (hero: Partial<HeroData>) => void
  updateAbout: (about: Partial<AboutData>) => void
  updateService: (index: number, service: Partial<ServiceData>) => void
  addService: (service: ServiceData) => void
  deleteService: (index: number) => void
  updateProject: (index: number, project: Partial<ProjectData>) => void
  addProject: (project: ProjectData) => void
  deleteProject: (index: number) => void
  updateMarquee: (images: string[]) => void
  resetToDefault: () => void
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined)

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(() => {
    const saved = localStorage.getItem('portfolio_data')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Backwards compatibility for projects schema updates
        const updatedProjects = (parsed.projects || []).map((p: any) => {
          const base = {
            tools: p.tools || [],
            ...p
          }
          if (base.template_type === 'casestudy' || !base.template_type) {
            return {
              template_type: 'casestudy',
              problem_statement: base.problem_statement || base.challenge || '',
              research_insights: base.research_insights || [],
              process_gallery: base.process_gallery || (base.col1img1 ? [base.col1img1] : []),
              solution_features: base.solution_features || [],
              success_metrics: base.success_metrics || [],
              ...base,
            }
          } else {
            return {
              template_type: 'visual',
              media_url: base.media_url || base.col2img || '',
              brief_context: base.brief_context || base.description || '',
              design_system: base.design_system || { colors: [], typography: [] },
              ...base,
            }
          }
        })
        
        return {
          ...defaultPortfolioData,
          ...parsed,
          hero: {
            ...defaultPortfolioData.hero,
            ...parsed.hero,
          },
          about: {
            ...defaultPortfolioData.about,
            ...parsed.about,
          },
          projects: updatedProjects.length > 0 ? updatedProjects : defaultPortfolioData.projects,
        }
      } catch (e) {
        console.error('Error parsing portfolio_data from localStorage', e)
      }
    }
    return defaultPortfolioData
  })

  useEffect(() => {
    localStorage.setItem('portfolio_data', JSON.stringify(data))
  }, [data])

  const updateHero = (hero: Partial<HeroData>) => {
    setData((prev) => ({
      ...prev,
      hero: { ...prev.hero, ...hero },
    }))
  }

  const updateAbout = (about: Partial<AboutData>) => {
    setData((prev) => ({
      ...prev,
      about: { ...prev.about, ...about },
    }))
  }

  const updateService = (index: number, service: Partial<ServiceData>) => {
    setData((prev) => {
      const updatedServices = [...prev.services]
      updatedServices[index] = { ...updatedServices[index], ...service }
      return { ...prev, services: updatedServices }
    })
  }

  const addService = (service: ServiceData) => {
    setData((prev) => ({
      ...prev,
      services: [...prev.services, service],
    }))
  }

  const deleteService = (index: number) => {
    setData((prev) => ({
      ...prev,
      services: prev.services.filter((_, i) => i !== index),
    }))
  }

  const updateProject = (index: number, project: Partial<ProjectData>) => {
    setData((prev) => {
      const updatedProjects = [...prev.projects]
      updatedProjects[index] = { ...updatedProjects[index], ...project } as ProjectData
      return { ...prev, projects: updatedProjects }
    })
  }

  const addProject = (project: ProjectData) => {
    setData((prev) => ({
      ...prev,
      projects: [...prev.projects, project],
    }))
  }

  const deleteProject = (index: number) => {
    setData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }))
  }

  const updateMarquee = (images: string[]) => {
    setData((prev) => ({
      ...prev,
      marquee: images,
    }))
  }

  const resetToDefault = () => {
    setData(defaultPortfolioData)
  }

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateHero,
        updateAbout,
        updateService,
        addService,
        deleteService,
        updateProject,
        addProject,
        deleteProject,
        updateMarquee,
        resetToDefault,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  )
}

export const usePortfolio = () => {
  const context = useContext(PortfolioContext)
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider')
  }
  return context
}

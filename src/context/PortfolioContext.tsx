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

export interface ProjectData {
  num: string
  category: string
  name: string
  col1img1: string
  col1img2: string
  col2img: string
  description: string
  role: string
  tools: string[]
  liveUrl: string
}

export interface PortfolioData {
  hero: HeroData
  marquee: string[]
  about: AboutData
  services: ServiceData[]
  projects: ProjectData[]
}

const defaultPortfolioData: PortfolioData = {
  hero: {
    title: "Hi, i'm jack",
    subtitle: 'a 3d creator driven by crafting striking and unforgettable projects',
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
    'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
    'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
    'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
    'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif',
  ],
  about: {
    title: 'About me',
    description: "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!",
    decorMoon: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png',
    decorP59: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png',
    decorLego: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png',
    decorGroup: 'https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png',
    skills: ['3D Modeling', 'Rendering', 'Motion Design', 'Branding', 'Web Design', 'UI/UX'],
    timeline: [
      {
        year: '2024 - Present',
        role: 'Lead 3D & Web Designer',
        company: 'Nextlevel Studio',
        description: 'Spearheaded rebranding and interactive high-end web designs for a series of international clients, integrating custom 3D web visuals.'
      },
      {
        year: '2022 - 2024',
        role: '3D Generalist',
        company: 'Aura Media',
        description: 'Created photorealistic product renders and commercial motion design sequences for consumer brands.'
      },
      {
        year: '2021 - 2022',
        role: 'Freelance Creative',
        company: 'Self-Employed',
        description: 'Built design systems, brand identities, and customized Webflow/Vite web experiences for local startups.'
      }
    ]
  },
  services: [
    {
      num: '01',
      name: '3D Modeling',
      desc: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.',
    },
    {
      num: '02',
      name: 'Rendering',
      desc: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.',
    },
    {
      num: '03',
      name: 'Motion Design',
      desc: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.',
    },
    {
      num: '04',
      name: 'Branding',
      desc: 'Crafting cohesive visual identities -- from logos to full brand systems -- that communicate a clear and memorable presence.',
    },
    {
      num: '05',
      name: 'Web Design',
      desc: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.',
    },
  ],
  projects: [
    {
      num: '01',
      category: 'Client',
      name: 'Nextlevel Studio',
      col1img1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1img2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2img:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
      description: 'Nextlevel Studio is a leading agency focused on immersive web experiences. We redesigned their digital footprint from scratch, combining interactive 3D elements with sleek performance optimization.',
      role: 'Lead 3D & Web Designer',
      tools: ['Spline', 'React', 'Framer Motion', 'Blender'],
      liveUrl: 'https://nextlevel.studio'
    },
    {
      num: '02',
      category: 'Personal',
      name: 'Aura Brand Identity',
      col1img1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1img2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2img:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
      description: 'A modular, premium brand identity designed for a modern venture capital firm. Features custom typography, organic 3D glass objects, and cohesive print-digital brand guidelines.',
      role: 'Creative Director',
      tools: ['Figma', 'Cinema 4D', 'Photoshop', 'Illustrator'],
      liveUrl: 'https://aura.brand'
    },
    {
      num: '03',
      category: 'Client',
      name: 'Solaris Digital',
      col1img1:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1img2:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2img:
        'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
      description: 'A high-fidelity landing page for a Web3 tech incubator. Built around an interactive planet orbit simulation, optimized for smooth 60fps renders on mobile devices.',
      role: 'Lead Developer',
      tools: ['Vite', 'Three.js', 'Tailwind CSS', 'Blender'],
      liveUrl: 'https://solaris.digital'
    },
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
      updatedProjects[index] = { ...updatedProjects[index], ...project }
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

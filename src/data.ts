import { Project, ProcessStep, Service } from './types';

export const projects: Project[] = [
  {
    id: 'postcard',
    title: 'Postcard®',
    subtitle: 'The modern interactive publishing canvas for founders.',
    description: 'A rich visual-publishing engine crafted to let creators build premium, editorial stories effortlessly. Built on an optimized absolute canvas architecture with custom vector rendering interfaces.',
    tags: ['SaaS Engine', 'Canvas Technology', 'React/TS', 'Product Founder'],
    role: 'Founder & Lead Engineer',
    year: '2025 - Present',
    metric: '180K+ publications generated',
    imageAlt: 'Sleek editorial postcard editor dashboard preview with deep charcoal slate and soft-glowing interface guidelines.',
    imagePlaceholderColor: 'from-zinc-900 via-slate-950 to-neutral-900',
  },
  {
    id: 'zenith',
    title: 'Zenith Telemetry',
    subtitle: 'High-performance real-time system monitoring.',
    description: 'Designed and engineered the complete telemetry dashboard for decentralized architectures, rendering millions of live telemetry coordinates at 60fps utilizing web worker streaming.',
    tags: ['WebGL Rendering', 'React Query Grid', 'Data Visualization'],
    role: 'Founding Product Designer',
    year: '2024',
    metric: '0.12ms tick rendering latency',
    imageAlt: 'A highly structured, dense dark telemetry feed visualization showing smooth real-time streams and clean metadata badges.',
    imagePlaceholderColor: 'from-slate-950 via-zinc-900 to-indigo-950',
  },
  {
    id: 'chronicle',
    title: 'Chronicle Code',
    subtitle: 'A minimal collaborative documentation editor.',
    description: 'A restrained, typography-first monospace text editor focusing on deep writing states. Features automated block-nested outline structure and instantaneous local offline syncing.',
    tags: ['CRDT Syncing', 'Editor Engineering', 'UX Design', 'Tailwind'],
    role: 'Lead Designer & Frontend Engineer',
    year: '2024',
    metric: 'Perfect offline sync alignment',
    imageAlt: 'Monospace editorial text editor screen with clean tracking and structured hierarchy guidelines.',
    imagePlaceholderColor: 'from-neutral-950 via-slate-950 to-zinc-950',
  },
  {
    id: 'kore-os',
    title: 'Kore OS Interface',
    subtitle: 'Sleek IoT interface client for hardware nodes.',
    description: 'A mobile-first physical interface designed for extreme environmental control systems. Modeled with optimized contrast parameters for outdoor sunlight readability and high-vibration control safety.',
    tags: ['Mobile UX', 'Hardware Controller', 'Interface Design', 'SVG Asset'],
    role: 'Freelance Product Architect',
    year: '2023',
    metric: 'MIL-SPEC high-contrast compliant',
    imageAlt: 'High-contrast mobile interface with gorgeous circular control dials and tactile feedback responses.',
    imagePlaceholderColor: 'from-zinc-900 via-neutral-950 to-stone-900',
  }
];

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Crystallizing Ambiguity',
    duration: 'Week 1',
    description: 'We begin in the dark. I work closely with you to digest sprawling, contradictory visions and structural objectives, converting chaotic ideas into high-level specs and architectural wireframes.',
    deliverables: ['Product Requirement Brief', 'Core Interaction Model', 'High-level Information Specs'],
  },
  {
    number: '02',
    title: 'Cinematic High-Fidelity Design',
    duration: 'Weeks 2-4',
    description: 'Static visual mockups are deceptive. I design in highly realistic, responsive system prototypes where dynamic motion, hover feel, micro-actions, and structural constraints are tested under realistic runtime bounds.',
    deliverables: ['Custom design language system', 'High-fidelity interactives', 'Component and states library'],
  },
  {
    number: '03',
    title: 'Type-Safe Modular Architecture',
    duration: 'Weeks 5-8',
    description: 'I write cleanly structured React and TypeScript code using production-level patterns. All UI state handlers, API proxies, and local storage mechanisms are implemented with strict, maintainable type discipline.',
    deliverables: ['Clean GitHub Repository', 'Production environment build settings', 'Strict TypeScript schema maps'],
  },
  {
    number: '04',
    title: 'Refinement, Profile & Launch',
    duration: 'Week 9',
    description: 'Optimizing render performance, refining responsive spacing breakpoints, validating web accessibility ratios, and releasing the production codebase with full, independent continuous delivery integration.',
    deliverables: ['Speed & Render Audit', 'Cloud deployment setup', 'Documented release map'],
  }
];

export const services: Service[] = [
  {
    type: 'Design + Code',
    title: 'Full-Stack Product Design & Prototyping',
    description: 'For founders who need a beautiful, hyper-polished prototype to close funding rounds or launch an early version of their core platform without hiring a sprawling, expensive agency.',
    capabilities: ['Dynamic interactive prototyping', 'Comprehensive Figma to UI execution', 'Micro-interactions and physics design', 'Tailwind custom layout architectures'],
  },
  {
    type: 'Engineering',
    title: 'Premium Frontend Engineering & Client-Side Architectures',
    description: 'Translating already structured concepts into scalable, clean TypeScript applications. Specialized in building canvas interfaces, dynamic state editors, high-performance dashboards, and responsive web platforms.',
    capabilities: ['Vite, Next.js, and Bun expertise', 'Type-safe React state engines', 'Hardware and API stream-syncing', 'Optimized client performance auditing'],
  },
  {
    type: 'Strategy',
    title: 'Technical Advisory & Product Roadmapping',
    description: 'Partnering directly with non-technical founders to define stack constraints, screen developers, estimate features, avoid common performance regressions, and plan high-vibe user release cycles.',
    capabilities: ['Modular systems consultation', 'UI/UX accessibility profiling', 'Performance bottleneck remediation', 'Launch readiness verification'],
  }
];

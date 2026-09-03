export const site = {
  name: 'Muhammad Ghayoor Ali',
  greeting: "Hello, I'm",
  title: "I'm a Full Stack Developer",
  email: 'ghayoorali59@gmail.com',
  location: 'Available worldwide',
  socials: {
    github: 'https://github.com/GhayoorAli',
    linkedin: 'https://www.linkedin.com/in/ghayoorali/',
  },
  stats: [
    { value: '4+', label: 'Years of Experience' },
    { value: '15+', label: 'Completed Projects' },
    { value: '10K+', label: 'Hours Worked' },
  ],
}

export const about = {
  kicker: 'About',
  heading: 'I turn ideas into products — schema to screen, backend to browser.',
  body: [
    "I'm Muhammad Ghayoor Ali, a full-stack developer who's shipped 12+ production applications from first commit to real users. I don't just write code — I design the systems underneath it: clean database schemas, APIs that make sense, and interfaces people actually enjoy using.",
    "My core lives in PHP, Laravel, Magento 2, WordPress and MySQL on the server — architecting backend logic, optimizing queries, integrating third-party services — paired with React (Next.js or Vue.js) on the client to turn that logic into fast, considered interfaces. I've cut application load times by up to 50% through backend and query optimization, and I take responsibility for my code well beyond deployment — not just the demo.",
  ],
}

export const stackGroups = [
  {
    category: 'Backend Frameworks & Languages',
    items: [
      { name: 'PHP', id: 'php' },
      { name: 'Laravel', id: 'laravel' },
      { name: 'Symfony', id: 'symfony' },
      { name: 'Magento 2', id: 'magento' },
      { name: 'WordPress', id: 'wordpress' },
      { name: 'Node.js', id: 'nodejs' },
    ],
  },
  {
    category: 'Frontend',
    items: [
      { name: 'JavaScript', id: 'javascript' },
      { name: 'TypeScript', id: 'typescript' },
      { name: 'React', id: 'react' },
      { name: 'Next.js', id: 'nextjs' },
      { name: 'Vue.js', id: 'vue' },
      { name: 'HTML', id: 'html' },
      { name: 'CSS', id: 'css' },
      { name: 'Bootstrap', id: 'bootstrap' },
      { name: 'Tailwind CSS', id: 'tailwindcss' },
      { name: 'Framer Motion', id: 'framermotion' },
      { name: 'Sass', id: 'sass' },
    ],
  },
  {
    category: 'Databases',
    items: [
      { name: 'MySQL', id: 'mysql' },
      { name: 'MariaDB', id: 'mariadb' },
      { name: 'PostgreSQL', id: 'postgresql' },
      { name: 'MongoDB', id: 'mongodb' },
      { name: 'Redis', id: 'redis' },
    ],
  },
  {
    category: 'APIs & Data Formats',
    items: [
      { name: 'REST API', id: 'restapi' },
      { name: 'JSON', id: 'json' },
      { name: 'XML', id: 'xml' },
      { name: 'YAML', id: 'yaml' },
    ],
  },
  {
    category: 'Cloud & DevOps',
    items: [
      { name: 'AWS', id: 'aws' },
      { name: 'Docker', id: 'docker' },
      { name: 'Vercel', id: 'vercel' },
      { name: 'Linux', id: 'linux' },
      { name: 'Windows', id: 'windows' },
    ],
  },
  {
    category: 'Testing',
    items: [
      { name: 'Pest', id: 'pest' },
      { name: 'Postman', id: 'postman' },
    ],
  },
  {
    category: 'Tools & Workflow',
    items: [
      { name: 'Git / GitHub', id: 'github' },
      { name: 'Composer', id: 'composer' },
      { name: 'Jira', id: 'jira' },
      { name: 'Slack', id: 'slack' },
      { name: 'Figma', id: 'figma' },
      { name: 'PHPStorm', id: 'phpstorm' },
      { name: 'VS Code', id: 'vscode' },
      { name: 'Cursor', id: 'cursor' },
      { name: 'Claude Code', id: 'claude' },
    ],
  },
] as const

export const experience = [
  {
    role: 'Full Stack Web Developer (Working Student)',
    company: 'Bär Softwareentwicklung UG',
    period: 'Oct 2025 — Jan 2026',
    location: 'Frankfurt am Main, Germany (Remote)',
    stack: ['PHP', 'MySQL', 'JavaScript', 'React', 'HTML/CSS', 'Git', 'Jira', 'PhpStorm'],
    summary:
      'Working across the full stack to evolve a legacy application — building backend features in PHP while developing React-based frontend components — with a focus on system stability, usability, and maintainability.',
    points: [
      'Designed and implemented backend features in PHP, extending core business logic and ensuring seamless integration with React-driven frontend components.',
      'Built and enhanced interactive UI components using React, JavaScript, HTML, and CSS, improving usability, responsiveness, and overall user experience.',
      'Modernized legacy code by applying PSR standards and clean code principles across both backend architecture and frontend structure.',
      'Reduced technical debt and regression risk through structured refactoring and active Pull Request reviews spanning full-stack changes.',
      'Delivered end-to-end features independently within an agile Kanban workflow (Jira), owning tasks from backend logic through React UI implementation.',
      'Maintained clean Git branching strategies to support stable, low-risk deployments across the stack.',
    ],
  },
  {
    role: 'Full Stack Web Developer',
    company: 'Lixup',
    period: 'Jan 2021 — Dec 2024',
    location: 'United Kingdom',
    stack: [
      'Laravel',
      'Magento 2',
      'WordPress',
      'PHP',
      'MySQL',
      'JavaScript',
      'React',
      'Next.js',
      'HTML/CSS',
      'REST/SOAP APIs',
      'GitHub',
      'Jira',
    ],
    summary:
      'Owned full-stack delivery across 12+ production web applications — architecting backend systems in Laravel, Magento 2, and WordPress while building React and Next.js-powered frontend experiences on top of them.',
    points: [
      'Delivered 12+ production-grade web applications end-to-end — architecting backend systems across Laravel, Magento 2, and WordPress, and building responsive frontends with React, Next.js and Vue.js.',
      'Designed custom backend architectures and paired them with dynamic, component-based frontend interfaces tailored to complex business requirements.',
      'Designed and integrated complex external API services across key business systems, ensuring reliability through robust logging and error handling.',
      'Improved full application performance by up to 50% through backend optimization, MySQL query tuning, and efficient React component rendering.',
      'Built reusable React/Next.js components to connect server-side logic with dynamic, data-driven user interfaces.',
      'Managed source control via GitHub and led structured PR reviews covering both backend and frontend code quality.',
      'Authored full-stack technical documentation, architecture workflows, and delivery timelines in Jira.',
      'Mentored junior developers on both backend and frontend best practices through code reviews and pair programming.',
    ],
  },
]

export type ProjectStackItem = { id: string; name: string }

export type ProjectChallenge = {
  title: string
  problem: string
  solution: string
}

export type Project = {
  slug: string
  name: string
  hook: string
  cover: string
  tag: string
  year: string
  problem: string
  role: string
  stack: ProjectStackItem[]
  features: string[]
  challenges: ProjectChallenge[]
  architecture?: string
  workflow?: string
  links: { live: string | null; github: string | null }
  gallery: string[]
  results?: string
}

export const projects: Project[] = [
  {
    slug: 'meet-me',
    name: 'MeetMe',
    hook: 'A self-hosted video meeting platform — a lightweight Google Meet alternative with waiting rooms, guest hosting, collaborative tools, and host-controlled permissions.',
    cover: '/projects/meet-me/cover.svg',
    tag: 'Video platform',
    year: '2025',
    problem:
      'Teams needed a self-hosted meeting stack with waiting rooms, guest hosting, and in-call collaboration — without locking into a closed SaaS product or rebuilding WebRTC from scratch.',
    role: 'Solo full-stack developer — Next.js meeting UI, Laravel API/auth, LiveKit JWT minting, real-time sync over data channels, and multi-service deploy (Vercel + Railway + Docker).',
    stack: [
      { id: 'nextjs', name: 'Next.js' },
      { id: 'react', name: 'React' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'tailwindcss', name: 'Tailwind CSS' },
      { id: 'laravel', name: 'Laravel' },
      { id: 'php', name: 'PHP' },
      { id: 'mysql', name: 'MySQL' },
      { id: 'docker', name: 'Docker' },
      { id: 'vercel', name: 'Vercel' },
    ],
    features: [
      'Instant meeting create via Laravel API with unique shareable codes; registered hosts and guest-host tokens in sessionStorage',
      'Waiting room: join requests in MySQL, guests poll admit status, host admits/denies from the People sidebar before LiveKit JWT issuance',
      'HD WebRTC via LiveKit — Laravel mints room JWTs; Next.js renders tracks with @livekit/components-react',
      'Host-gated screen share (request → approve/deny) with a live highlighter overlay using normalized coordinates',
      'Shared whiteboard synced over LiveKit data channels; host assigns a single editor (handover/revoke); stroke IDs + sync_full for late joiners',
      'Hand-raise over data messages; participant sidebar with waiting/request counts; one-click copy of the join link',
      'Host-controlled recording and screen-share workflows with permission state persisted and synced in-room',
      'Register/login with Laravel Sanctum (cookie SPA auth); user dashboard; admin API for stats, users, and meeting cleanup',
      'Guests can join or host without an account using display name + guest/admit tokens',
    ],
    challenges: [
      {
        title: 'Shared whiteboard without fight-over-the-canvas chaos',
        problem:
          'Multiple people drawing at once over WebRTC made strokes collide and state diverge.',
        solution:
          'Gave the host control of a single editor (handover / revoke), synced strokes over LiveKit data channels (not Laravel polling), deduped by stroke ID, and let late joiners request a full sync_full snapshot to catch up.',
      },
      {
        title: 'Screen-share highlighter across different resolutions',
        problem: 'Pointer overlays drifted when sharer and viewers had different screen sizes.',
        solution: 'Send normalized coordinates (0–1) and map them locally on each client.',
      },
      {
        title: 'Cross-origin CSRF on Vercel + Railway',
        problem:
          'Sanctum’s XSRF-TOKEN is set on the API domain, so the Vercel app could not read it (unlike localhost ports).',
        solution:
          'Proxied /api and /sanctum through Next.js rewrites so the browser stays same-origin while Laravel still runs on Railway.',
      },
      {
        title: '“Leave meeting” looked like a crash',
        problem: 'Leaving disconnected LiveKit, which fired onDisconnected and showed “Connection failed.”',
        solution:
          'Mark Leave / End as intentional and navigate to the dashboard instead of treating that disconnect as an error.',
      },
      {
        title: 'Docker / deploy reliability',
        problem:
          'Host PHP/Node mismatches locally; Railway Apache crash-looped (More than one MPM loaded); Vercel standalone broke Next 16.3 builds; CORS differed per environment.',
        solution:
          'Wrapped PHP 8.3 + Next.js in Compose for local clones; switched Railway to php artisan serve on $PORT; enable standalone only for Docker, not Vercel; moved allowed origins to FRONTEND_URL + CORS_ALLOWED_ORIGINS.',
      },
    ],
    architecture: `graph TB
    subgraph client ["Browser Next.js"]
        UI["Meeting UI and Dashboard"]
        LK["LiveKit Client SDK"]
        UI --> LK
    end

    subgraph backend ["Laravel API"]
        API["REST API"]
        Auth["Sanctum Auth"]
        Token["LiveKit JWT Service"]
        API --> Auth
        API --> Token
    end

    subgraph data ["Data and Realtime"]
        DB[(MySQL)]
        LKS["LiveKit Server"]
    end

    UI -->|"HTTP API"| API
    API --> DB
    Token -->|"JWT"| UI
    LK -->|"WebRTC"| LKS
    LKS -->|"WebRTC"| LK`,
    workflow: `sequenceDiagram
    participant Host
    participant Guest
    participant API as Laravel API
    participant LK as LiveKit
    Host->>API: Create meeting
    API-->>Host: Meeting code and host token
    Host->>API: Join meeting
    API-->>Host: Admitted with LiveKit JWT
    Host->>LK: Connect to room
    Guest->>API: Join meeting
    API-->>Guest: Waiting with admit token
    Host->>API: Admit participant
    Guest->>API: Poll join status
    API-->>Guest: Admitted with LiveKit JWT
    Guest->>LK: Connect to room
    Note over Guest,API: Refresh restores session via sessionStorage`,
    links: {
      live: 'https://www.meet-me.tech',
      github: null,
    },
    gallery: ['/projects/meet-me/gallery-1.svg'],
    results:
      'Shipped a live multi-service meeting product at meet-me.tech — Next.js on Vercel, Laravel on Railway, LiveKit for media — with guest join, waiting room, whiteboard, and host permissions working end to end.',
  },
  {
    slug: 'meridian',
    name: 'Meridian',
    hook: 'A Next.js theme for a spatial research studio — dark editorial layout, filled project and journal pages, and motion-led UI built for architecture and design portfolios.',
    cover: '/projects/meridian/ss-home.png',
    tag: 'Theme / portfolio',
    year: '2025',
    problem:
      'Architecture and design studios often ship a brochure site that looks generic: light cards, stock grids, and empty “coming soon” pages. They need a theme that already feels finished — dark editorial presence, real case studies, and motion that matches the craft of the work.',
    role: 'Solo frontend developer — designed and built the full Next.js theme: App Router pages, motion system, sample studio content, and production deploy at merids.xyz (UI theme only; no backend).',
    stack: [
      { id: 'nextjs', name: 'Next.js' },
      { id: 'react', name: 'React' },
      { id: 'typescript', name: 'TypeScript' },
      { id: 'tailwindcss', name: 'Tailwind CSS' },
      { id: 'framermotion', name: 'Framer Motion' },
      { id: 'vercel', name: 'Vercel' },
    ],
    features: [
      'Home as a full studio narrative: hero, manifesto, selected work, capabilities, method, offices, journal, and awards',
      'Project archive at /work with type filters and hover image swap on the list',
      'Case studies at /work/[slug] with challenge, approach, outcome, gallery, and credits',
      'Studio, journal index, essay pages, and a contact brief form across three offices',
      'Custom cursor and magnetic buttons for a tactile, studio-grade interaction layer',
      'Sticky header that gains a dark bar on scroll; expanding office panels and accordion capabilities',
      'Live clocks for London, Edinburgh, and Melbourne field stations',
      'Route loading state on navigation; sample data for 8 projects, 6 essays, 8 people, awards, and clients',
      'All photographs served from public/images — swap files or data paths to rebrand the studio',
    ],
    challenges: [
      {
        title: 'Making a theme feel like a finished practice',
        problem:
          'Empty placeholder pages kill trust. Buyers and recruiters judge a theme by whether it already reads as a real studio.',
        solution:
          'Wrote a full fictional practice — Meridian, founded London 2014, field stations in Edinburgh and Melbourne — with projects, essays, team, awards, and clients so the preview is a complete site, not a skeleton.',
      },
      {
        title: 'Editorial motion without noise',
        problem:
          'Too much Framer Motion turns a serious architecture site into a gimmick; too little feels static and template-like.',
        solution:
          'Scoped motion to hierarchy: magnetic CTAs, list hover image swaps, expanding office panels, accordion capabilities, and a quiet route loading state — presence, not spectacle.',
      },
      {
        title: 'Content that studios can actually own',
        problem:
          'Hard-coded marketing copy locks the buyer into a demo they cannot rebrand without surgery.',
        solution:
          'Centralized site, projects, studio, and journal in data/*.ts so replacing Meridian with a real practice is a content edit, not a rewrite of components.',
      },
    ],
    architecture: `graph TB
    subgraph app ["Next.js App Router"]
        Home["/"]
        Work["/work"]
        Case["/work/slug"]
        Studio["/studio"]
        Journal["/journal"]
        Contact["/contact"]
    end

    subgraph ui ["UI layer"]
        Motion["Framer Motion"]
        Nav["Sticky nav + cursor"]
        Sections["Home sections"]
    end

    subgraph content ["Content"]
        Data["data/*.ts"]
        Images["public/images"]
    end

    Home --> Sections
    Work --> Case
    Data --> Home
    Data --> Work
    Data --> Studio
    Data --> Journal
    Images --> Sections
    Motion --> Nav
    Motion --> Sections`,
    links: {
      live: 'https://www.merids.xyz/',
      github: null,
    },
    gallery: [
      '/projects/meridian/ss-home.png',
      '/projects/meridian/ss-work.png',
      '/projects/meridian/ss-studio.png',
      '/projects/meridian/cover.jpg',
      '/projects/meridian/gallery-1.jpg',
    ],
    results:
      'A live, production-ready studio theme at merids.xyz — dark editorial UI, filled case studies and journal, and motion-led interactions that studios can rebrand by editing data files and swapping local images.',
  },
  {
    slug: 'atlas-pulse',
    name: 'Atlas Pulse',
    hook: 'Atlas Pulse — an analytics SaaS dashboard with role-based access, scheduled reports, and live metrics on Laravel + React.',
    cover: '/projects/atlas-pulse/cover.svg',
    tag: 'SaaS dashboard',
    year: '2024',
    problem:
      'Product teams needed trustworthy metrics without waiting on analyst exports. The gap was a readable dashboard backed by an API-first metrics service.',
    role: 'Solo full-stack developer — API design, Redis caching, and dense React dashboard UI.',
    stack: [
      { id: 'php', name: 'PHP' },
      { id: 'laravel', name: 'Laravel' },
      { id: 'redis', name: 'Redis' },
      { id: 'react', name: 'React' },
      { id: 'mysql', name: 'MySQL' },
    ],
    features: [
      'API-first metrics endpoints with token auth and role scopes',
      'Scheduled report jobs with email delivery',
      'Live dashboard widgets with Redis-backed hot paths',
      'Dense but scannable React charts and filter controls',
    ],
    challenges: [
      {
        title: 'Slow historical dashboard queries',
        problem: 'Dashboard queries slowed as historical series grew beyond a few months.',
        solution:
          'Pre-aggregated daily rollups and cached hot windows in Redis while keeping raw events queryable for deep dives.',
      },
    ],
    links: {
      live: null,
      github: null,
    },
    gallery: ['/projects/atlas-pulse/gallery-1.svg'],
    results: 'Reduced p95 dashboard load times after caching and rollups — estimated ~40% faster on core views.',
  },
  {
    slug: 'harbor-api',
    name: 'Harbor API',
    hook: 'Harbor API — a versioned REST platform with tokens, webhooks, and rate limits so other teams can integrate without a meeting.',
    cover: '/projects/harbor-api/cover.svg',
    tag: 'Platform',
    year: '2023',
    problem:
      'Partner teams needed a stable integration surface. Ad-hoc endpoints and shared credentials were slowing delivery and creating security risk.',
    role: 'Solo backend developer — platform architecture, auth, webhooks, and Dockerized deploy.',
    stack: [
      { id: 'laravel', name: 'Laravel' },
      { id: 'mysql', name: 'MySQL' },
      { id: 'docker', name: 'Docker' },
      { id: 'restapi', name: 'REST API' },
      { id: 'postman', name: 'Postman' },
    ],
    features: [
      'Versioned REST endpoints with personal access tokens',
      'Webhook delivery with retries and signed payloads',
      'Per-token rate limiting and audit logging',
      'Sandbox mode and Postman collection for partner onboarding',
    ],
    challenges: [
      {
        title: 'Unreliable webhook delivery',
        problem: 'Webhook consumers failed intermittently and blamed the platform.',
        solution:
          'Added signed delivery attempts, exponential retries, and a delivery log so both sides could debug without guessing.',
      },
    ],
    links: {
      live: null,
      github: null,
    },
    gallery: ['/projects/harbor-api/gallery-1.svg'],
    results: 'Partner integrations moved off shared credentials onto scoped tokens with observable delivery.',
  },
]

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug)
}

export const education = [
  {
    school: 'Frankfurt University of Applied Sciences',
    degree: "Master's degree, High Integrity Systems",
    period: 'Oct 2024 — Present',
    place: 'Frankfurt am Main, Germany',
  },
  {
    school: 'Government College University, Faisalabad',
    degree: 'Bachelor of Science — BS, Information Technology',
    period: 'Oct 2017 — Sep 2021',
    place: 'Faisalabad, Pakistan',
  },
]

export const certifications = [
  {
    title: 'Introduction to Web Development',
    issuer: 'University of California, Davis',
    platform: 'Coursera',
    date: 'Apr 2023',
    image: '/certificates/uc-davis-web-development.png',
    url: 'https://coursera.org/verify/H7WEBXFXDC2X',
  },
  {
    title: 'Object-Oriented Programming Concepts',
    issuer: 'LearnQuest',
    platform: 'Coursera',
    date: 'Apr 2023',
    image: '/certificates/learnquest-oop.png',
    url: 'https://coursera.org/verify/C8EQ87CQQV42',
  },
  {
    title: 'Developing Back-End Apps with Node.js and Express',
    issuer: 'IBM',
    platform: 'Coursera',
    date: 'Apr 2023',
    image: '/certificates/ibm-nodejs-express.png',
    url: 'https://coursera.org/verify/UWH647KZXHQA',
  },
  {
    title: 'Introduction to Git and GitHub',
    issuer: 'Google',
    platform: 'Coursera',
    date: 'Apr 2023',
    image: '/certificates/google-git-github.png',
    url: 'https://coursera.org/verify/WLN2PXFBJLSY',
  },
  {
    title: 'Software development for enterprise systems',
    issuer: 'The Open University',
    platform: 'OpenLearn',
    date: 'Mar 2023',
    note: '8-hour course',
    image: '/certificates/openlearn-enterprise-systems.png',
    url: null,
  },
  {
    title: 'The database development life cycle',
    issuer: 'The Open University',
    platform: 'OpenLearn',
    date: 'Mar 2023',
    note: '12-hour course',
    image: '/certificates/openlearn-database-lifecycle.png',
    url: null,
  },
  {
    title: 'Web Development with PHP',
    issuer: 'Aptech Computer Education',
    platform: 'Certificate of Participation',
    date: 'Dec 2018',
    note: 'ACE Punjab — Faisalabad',
    image: '/certificates/aptech-php.jpg',
    url: null,
  },
]

export const workflow = [
  {
    step: '01',
    title: 'Discovery & Requirements',
    text: "Understand the client's goals, users, and constraints before writing a line of code.",
  },
  {
    step: '02',
    title: 'Planning & Architecture',
    text: 'Break the project into milestones/sprints, define tech stack, design database schema and API structure.',
  },
  {
    step: '03',
    title: 'Agile Development (2-week sprints)',
    text: 'Iterative builds with regular check-ins — you deliver working increments, not a single big reveal at the end.',
  },
  {
    step: '04',
    title: 'Testing & QA',
    text: 'Unit/integration tests, code review, bug fixes before anything ships.',
  },
  {
    step: '05',
    title: 'Deployment & CI/CD',
    text: 'Staged rollout (staging → production), automated pipelines.',
  },
  {
    step: '06',
    title: 'Post-Launch Support',
    text: 'Monitoring, maintenance, iteration based on real usage.',
  },
]

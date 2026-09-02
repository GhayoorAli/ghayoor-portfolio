export const site = {
  name: 'Muhammad Ghayoor Ali',
  greeting: "Hello, I'm",
  title: "I'm a Full Stack Developer",
  email: 'hello@ghayoor.dev',
  location: 'Available worldwide',
  socials: {
    github: 'https://github.com/',
    linkedin: 'https://linkedin.com/',
  },
  stats: [
    { value: '3+', label: 'Years of Experience' },
    { value: '7+', label: 'Completed Projects' },
    { value: '10K+', label: 'Hours Worked' },
  ],
}

export const about = {
  kicker: 'About',
  heading: 'I turn ideas into products — schema to screen, backend to browser.',
  body: [
    "I'm Muhammad Ghayoor Ali, a full-stack developer who's shipped 12+ production applications from first commit to real users. I don't just write code — I design the systems underneath it: clean database schemas, APIs that make sense, and interfaces people actually enjoy using.",
    "My core lives in PHP, Laravel, and MySQL on the server — architecting backend logic, optimizing queries, integrating third-party services — paired with React and Next.js on the client to turn that logic into fast, considered interfaces. I've cut application load times by up to 50% through backend and query optimization, and I take responsibility for my code well beyond deployment — not just the demo.",
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

export const projects = [
  {
    name: 'Northline Commerce',
    tag: 'E-commerce',
    year: '2024',
    description:
      'A Laravel storefront and ops dashboard for catalog, checkout, inventory, and order workflows — built for merchants who need more than a template shop.',
    stack: ['Laravel', 'MySQL', 'Stripe', 'React'],
    accent: 'copper',
  },
  {
    name: 'Atlas Pulse',
    tag: 'SaaS dashboard',
    year: '2024',
    description:
      'Analytics product with role-based access, scheduled reports, and live metrics. API-first backend with a dense but readable React interface.',
    stack: ['PHP', 'Laravel', 'Redis', 'React'],
    accent: 'teal',
  },
  {
    name: 'Harbor API',
    tag: 'Platform',
    year: '2023',
    description:
      'A versioned REST platform with tokens, webhooks, and rate limits. Documentation and a sandbox so other teams could integrate without a meeting.',
    stack: ['Laravel', 'MySQL', 'Docker'],
    accent: 'gold',
  },
  {
    name: 'Kindling CMS',
    tag: 'Internal tool',
    year: '2023',
    description:
      'A content and workflow system for editors: drafts, approvals, media, and scheduled publish — designed to feel calm instead of cluttered.',
    stack: ['Laravel', 'Livewire', 'MySQL'],
    accent: 'cream',
  },
]

export const workflow = [
  {
    step: '01',
    title: 'Discover',
    text: 'Start with the problem, the users, and the constraints. I ask what success looks like before I open an editor.',
  },
  {
    step: '02',
    title: 'Architect',
    text: 'Map the data, the APIs, and the moving parts. A clear model now saves months of rework later.',
  },
  {
    step: '03',
    title: 'Build',
    text: 'Ship in thin slices — backend and UI together — so something real can be clicked, tested, and improved.',
  },
  {
    step: '04',
    title: 'Harden',
    text: 'Tests, auth, performance, and edge cases. Production is not a surprise if you treat it as the default.',
  },
  {
    step: '05',
    title: 'Ship',
    text: 'Deploy, observe, iterate. Launch is a checkpoint, not a finish line.',
  },
]

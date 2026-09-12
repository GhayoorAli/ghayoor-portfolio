export type IconOption = {
  id: string
  label: string
  src: string
  isBuiltIn?: boolean
}

export function normalizeIconName(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

/** Icons available under /public/icons — used by Skills & Project stack pickers. */
export const ICON_OPTIONS: IconOption[] = [
  { id: 'php', label: 'PHP', src: '/icons/php.svg' },
  { id: 'laravel', label: 'Laravel', src: '/icons/laravel.svg' },
  { id: 'symfony', label: 'Symfony', src: '/icons/symfony.svg' },
  { id: 'magento', label: 'Magento 2', src: '/icons/magento.svg' },
  { id: 'wordpress', label: 'WordPress', src: '/icons/wordpress.svg' },
  { id: 'nodejs', label: 'Node.js', src: '/icons/nodejs.svg' },
  { id: 'javascript', label: 'JavaScript', src: '/icons/javascript.svg' },
  { id: 'typescript', label: 'TypeScript', src: '/icons/typescript.svg' },
  { id: 'react', label: 'React', src: '/icons/react.svg' },
  { id: 'nextjs', label: 'Next.js', src: '/icons/nextjs.svg' },
  { id: 'vue', label: 'Vue.js', src: '/icons/vue.svg' },
  { id: 'html', label: 'HTML', src: '/icons/html.svg' },
  { id: 'css', label: 'CSS', src: '/icons/css.svg' },
  { id: 'bootstrap', label: 'Bootstrap', src: '/icons/bootstrap.svg' },
  { id: 'tailwindcss', label: 'Tailwind CSS', src: '/icons/tailwindcss.svg' },
  { id: 'framermotion', label: 'Framer Motion', src: '/icons/framermotion.svg' },
  { id: 'sass', label: 'Sass', src: '/icons/sass.svg' },
  { id: 'mysql', label: 'MySQL', src: '/icons/mysql.svg' },
  { id: 'mariadb', label: 'MariaDB', src: '/icons/mariadb.svg' },
  { id: 'postgresql', label: 'PostgreSQL', src: '/icons/postgresql.svg' },
  { id: 'mongodb', label: 'MongoDB', src: '/icons/mongodb.svg' },
  { id: 'redis', label: 'Redis', src: '/icons/redis.svg' },
  { id: 'supabase', label: 'Supabase', src: '/icons/supabase.svg' },
  { id: 'restapi', label: 'REST API', src: '/icons/restapi.svg' },
  { id: 'json', label: 'JSON', src: '/icons/json.svg' },
  { id: 'xml', label: 'XML', src: '/icons/xml.svg' },
  { id: 'yaml', label: 'YAML', src: '/icons/yaml.svg' },
  { id: 'aws', label: 'AWS', src: '/icons/aws.svg' },
  { id: 'docker', label: 'Docker', src: '/icons/docker.svg' },
  { id: 'vercel', label: 'Vercel', src: '/icons/vercel.svg' },
  { id: 'linux', label: 'Linux', src: '/icons/linux.svg' },
  { id: 'windows', label: 'Windows', src: '/icons/windows.svg' },
  { id: 'pest', label: 'Pest', src: '/icons/pest.svg' },
  { id: 'postman', label: 'Postman', src: '/icons/postman.svg' },
  { id: 'github', label: 'Git / GitHub', src: '/icons/github.svg' },
  { id: 'composer', label: 'Composer', src: '/icons/composer.svg' },
  { id: 'jira', label: 'Jira', src: '/icons/jira.svg' },
  { id: 'slack', label: 'Slack', src: '/icons/slack.svg' },
  { id: 'figma', label: 'Figma', src: '/icons/figma.svg' },
  { id: 'phpstorm', label: 'PHPStorm', src: '/icons/phpstorm.svg' },
  { id: 'vscode', label: 'VS Code', src: '/icons/vscode.svg' },
  { id: 'cursor', label: 'Cursor', src: '/icons/cursor.svg' },
  { id: 'claude', label: 'Claude Code', src: '/icons/claude.svg' },
]

export const ICON_BY_ID = Object.fromEntries(ICON_OPTIONS.map((o) => [o.id, o])) as Record<
  string,
  IconOption
>

export function mergeIconOptions(custom: IconOption[]) {
  const merged = new Map<string, IconOption>()
  for (const option of ICON_OPTIONS) merged.set(option.id, { ...option, isBuiltIn: true })
  for (const option of custom) merged.set(option.id, option)
  return [...merged.values()].sort((a, b) => a.label.localeCompare(b.label))
}

export function findIconByName(name: string, options: IconOption[]) {
  const normalized = normalizeIconName(name)
  return options.find(
    (option) =>
      normalizeIconName(option.id) === normalized || normalizeIconName(option.label) === normalized,
  )
}

export const TECH_TAG_SUGGESTIONS = [
  'PHP',
  'Laravel',
  'MySQL',
  'JavaScript',
  'TypeScript',
  'React',
  'Next.js',
  'Vue.js',
  'HTML/CSS',
  'Git',
  'Jira',
  'PhpStorm',
  'WordPress',
  'Magento 2',
  'Docker',
  'AWS',
  'PostgreSQL',
  'Supabase',
  'Node.js',
  'REST API',
]

export const CERT_PLATFORMS = [
  'Coursera',
  'Udemy',
  'LinkedIn Learning',
  'edX',
  'Google',
  'Meta',
  'AWS',
  'Microsoft',
  'freeCodeCamp',
  'Other',
]

const icons: Record<string, string> = {
  php: '/icons/php.svg',
  laravel: '/icons/laravel.svg',
  symfony: '/icons/symfony.svg',
  magento: '/icons/magento.svg',
  wordpress: '/icons/wordpress.svg',
  nodejs: '/icons/nodejs.svg',
  javascript: '/icons/javascript.svg',
  typescript: '/icons/typescript.svg',
  react: '/icons/react.svg',
  nextjs: '/icons/nextjs.svg',
  vue: '/icons/vue.svg',
  html: '/icons/html.svg',
  css: '/icons/css.svg',
  bootstrap: '/icons/bootstrap.svg',
  tailwindcss: '/icons/tailwindcss.svg',
  framermotion: '/icons/framermotion.svg',
  sass: '/icons/sass.svg',
  mysql: '/icons/mysql.svg',
  mariadb: '/icons/mariadb.svg',
  postgresql: '/icons/postgresql.svg',
  mongodb: '/icons/mongodb.svg',
  redis: '/icons/redis.svg',
  restapi: '/icons/restapi.svg',
  json: '/icons/json.svg',
  xml: '/icons/xml.svg',
  yaml: '/icons/yaml.svg',
  aws: '/icons/aws.svg',
  docker: '/icons/docker.svg',
  vercel: '/icons/vercel.svg',
  linux: '/icons/linux.svg',
  windows: '/icons/windows.svg',
  pest: '/icons/pest.svg',
  postman: '/icons/postman.svg',
  github: '/icons/github.svg',
  composer: '/icons/composer.svg',
  jira: '/icons/jira.svg',
  slack: '/icons/slack.svg',
  figma: '/icons/figma.svg',
  phpstorm: '/icons/phpstorm.svg',
  vscode: '/icons/vscode.svg',
  cursor: '/icons/cursor.svg',
  claude: '/icons/claude.svg',
}

type TechIconProps = {
  id: string
  title: string
}

export function TechIcon({ id, title }: TechIconProps) {
  const src = icons[id]
  const letter = title.replace(/[^A-Za-z0-9]/g, '').slice(0, 1).toUpperCase() || '?'

  if (!src) {
    return (
      <span className="stack-tool-fallback" aria-hidden="true">
        {letter}
      </span>
    )
  }

  return (
    <img
      src={src}
      alt=""
      title={title}
      className="stack-tool-icon"
      width={44}
      height={44}
    />
  )
}

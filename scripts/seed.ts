import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { createClient } from '@supabase/supabase-js'
import { getFallbackContent } from '../src/lib/fallback-content'

function loadEnvFile(filename: string) {
  const path = resolve(process.cwd(), filename)
  if (!existsSync(path)) return
  const text = readFileSync(path, 'utf8')
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    const key = trimmed.slice(0, eq).trim()
    let value = trimmed.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

async function main() {
  loadEnvFile('.env.local')
  loadEnvFile('.env')

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) {
    throw new Error(
      'Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local before seeding',
    )
  }

  const supabase = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  })
  const content = getFallbackContent()

  await supabase.from('project_images').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('project_stack').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('projects').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('skills').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('skill_groups').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('social_links').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('experience').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('education').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('certifications').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('workflow_steps').delete().neq('id', '00000000-0000-0000-0000-000000000000')
  await supabase.from('site_settings').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  const { error: settingsError } = await supabase.from('site_settings').insert({
    name: content.site.name,
    greeting: content.site.greeting,
    title: content.site.title,
    email: content.site.email,
    location: content.site.location,
    stats: content.site.stats,
    about_kicker: content.site.about_kicker,
    about_heading: content.site.about_heading,
    about_body: content.site.about_body,
    portrait_url: content.site.portrait_url,
  })
  if (settingsError) throw settingsError

  const { error: socialError } = await supabase.from('social_links').insert(
    content.socials.map((s, index) => ({
      label: s.label,
      url: s.url,
      icon_key: s.icon_key,
      sort_order: index,
      is_active: s.is_active,
    })),
  )
  if (socialError) throw socialError

  for (const [gi, group] of content.skillGroups.entries()) {
    const { data: groupRow, error: groupError } = await supabase
      .from('skill_groups')
      .insert({ category: group.category, sort_order: gi })
      .select('id')
      .single()
    if (groupError) throw groupError
    if (group.items.length) {
      const { error: skillError } = await supabase.from('skills').insert(
        group.items.map((item, ii) => ({
          group_id: groupRow.id,
          name: item.name,
          icon_id: item.icon_id,
          sort_order: ii,
        })),
      )
      if (skillError) throw skillError
    }
  }

  for (const [pi, project] of content.projects.entries()) {
    const { data: projectRow, error: projectError } = await supabase
      .from('projects')
      .insert({
        slug: project.slug,
        name: project.name,
        hook: project.hook,
        cover_url: project.cover,
        tag: project.tag,
        year: project.year,
        problem: project.problem,
        role: project.role,
        features: project.features,
        challenges: project.challenges,
        architecture: project.architecture ?? null,
        workflow: project.workflow ?? null,
        results: project.results ?? null,
        live_url: project.links.live,
        github_url: project.links.github,
        sort_order: pi,
        is_published: true,
      })
      .select('id')
      .single()
    if (projectError) throw projectError

    if (project.stack.length) {
      const { error: stackError } = await supabase.from('project_stack').insert(
        project.stack.map((item, ii) => ({
          project_id: projectRow.id,
          icon_id: item.id,
          name: item.name,
          sort_order: ii,
        })),
      )
      if (stackError) throw stackError
    }

    if (project.gallery.length) {
      const { error: imageError } = await supabase.from('project_images').insert(
        project.gallery.map((url, ii) => ({
          project_id: projectRow.id,
          url,
          sort_order: ii,
        })),
      )
      if (imageError) throw imageError
    }
  }

  const { error: expError } = await supabase.from('experience').insert(
    content.experience.map((item, index) => ({
      role: item.role,
      company: item.company,
      period: item.period,
      location: item.location,
      stack: item.stack,
      summary: item.summary,
      points: item.points,
      sort_order: index,
    })),
  )
  if (expError) throw expError

  const { error: eduError } = await supabase.from('education').insert(
    content.education.map((item, index) => ({
      school: item.school,
      degree: item.degree,
      period: item.period,
      place: item.place,
      sort_order: index,
    })),
  )
  if (eduError) throw eduError

  const { error: certError } = await supabase.from('certifications').insert(
    content.certifications.map((item, index) => ({
      title: item.title,
      issuer: item.issuer,
      platform: item.platform,
      date: item.date,
      note: item.note ?? null,
      image_url: item.image,
      url: item.url,
      sort_order: index,
    })),
  )
  if (certError) throw certError

  const { error: workflowError } = await supabase.from('workflow_steps').insert(
    content.workflow.map((item, index) => ({
      step: item.step,
      title: item.title,
      text: item.text,
      sort_order: index,
    })),
  )
  if (workflowError) throw workflowError

  console.log('Seed complete.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

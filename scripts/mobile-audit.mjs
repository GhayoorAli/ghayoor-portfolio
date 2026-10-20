import { chromium, webkit } from 'playwright'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const baseURL = process.env.AUDIT_URL || 'http://127.0.0.1:3000'
const output = process.env.AUDIT_OUTPUT || '/tmp/portfolio-mobile-audit'
const safari = process.env.AUDIT_ENGINE === 'webkit'
const browser = await (safari ? webkit.launch({ headless: true }) : chromium.launch({ channel: process.env.AUDIT_BROWSER || 'chrome', headless: true }))
const report = { baseURL, layouts: [], projects: [], failures: [], performance: [] }
const check = (condition, message) => { if (!condition) report.failures.push(message) }
const shot = async (page, name) => page.screenshot({ path: path.join(output, `${name}.png`) })
await mkdir(output, { recursive: true })
let routes = []

try {
  const viewports = JSON.parse(process.env.AUDIT_VIEWPORTS || '[[320,568],[360,800],[390,844],[430,932],[768,1024],[844,390],[1440,900]]')
  for (const [width, height] of viewports) {
    const touch = width < 1200
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2, isMobile: touch, hasTouch: touch })
    const page = await context.newPage()
    page.setDefaultTimeout(12000)
    const errors = []
    page.on('pageerror', error => errors.push(error.message))
    await page.addInitScript(() => {
      window.auditRaf = 0
      const request = window.requestAnimationFrame
      window.requestAnimationFrame = callback => request(time => { window.auditRaf++; callback(time) })
    })
    await page.goto(baseURL, { waitUntil: 'networkidle' })
    await page.waitForTimeout(3300)
    routes = await page.locator('.ref-project').evaluateAll(links => links.map(link => link.getAttribute('href')))
    const start = await page.evaluate(() => window.auditRaf)
    await page.waitForTimeout(1000)
    const idleFrames = await page.evaluate(() => window.auditRaf) - start
    if (touch) check(idleFrames < 5, `${width}: ${idleFrames} animation callbacks while idle`)
    if (touch && width <= 580 && height <= 700) {
      const ctaBottom = await page.locator('.ref-hero-pitch .ref-button').evaluateAll(elements => Math.max(...elements.map(element => element.getBoundingClientRect().bottom)))
      check(ctaBottom <= height + 1, `${width}×${height}: hero actions fall below the first screen`)
    }
    const heroPitch = await page.locator('.ref-hero-pitch').evaluate(element => ({ overflow: element.scrollWidth - element.clientWidth }))
    check(heroPitch.overflow <= 2, `${width}: hero pitch clips by ${heroPitch.overflow}px`)
    const sections = []
    for (const id of ['top', 'about', 'work', 'benefits', 'skills', 'contact', 'credentials', 'faq']) {
      await page.locator(`#${id}`).evaluate(element => window.scrollTo({ top: element.getBoundingClientRect().top + scrollY - 104, behavior: 'instant' }))
      await page.waitForTimeout(1350)
      const layout = await page.locator(`#${id}`).evaluate(element => ({ id: element.id, overflow: element.scrollWidth - element.clientWidth }))
      sections.push(layout)
      check(layout.overflow <= 2, `${width}: ${id} overflows by ${layout.overflow}px`)
      await shot(page, `home-${width}-${id}`)
    }
    const pageOverflow = await page.evaluate(() => document.documentElement.scrollWidth) - width
    check(pageOverflow <= 2, `${width}: document overflows by ${pageOverflow}px`)
    if (touch) {
      check(await page.locator('.ref-work').evaluate(element => !element.classList.contains('is-pinned')), `${width}: projects incorrectly pin on touch`)
      await page.locator('.ref-menu-toggle').click()
      const menu = await page.locator('.ref-sidebar .ref-nav').boundingBox()
      check(menu && menu.y >= 0 && menu.y + menu.height <= height + 1, `${width}: expanded menu exceeds the viewport`)
      await page.locator('.ref-sidebar .ref-nav a[href="#skills"]').click()
      await page.waitForTimeout(1300)
      const targetTop = await page.locator('#skills').evaluate(element => element.getBoundingClientRect().top)
      check(Math.abs(targetTop - 104) < 5, `${width}: skills anchor covered/misaligned (${targetTop}px)`)
      await page.locator('#about .ref-read-more').first().click()
      const modal = page.getByRole('dialog')
      await modal.waitFor({ state: 'visible' })
      const bounds = await modal.boundingBox()
      check(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 1 && bounds.height <= height, `${width}: detail dialog exceeds viewport`)
      await shot(page, `modal-${width}`)
      await page.locator('.ref-modal-close').click()
      await modal.waitFor({ state: 'hidden' })
      const faq = page.locator('.ref-faq-item>button').first()
      await faq.click()
      check(await faq.getAttribute('aria-expanded') === 'true', `${width}: FAQ did not expand`)
      await faq.click()
      await page.locator('#work').evaluate(element => element.scrollIntoView({ behavior: 'instant' }))
      const rail = page.locator('.ref-project-window')
      const position = await rail.evaluate(element => { element.scrollLeft = element.querySelector('.ref-project-shell').getBoundingClientRect().width + 24; return element.scrollLeft })
      check(position > 0, `${width}: project rail cannot scroll horizontally`)
    }
    check(errors.length === 0, `${width}: runtime errors: ${errors.join('; ')}`)
    report.layouts.push({ width, height, idleFrames, sections, errors, pageOverflow })
    console.log(`Homepage ${width}×${height}: idle callbacks ${idleFrames}; checked all eight sections and interactions`)
    await context.close()
  }

  if (!process.env.AUDIT_LAYOUT_ONLY) {
  for (const width of JSON.parse(process.env.AUDIT_PROJECT_WIDTHS || '[320,390,844]')) {
    const context = await browser.newContext({ viewport: { width, height: width >= 900 ? 768 : width === 844 ? 390 : 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true })
    const page = await context.newPage()
    page.setDefaultTimeout(15000)
    for (const route of routes) {
      const errors = []
      const listener = error => errors.push(error.message)
      page.on('pageerror', listener)
      const response = await page.goto(new URL(route, baseURL).href, { waitUntil: 'networkidle' })
      check(response?.status() === 200, `${width} ${route}: HTTP ${response?.status()}`)
      await page.waitForTimeout(300)
      const titleOverflow = await page.locator('.ref-case-hero h1').evaluate(element => element.scrollWidth - element.clientWidth)
      check(titleOverflow <= 2, `${width} ${route}: title clips by ${titleOverflow}px`)
      await shot(page, `project-${width}-${route.split('/').pop()}`)
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth) - width
      check(overflow <= 2, `${width} ${route}: horizontal overflow ${overflow}px`)
      await page.locator('.ref-menu-toggle').click()
      const nav = await page.locator('.ref-case-sidebar .ref-nav').boundingBox()
      const height = page.viewportSize().height
      check(nav && nav.y + nav.height <= height + 1, `${width} ${route}: project menu exceeds viewport`)
      await page.locator('.ref-menu-toggle').click()
      if (width === 390) {
        const diagram = page.locator('.project-diagram').first()
        if (await diagram.count()) {
          await diagram.scrollIntoViewIfNeeded()
          await diagram.waitFor({ state: 'visible' })
          await page.waitForFunction(() => document.querySelector('.project-diagram')?.getAttribute('aria-busy') === 'false', undefined, { timeout: 20000 })
          check(await page.locator('.project-diagram svg').count() > 0, `${route}: diagram failed to render`)
        }
        const next = page.getByRole('button', { name: 'Next screenshot', exact: true })
        if (await next.count()) {
          const count = page.locator('.project-carousel-count')
          const previous = await count.textContent()
          await next.click()
          await page.waitForTimeout(500)
          check(await count.textContent() !== previous, `${route}: gallery did not advance`)
        }
      }
      check(errors.length === 0, `${width} ${route}: runtime errors: ${errors.join('; ')}`)
      report.projects.push({ width, route, overflow, errors })
      page.off('pageerror', listener)
      console.log(`Project ${width}: ${route}`)
    }
    await context.close()
  }

  if (!safari && !process.env.AUDIT_SKIP_PERFORMANCE) {
  // Repeat cold loads. These are lab measurements, not field Core Web Vitals.
  const targets = [baseURL, ...(process.env.AUDIT_COMPARE_URL ? [process.env.AUDIT_COMPARE_URL] : [])]
  for (const url of targets) for (const density of [2, 3]) for (let run = 1; run <= 3; run++) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: density, isMobile: true, hasTouch: true })
    const page = await context.newPage()
    const cdp = await context.newCDPSession(page)
    await cdp.send('Network.enable')
    await cdp.send('Network.emulateNetworkConditions', { offline: false, latency: 150, downloadThroughput: 200000, uploadThroughput: 100000 })
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 })
    await page.addInitScript(() => {
      window.metrics = { lcp: 0, cls: 0, longTasks: [] }
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.metrics.lcp = entry.startTime }).observe({ type: 'largest-contentful-paint', buffered: true })
      new PerformanceObserver(list => { for (const entry of list.getEntries()) if (!entry.hadRecentInput) window.metrics.cls += entry.value }).observe({ type: 'layout-shift', buffered: true })
      new PerformanceObserver(list => { for (const entry of list.getEntries()) window.metrics.longTasks.push(entry.duration) }).observe({ type: 'longtask', buffered: true })
    })
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 })
    await page.waitForTimeout(1000)
    const metrics = await page.evaluate(() => ({ ...window.metrics, ttfb: performance.getEntriesByType('navigation')[0].responseStart, bytes: performance.getEntriesByType('resource').reduce((sum, resource) => sum + resource.transferSize, 0), portrait: document.querySelector('.ref-portrait-image')?.currentSrc }))
    let scrolling
    if (run === 1) scrolling = await page.evaluate(() => new Promise(resolve => {
      const frames = []
      const start = performance.now()
      let previous = start
      const distance = document.documentElement.scrollHeight - innerHeight
      const step = now => {
        frames.push(now - previous)
        previous = now
        const progress = Math.min(1, (now - start) / 5000)
        scrollTo({ top: distance * progress, behavior: 'instant' })
        if (progress < 1) requestAnimationFrame(step)
        else {
          frames.sort((a, b) => a - b)
          resolve({ frames: frames.length, p95FrameMs: frames[Math.floor(frames.length * .95)], framesOver50ms: frames.filter(frame => frame > 50).length })
        }
      }
      requestAnimationFrame(step)
    }))
    report.performance.push({ url, density, run, ...metrics, scrolling })
    console.log(`Cold load ${url} DPR${density} #${run}: LCP ${Math.round(metrics.lcp)}ms, ${metrics.bytes} bytes`)
    await context.close()
  }
  }
  }
} catch (error) {
  report.failures.push(error.stack || error.message)
} finally {
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2))
  await browser.close()
}
console.log(`Report: ${path.join(output, 'report.json')}; failures: ${report.failures.length}`)
if (report.failures.length) { console.error(report.failures.join('\n')); process.exitCode = 1 }

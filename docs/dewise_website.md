# Repository Analysis — `dewise-website` (Next.js)

This report is a comprehensive, file-by-file analysis of the repository as currently committed. It is intended to let a new engineer rebuild, extend, or replicate the site without prior context.

---

## 1) Tech Stack (dependency versions)

### Runtime dependencies (`package.json`)

From `package.json`, the declared dependencies are:

- **`gray-matter`**: `^4.0.3` (lockfile resolved: **4.0.3**)
- **`next`**: **14.2.5**
- **`next-mdx-remote`**: `^5.0.0` (lockfile resolved: **5.0.0**)
- **`react`**: **18.3.1**
- **`react-dom`**: **18.3.1**
- **`remark-gfm`**: `^4.0.1` (lockfile resolved: **4.0.1**)

### Dev dependencies (`package.json`)

- **`@types/node`**: **24.2.1**
- **`@types/react`**: **19.1.9**
- **`autoprefixer`**: `^10.4.19` (lockfile resolved: **10.4.21**)
- **`postcss`**: `^8.4.38` (lockfile resolved: **8.5.6**)
- **`tailwindcss`**: `^3.4.9` (lockfile resolved: **3.4.17**)
- **`typescript`**: `^5.4.5` (lockfile resolved: **5.9.2**)

### Tooling / platforms

- **Framework**: Next.js **App Router** (directory-based routing under `app/`)
- **Build target**: **Static export** (`next export`) for GitHub Pages
- **Styling**: Tailwind CSS + a large custom CSS layer in `app/globals.css`
- **Content**: MDX files in `content/` rendered with `next-mdx-remote/rsc`
- **CMS (configured but not wired to real repo yet)**: Decap CMS (loaded via CDN in `public/admin/index.html`)
- **CI/CD**: GitHub Actions deploy to GitHub Pages (`.github/workflows/deploy.yml`)
- **Node version in CI**: **Node 20** (see workflow)

---

## 2) Project Structure (full tracked tree + what each file does)

Below is the **full list of tracked files** with a one-line description for each.

### Root

- **`.gitignore`**: ignores OS junk and build artifacts (`node_modules`, `.next`, `out`, generated `public/images/index.json`, etc.)
- **`IMPLEMENTATION_PLAN.md`**: design/architecture plan and roadmap for the site
- **`README.md`**: setup/dev/build/export instructions and high-level project overview
- **`WEBSITE_CONTENT.md`**: long-form “content spec” that mirrors page copy and content structure
- **`context.md`**: long-form research/notes used to inform site copy (not used at runtime)
- **`enhancement ideas 1.md`**: additional research + content recommendations (not used at runtime)
- **`next-env.d.ts`**: Next.js TypeScript environment types (generated file, tracked)
- **`next.config.mjs`**: Next.js configuration (static export + GH Pages basePath + unoptimized images)
- **`package.json`**: scripts + dependency manifest
- **`package-lock.json`**: resolved dependency graph for `npm ci`
- **`postcss.config.cjs`**: PostCSS config enabling Tailwind + Autoprefixer
- **`tailwind.config.ts`**: Tailwind config (content globs + a small `extend.colors`)
- **`tsconfig.json`**: TypeScript compiler configuration (strict, `@/*` path alias, Next plugin)

### `.github/`

- **`.github/workflows/deploy.yml`**: GitHub Actions workflow that builds and deploys `./out` to GitHub Pages

### `app/` (Next.js App Router)

- **`app/layout.tsx`**: root layout; sets global metadata and wraps all pages (imports `globals.css`)
- **`app/globals.css`**: Tailwind directives + custom design tokens (CSS variables) + custom utility classes + component-like CSS classes
- **`app/not-found.tsx`**: default 404 page UI

#### Top-level routes

- **`app/page.tsx`**: homepage (hero + focus areas + projects + partners + newsletter; composes `Nav`, `Footer`, and `Gallery`)
- **`app/about/page.tsx`**: about page (mission/values/vision, impact, timeline, testimonials, CTAs)
- **`app/achievements/page.tsx`**: achievements/recognition page (certificates, awards, crisis response, innovation ecosystem)
- **`app/careers/page.tsx`**: careers page (hardcoded job openings + benefits + application process)
- **`app/contact/page.tsx`**: contact page (info + form UI; no submit backend)
- **`app/donate/page.tsx`**: donate page (tiers + custom amount UI; buttons are placeholders)
- **`app/founders/page.tsx`**: founders page (filters `site.team` by founder roles)
- **`app/impact/page.tsx`**: impact page (hardcoded metric cards)
- **`app/partners/page.tsx`**: partners list page (simple grid with partner names)
- **`app/partnerships/page.tsx`**: partnerships marketing page (partner cards + partnership areas/process)
- **`app/team/page.tsx`**: team page (renders `site.team`; CTA to email CV)

#### Program routes

- **`app/programs/page.tsx`**: programs index (cards linking to 4 program subpages)
- **`app/programs/clean-energy/page.tsx`**: clean energy program page (intro text only)
- **`app/programs/climate-action/page.tsx`**: climate action program page (intro text only)
- **`app/programs/community-engagement/page.tsx`**: community engagement page (pulls objectives/activities/impact from `site.focusAreas`)
- **`app/programs/youth-empowerment/page.tsx`**: youth empowerment program page (intro text only)

#### Content routes (MDX)

- **`app/blog/page.tsx`**: blog index; lists posts from `content/blog/*`
- **`app/blog/[slug]/page.tsx`**: blog post detail; statically generates params and renders MDX with `next-mdx-remote/rsc`
- **`app/news/page.tsx`**: news index; lists items from `content/news/*`
- **`app/news/[slug]/page.tsx`**: news detail; statically generates params and renders MDX with `next-mdx-remote/rsc`

#### Project routes (data-driven)

- **`app/projects/page.tsx`**: projects index; lists projects from `site.projects`
- **`app/projects/[slug]/page.tsx`**: project detail; statically generates params and renders a rich data-driven page from `site.projects`

### `components/` (reusable UI)

- **`components/Footer.tsx`**: site footer, newsletter UI, and social link icons (driven by `site.socials`)
- **`components/Gallery.tsx`**: client-side image gallery; uses a curated list of images (does *not* read the generated `index.json`)
- **`components/ImageWithFallback.tsx`**: `<img>` wrapper with runtime error fallback (shows emoji/placeholder if load fails)
- **`components/LanguageSwitcher.tsx`**: EN/FR toggle stored in `localStorage` (currently does not change page content)
- **`components/Nav.tsx`**: responsive navigation with hover dropdowns (About/Impact), mobile menu, and GH Pages image basePath helper

### `lib/` (data + utilities)

- **`lib/content.ts`**: file-system content loader for `content/blog` and `content/news` (frontmatter extraction + sorting + slug handling)
- **`lib/siteData.ts`**: primary site “database” (hero, focus areas, projects, partners, team, testimonials, timeline, donation tiers, images)

### `content/` (MDX content)

- **`content/blog/hello-world.mdx`**: sample blog post with frontmatter (`title`, `date`, `summary`, `tags`)
- **`content/news/launch.mdx`**: sample news item with similar frontmatter

### `public/` (static assets served at site root)

- **`public/.nojekyll`**: forces GitHub Pages to not run Jekyll processing
- **`public/admin/config.yml`**: Decap CMS collection schema (blog + news); backend repo placeholder
- **`public/admin/index.html`**: Decap CMS entrypoint (loads Decap via CDN)
- **`public/og-default.png`**: default Open Graph image referenced by metadata (**notably tracked as an empty file in this repo**)

### `scripts/`

- **`scripts/sync-images.js`**: copies image files from `pictures/` → `public/images/` and generates `public/images/index.json`

### `static/`

- **`static/admin/config.yml`**: duplicate of `public/admin/config.yml` (same placeholder backend settings)

### Image asset directories (tracked binaries)

These directories contain **tracked photo/logo assets** used in pages and/or copied into `public/images/`.

- **`logos_profile pics/*`**: raw source logos/profile photos (42 total images across repo; many duplicates exist in `public/images/` and `pictures/`)
- **`pictures/*`**: source photos for the sync script (copied into `public/images/` at build/dev time)
- **`public/images/*`**: publicly served images referenced in `siteData` and components (committed copies of many `pictures/` and `logos_profile pics/` assets)

---

## 3) Architecture (routing, composition, data flow)

### Routing model

- **App Router** routing comes from the `app/` directory:
  - Static routes are folders with `page.tsx` (e.g., `app/about/page.tsx` → `/about`).
  - Dynamic routes use bracket syntax:
    - `app/blog/[slug]/page.tsx` → `/blog/:slug`
    - `app/news/[slug]/page.tsx` → `/news/:slug`
    - `app/projects/[slug]/page.tsx` → `/projects/:slug`

### Static export + base path

`next.config.mjs` sets:

- `output: 'export'`: the site is exported to static HTML (no Node server at runtime)
- `basePath: '/dewise-website'`: all routes are served under that subpath on GitHub Pages
- `trailingSlash: true`: URLs become `/about/` style, matching static folder structure
- `images.unoptimized: true`: uses plain `<img>` and avoids Next’s image optimization pipeline (important for static export)

### Composition model

- The site uses a **per-page composition** approach:
  - Most pages explicitly render `<Nav />` at the top and `<Footer />` at the bottom.
  - `app/layout.tsx` does **not** include `Nav`/`Footer`; it only wraps `children` with `<html>` and `<body>` and defines metadata.

### Primary data sources

- **`lib/siteData.ts`** is the main structured data store for:
  - homepage hero copy
  - focus areas (programs)
  - projects (including detail page data)
  - partners, team, socials, timeline, testimonials, donation tiers
  - image references (strings; many are `getImagePath('/images/...')`)

- **MDX content** lives in:
  - `content/blog/*.mdx`
  - `content/news/*.mdx`

### Data flow by page type

- **Data-driven pages (siteData)**:
  - Homepage uses `site.hero`, `site.focusAreas`, `site.projects`, `site.partners`, plus `site.projectImages`.
  - `/projects/[slug]` finds a project by slug in `site.projects` and renders multiple sections based on optional fields (photos, context, youthTraining, recognition).
  - `/founders` filters `site.team` by role.

- **Filesystem-driven MDX pages**:
  - Blog/news indexes call `getBlogList()` / `getNewsList()` at render time (server component context) to build a list.
  - Blog/news detail pages:
    - use `generateStaticParams()` so Next can generate each MDX page at export time
    - read the content file with `fs.readFileSync`
    - parse frontmatter with `gray-matter`
    - render markdown with `MDXRemote` and `remark-gfm` (tables, strikethrough, etc.)

### Client-side interactivity

Only a few components are client components:

- `components/Nav.tsx` (`"use client"`) for dropdown and mobile state
- `components/Gallery.tsx` (`"use client"`) for state initialization of curated images
- `components/ImageWithFallback.tsx` (`"use client"`) for error fallback state
- `components/LanguageSwitcher.tsx` (`"use client"`) for persisted language selection

There is **no backend/API** in this repo; forms/donations are currently UI-only placeholders (or `mailto:` links).

---

## 4) Styling System (framework, tokens, palette, typography, spacing)

### CSS framework

- Tailwind CSS is used via:
  - `app/globals.css` (`@tailwind base; @tailwind components; @tailwind utilities;`)
  - `tailwind.config.ts` specifying content globs for `app/` and `components/`

### Color palette (exact hex values)

There are **two** color systems in play:

#### A) CSS variables in `app/globals.css` (the “African-inspired palette”)

Defined in `:root`:

- `--color-earth`: **#8B4513**
- `--color-sand`: **#F4E4BC**
- `--color-terracotta`: **#CD5C5C**
- `--color-forest`: **#2F4F2F**
- `--color-sunset`: **#D2691E**
- `--color-sky`: **#4682B4**
- `--color-gold`: **#DAA520**
- `--color-charcoal`: **#36454F**
- `--color-cream`: **#FDF5E6**
- `--color-amber`: **#FF8C00**

These are mapped into custom utility-like classes via `@layer utilities`:

- Backgrounds: `.bg-earth`, `.bg-sand`, `.bg-terracotta`, `.bg-forest`, `.bg-sunset`, `.bg-sky`, `.bg-gold`, `.bg-charcoal`, `.bg-cream`, `.bg-amber`
- Text: `.text-earth`, `.text-sand`, `.text-terracotta`, `.text-forest`, `.text-sunset`, `.text-sky`, `.text-gold`, `.text-charcoal`, `.text-cream`, `.text-amber`
- Borders: `.border-earth`, `.border-sand`, `.border-terracotta`, `.border-forest`, `.border-sky`, `.border-gold`

#### B) Tailwind `extend.colors` in `tailwind.config.ts`

Adds:

- `primary`: **#0ea5e9**
- `secondary`: **#0f766e**
- `accent`: **#f59e0b**

Note: most of the UI uses the **CSS-variable-based palette** via class names like `bg-sand`, `text-charcoal`, etc. Some pages also use default Tailwind grays (`text-gray-700`, `border-gray-200`) which creates a mixed system.

### Typography (fonts, sizes, weights)

- There is **no explicit font family** configuration or import; the site uses the browser/system default font stack.
- `app/globals.css` sets:
  - `body`: `@apply text-charcoal bg-cream;` (color/background)
  - all headings `h1..h6`: `@apply font-semibold text-charcoal;`
- Tailwind typography is used heavily:
  - Homepage hero uses `text-4xl`, `sm:text-5xl`, `font-bold`, `tracking-tight`
  - Blog/news MDX pages use Tailwind Typography classes: `prose prose-sky`

### Spacing system and layout tokens

Custom spacing/layout classes in `app/globals.css`:

- **`.section-padding`**: `py-16 px-6`
- **`.container-max`**: `max-w-7xl mx-auto`
- **`.container`**: `mx-auto max-w-7xl px-6` (overlaps with Tailwind’s built-in `.container` concept; here it’s custom)

Responsive/layout helpers:

- `.responsive-text`: `font-size: clamp(1.25rem, 3vw, 2rem); line-height: 1.2;`
- `.responsive-spacing`: `padding: clamp(1rem, 4vw, 3rem); margin: clamp(0.5rem, 2vw, 1.5rem);`
- `.responsive-grid`: `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem;`

### Design tokens / patterns baked into CSS

Component-like classes:

- Buttons:
  - `.btn-primary`, `.btn-secondary`, `.btn-accent`
  - all use `transition-all duration-200` and focus rings
- Cards:
  - `.card` and `.card-accent` with border + hover shadow/border changes
- Section backgrounds:
  - `.section-light`, `.section-accent`, `.section-dark`
- Decorative:
  - `.african-pattern` (radial gradient dot motif)
  - `.african-border` (gradient border via `::before`)

---

## 5) Components (what they do, props, where used)

This section covers each reusable component in `components/`.

### `ImageWithFallback`

- **File**: `components/ImageWithFallback.tsx`
- **Purpose**: renders an `<img>` and swaps to a fallback UI (emoji/placeholder) if the image fails to load.
- **Props**:
  - `src: string` (required)
  - `alt: string` (required)
  - `fallback?: string` (default `'🖼️'`)
  - `className?: string` (default `''`)
  - `width?: number`
  - `height?: number`
- **Usage**:
  - `Nav` (logo)
  - `Footer` (logo)
  - Homepage (`app/page.tsx`) for project images and partner logos
  - Achievements page (certificates and “work in action” images)
  - Founders page (profile photos)
  - Team page (profile photos)
  - Project detail page (project photos)
  - Gallery thumbnails
- **Notable implementation detail**:
  - Uses plain `<img>` (not `next/image`) to keep static export simple.
  - Sets `loading="eager"` for all images, which prioritizes loading but can hurt performance on image-heavy pages.

### `Nav`

- **File**: `components/Nav.tsx`
- **Purpose**: global navigation with:
  - desktop links and hover-driven dropdowns (About + Impact)
  - mobile hamburger menu
  - GH Pages basePath helper for image URLs
- **Props**: none (hardcoded structure)
- **Usage**: included in nearly every page.
- **Notable implementation details**:
  - Uses `process.env.NODE_ENV === 'production'` to decide base path prefix `'/dewise-website'` for images. This is duplicated in multiple files.
  - Dropdown hide uses a 300ms timeout to allow moving into the dropdown without it disappearing.

### `Footer`

- **File**: `components/Footer.tsx`
- **Purpose**: global footer with:
  - logo + mission line
  - program/project quick links
  - newsletter UI (input + button; no submission integration)
  - social links based on `site.socials` (renders inline SVG icons by label)
- **Props**: none
- **Usage**: included in nearly every page.
- **Notable implementation detail**:
  - Same GH Pages basePath helper pattern as `Nav`.

### `Gallery`

- **File**: `components/Gallery.tsx`
- **Purpose**: displays a responsive grid of image thumbnails.
- **Props**:
  - `limit?: number` (optional; slices curated list)
- **Usage**:
  - Homepage (`app/page.tsx`) uses `<Gallery limit={6} />`.
- **Notable implementation details**:
  - Uses a **curated list hardcoded inside the component**.
  - The build script generates `public/images/index.json`, but `Gallery` does **not** read it.

### `LanguageSwitcher`

- **File**: `components/LanguageSwitcher.tsx`
- **Purpose**: toggles EN/FR and persists choice in `localStorage`.
- **Props**: none
- **Usage**: currently not imported by any page/component in the tracked code.
- **Notable**:
  - State is stored, but there’s no dictionary system and no routing-based i18n; it does not affect visible content.

---

## 6) Content System (MDX, structure, rendering)

### Content layout on disk

- Blog posts: `content/blog/*.mdx`
- News posts: `content/news/*.mdx`

### Frontmatter schema (as used by code)

`lib/content.ts` reads frontmatter via `gray-matter` and returns:

- `slug`: derived from filename
- `title`: `data.title` or slug
- `date`: supports string dates; converts JS Date to ISO `YYYY-MM-DD` in metadata list
- `summary`: optional
- `tags`: optional array

### Index pages

- `/blog` (`app/blog/page.tsx`)
  - calls `getBlogList()` (server component context)
  - displays title/date/summary for each
  - sets `export const dynamic = 'force-static'` (ensures static output)

- `/news` (`app/news/page.tsx`)
  - same pattern via `getNewsList()`

### Detail pages (MDX rendering)

Both `app/blog/[slug]/page.tsx` and `app/news/[slug]/page.tsx`:

- Use `generateStaticParams()` to build `{ slug }` list at export time.
- Read file contents with `fs.readFileSync(...)`.
- Parse frontmatter with `matter(raw)`.
- Render MDX body content using:
  - `MDXRemote` from `next-mdx-remote/rsc`
  - `remark-gfm` enabled via `mdxOptions.remarkPlugins`
- Wrap content in:
  - `article className="container prose prose-sky max-w-3xl py-12"`

### CMS (Decap) relationship

- The repo ships a Decap CMS UI at `/admin/`:
  - `public/admin/index.html` loads Decap from `unpkg.com`
  - `public/admin/config.yml` defines the blog and news collections pointing to the `content/` folders
- The backend config is a placeholder (`repo: YOUR_GH_USERNAME/YOUR_REPO_NAME`), meaning CMS will not work until configured.

---

## 7) Layout & Navigation

### Global layout (`app/layout.tsx`)

- Imports `app/globals.css` once for the whole app.
- Defines `metadata`:
  - `metadataBase` uses `NEXT_PUBLIC_SITE_URL` or defaults to the GitHub Pages URL.
  - sets OpenGraph and Twitter cards, pointing to `/og-default.png`.
- Wraps all pages with `<html lang="en">` and `<body className="min-h-screen bg-white text-gray-900 antialiased">`.

### Navigation (`components/Nav.tsx`)

- Desktop nav includes:
  - Home
  - About (dropdown: about/team/founders/partnerships)
  - Impact (dropdown: programs/projects)
  - Achievements
  - Careers
  - Contact
  - Donate (accent button)
- Mobile nav shows a stacked list of similar links.

### Footer (`components/Footer.tsx`)

- Provides:
  - Program links
  - Project links (hardcoded slugs: `wisebox`, `wisecool`, `solar-bright-minds`)
  - Connect links (about/team/careers/contact/donate)
  - Newsletter UI (no backend)
  - Social links derived from `site.socials` with label-based SVG selection

---

## 8) Visual Design Patterns (buttons, cards, sections, heroes, motion)

### Buttons

Defined in `app/globals.css`:

- **Primary**: `.btn-primary` (sky background → forest hover; focus ring)
- **Secondary**: `.btn-secondary` (cream + sky border → sky hover)
- **Accent**: `.btn-accent` (gold background → sunset hover)

Patterns:

- Most CTAs use these classes on `<Link>`, `<a>`, or `<button>`.
- Some pages also use inline Tailwind button styles (`rounded-md bg-primary ...`) rather than `.btn-*`, causing inconsistency.

### Cards

Defined in `app/globals.css`:

- `.card`: white background, sand border, subtle shadow, hover elevation + sky border
- `.card-accent`: sand background, gold border, hover shadow

Patterns:

- Homepage, achievements, founders, partnerships, and project detail pages heavily use `.card` / `.card-accent`.
- Some pages use plain Tailwind borders (`border-gray-200`) instead, leading to mixed visual language.

### Section patterns

Defined in `app/globals.css`:

- `.section-light` (cream)
- `.section-accent` (sand)
- `.section-dark` (charcoal + white text)
- `.section-padding` (py-16 px-6)

Homepage uses alternating “light/accent” sections plus gradients like `bg-gradient-to-b from-sand to-cream`.

### Hero patterns

Homepage hero:

- Split grid layout (`md:grid-cols-2`)
- Large H1 + subtitle + story card + CTA buttons
- Right column: gallery panel with border + translucent background

### Animation/transition patterns

- Most interactive elements use Tailwind transitions:
  - `transition-colors`, `transition-all`, `duration-200`
- Dropdown menus rely on delayed hide via JS timeout (not CSS animation).
- No global animation library; motion is minimal and mostly hover/focus transitions.

---

## 9) Configuration (Next, Tailwind, TS, site constants)

### `next.config.mjs`

- `output: 'export'` (static export)
- `basePath: '/dewise-website'` (GitHub Pages project site path)
- `images.unoptimized: true` (required/typical for static export without a server image optimizer)
- `trailingSlash: true` (static-friendly routing)

### `tailwind.config.ts`

- `content`: scans `./app/**/*.{ts,tsx}` and `./components/**/*.{ts,tsx}`
- `theme.extend.colors`: `primary`, `secondary`, `accent` (hex values listed above)
- no plugins enabled

### `postcss.config.cjs`

- enables `tailwindcss` and `autoprefixer`

### `tsconfig.json`

Key points:

- `strict: true`
- `moduleResolution: "Bundler"` (Next.js recommended for modern builds)
- `paths` alias: `@/*` → `./*` (so imports like `@/components/Nav`)
- includes `.cjs` and `.mjs` files for TS checking

### Site constants and data

The core site content is centralized in:

- `lib/siteData.ts` (hero, programs, projects, partners, team, socials, timeline, testimonials, donation tiers, image lists)

---

## 10) Deployment Setup (static export, GitHub Pages, CI/CD)

### Local build/export pipeline

Scripts in `package.json`:

- `sync:images`: runs `scripts/sync-images.js`
- `predev` / `prebuild`: ensures images are synced before dev/build
- `build`: `next build`
- `export`: `next export`
- `serve`: serves `out/` locally on port 5000

### GitHub Pages workflow

`.github/workflows/deploy.yml`:

- triggers on push to `main`
- runs `npm ci`, then `npm run build`
- uploads `./out` as the Pages artifact
- deploys using `actions/deploy-pages@v4`

### Static-hosting constraints that shape the codebase

- No server runtime → no API routes, no SSR requiring runtime fetches.
- Any dynamic content must be build-time-resolvable (MDX files or `siteData`).
- Base path must be handled carefully for asset URLs (hence the repeated “getImagePath” helper).

---

## 11) What’s Hardcoded vs Dynamic

### Hardcoded (in code)

- Most page copy and all structured “site content” is hardcoded in:
  - `lib/siteData.ts` (largest source of content)
  - many `app/**/page.tsx` files (especially careers, contact, donate UI, partnerships marketing copy)
- Navigation structure is hardcoded in `components/Nav.tsx`.
- Footer link lists are mostly hardcoded, except socials (`site.socials`).
- Gallery images are hardcoded in `components/Gallery.tsx`.
- Forms and donation actions are hardcoded UI only (no handlers, no provider integration).

### Dynamic (data-driven)

- **Projects**: project pages are dynamically generated from `site.projects` with `generateStaticParams()`.
- **Blog/News**:
  - dynamic slug pages are generated from filesystem content via `generateStaticParams()`.
  - frontmatter drives title/date/summary.

### “Pseudo-dynamic” / configured but not active

- Decap CMS is configured but uses placeholder GitHub repo settings, so it won’t function until edited.
- Language switcher stores preference but does not change the app’s rendered language.

---

## 12) Anything unusual or notable (flags + implications)

### Empty Open Graph image

- `public/og-default.png` is tracked but has **0 bytes** (an empty file). This will likely break social previews and may cause runtime console errors when the browser tries to fetch it.

### Image pipeline redundancy

- The repo includes:
  - `pictures/*` (source)
  - `public/images/*` (copied outputs)
  - `logos_profile pics/*` (additional sources)
  - plus a sync script (`scripts/sync-images.js`) that copies `pictures/` → `public/images/`
- Many images are duplicated across these directories and are committed multiple times.
- The script also generates `public/images/index.json`, but `.gitignore` excludes it and `Gallery` does not use it.

### Inconsistent styling conventions across pages

Some pages use the newer “African-inspired” token classes (`container-max`, `section-padding`, `bg-sand`, `.card`, `.btn-*`), while others use generic Tailwind grays and basic containers (`container py-12`, `border-gray-200`, etc.). This may be intentional (incremental redesign) but is a notable inconsistency.

### Repeated basePath helper logic

Several files implement:

```ts
const basePath = process.env.NODE_ENV === 'production' ? '/dewise-website' : ''
return `${basePath}${path}`
```

This solves GitHub Pages basePath issues, but duplication increases the chance of drift; a shared helper (e.g., `lib/paths.ts`) would centralize it.

### “Language support” is currently only UI state

`components/LanguageSwitcher.tsx` persists a language code but no page reads it and no content is translated. If i18n is a future goal, this is a stub rather than an implemented system.

### Content lives in two places

- `WEBSITE_CONTENT.md` contains a very detailed content spec that mirrors what is also embedded in `lib/siteData.ts` and page components.
- This is useful documentation, but it creates a “source of truth” question: if copy changes, which file should be updated?

---

## Appendix A) Tracked image inventory (metadata)

The repo tracks **42 image files** across `logos_profile pics/`, `pictures/`, `public/images/`, and `public/`. Many are duplicates across directories.

This analysis computed SHA-256 hashes and file sizes for each tracked image; duplicates share identical hashes (confirming true duplicates rather than re-encoded copies).

Notable items:

- **`public/og-default.png`**: **0 bytes**, SHA-256 of empty file (`e3b0…b855`)
- WiseBox photos exist in both `pictures/` and `public/images/` and are byte-identical.


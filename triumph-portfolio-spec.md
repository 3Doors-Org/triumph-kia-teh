# Triumph Kia Teh — Portfolio Website
## Complete Build Spec for Cursor Agent (v1)

---

## WHAT YOU ARE BUILDING

A personal portfolio website for **Triumph Kia Teh** — Dartmouth College student, 3x founder, and The Student Success Architect. The site tells his story across 9 sections and funnels visitors toward three actions: join 3Doors, partner with Palaver Institute, or contact him.

**No backend required.** This is a fully static site (HTML + CSS + JS). The contact form uses [Formspree](https://formspree.io) — free tier. No database, no server-side code, no authentication.

**Deployment target:** Contabo VPS running nginx. Someone else will handle deployment — your job is to produce a clean, ready-to-deploy static build.

---

## TECH STACK

- **Framework:** Plain HTML5 + CSS3 + Vanilla JavaScript (no React, no build tools, no npm)
- **Fonts:** Load from Google Fonts via `<link>` in `<head>`
- **Icons:** Use [Lucide Icons](https://unpkg.com/lucide@latest) via CDN
- **Contact form:** [Formspree](https://formspree.io) — replace `YOUR_FORMSPREE_ID` placeholder in the form action
- **No dependencies to install.** Everything loads from CDN or is self-contained.

---

## FILE STRUCTURE

```
triumph-portfolio/
├── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── assets/
│   └── images/
│       └── (placeholder comments where photos go)
└── README.md              ← deployment instructions for the Contabo person
```

---

## DESIGN DIRECTION

**Aesthetic:** Editorial / magazine meets African intellectual. Think *The Atlantic* meets Afropunk. Confident, warm, authoritative but deeply human.

**Color Palette (use CSS variables):**
```css
--color-bg: #0D0D0D;           /* near-black background */
--color-surface: #161616;      /* card/section backgrounds */
--color-accent: #E8A838;       /* warm gold — primary accent */
--color-accent-light: #F2C46D; /* lighter gold for hover states */
--color-text: #F0EDE6;         /* warm off-white body text */
--color-text-muted: #9A9690;   /* secondary text */
--color-border: #2A2A2A;       /* subtle borders */
--color-green: #4CAF82;        /* used sparingly for metrics/success */
```

**Typography:**
- Display/headings: `Playfair Display` (Google Fonts) — serif, editorial weight
- Body: `DM Sans` (Google Fonts) — clean, modern, readable
- Accent/labels: `DM Mono` (Google Fonts) — for tags, labels, numbers

**Motion:**
- Smooth scroll behavior on the whole page
- Sections fade up on scroll using IntersectionObserver (JS)
- Subtle hover transitions on cards (transform: translateY(-4px), 200ms ease)
- Navigation link underline slide-in on hover
- No jarring animations — everything feels intentional and calm

**Layout:**
- Max content width: 1100px, centered
- Generous vertical padding between sections (120px desktop, 80px mobile)
- Fully responsive — mobile-first breakpoints at 768px and 1024px
- Sticky navigation bar that becomes slightly opaque on scroll

---

## NAVIGATION

Sticky top navbar with:
- Left: Name `Triumph Kia Teh` in Playfair Display
- Right: Nav links → About | Story | Organizations | Recognition | Writing | Contact
- Mobile: hamburger menu that toggles a full-width dropdown
- On scroll past hero: navbar gets `background: rgba(13,13,13,0.95)` with `backdrop-filter: blur(8px)`

---

## SECTION 1 — HERO

Full viewport height. Centers the visitor immediately on who he is.

**Content:**
```
[Small label in DM Mono, gold color]
THE STUDENT SUCCESS ARCHITECT

[Large display heading in Playfair Display, ~72px desktop]
I Open All Three Doors.

[Subheading, ~20px DM Sans, muted text]
Access → Excellence → Opportunity
The complete higher education journey — from crisis zone to Ivy League,
and now built into a system anyone can follow.

[Two CTA buttons side by side]
[Primary - gold fill] Explore My Work ↓
[Secondary - outlined] Connect With Me →

[Bottom of hero — three stat pills in a row]
🚪 6,000+ Students Reached    📄 50+ Research Papers    💰 $60K+ Raised
```

**Visual detail:** Subtle grain texture overlay on background. The three door emoji characters (🚪🚪🚪) appear large and faded in the background as a watermark effect.

---

## SECTION 2 — ABOUT / BIO

Two-column layout (desktop): left is text, right is a photo placeholder.

**Left column content:**

```
[Section label — DM Mono, gold, small caps]
ABOUT

[Heading — Playfair Display]
From Crisis Zone
to Dartmouth.

[Body paragraphs — DM Sans]

In 2021, I left Cameroon's Anglophone crisis zone with nothing but a 
scholarship dream. I slept on floors in Yaoundé, volunteered at NGOs 
for WiFi access, and built rejection folders for 19 universities. 
One folder had a different email. Full funding to Dartmouth College.

I spent three gap years applying. I became a mentor to students who 
got scholarships before me. I celebrated them, then went back to applying.

At Dartmouth I didn't just study — I built infrastructure. 10+ 
concurrent leadership roles. Two organizations founded. $60K+ raised. 
Published research. Dartmouth's highest academic honors. 

Now I run three organizations that guide students through every phase 
of the higher education journey. Because I have lived every phase.

[Highlighted pull quote in gold, larger text]
"Student success is not luck. It is understanding the 
system at every phase and executing with precision."

[Skills tags — pill-shaped, dark background]
Student Success Strategy  |  Higher Education  |  Research Mentorship  
Nonprofit Leadership  |  Program Development  |  Computer Science
```

**Right column:** 
```html
<!-- Photo placeholder -->
<div class="photo-placeholder">
  <!-- Replace with: <img src="assets/images/triumph-photo.jpg" alt="Triumph Kia Teh"> -->
  <div class="placeholder-box">Add headshot photo here</div>
</div>
```

---

## SECTION 3 — THE 3DOORS FRAMEWORK

Full-width section with a dark gold tint background to make it stand out.

**Content:**

```
[Section label]
THE FRAMEWORK

[Heading]
One Journey. Three Doors.

[Subtext]
Most education systems are fragmented. College counselors help you get in, 
then disappear. Campus advisors can't speak to applications. Career coaches 
lack the campus context. Nobody guides the whole journey. I do.

[Three cards side by side — each with icon, number, title, description]

🚪 DOOR 1 — ACCESS
Getting In
Scholarship strategies, application systems, university selection, 
financial aid navigation. For pre-college students dreaming of 
elite universities without the resources everyone else takes for granted.

🚪 DOOR 2 — EXCELLENCE  
Thriving Inside
Leadership portfolio building, research capacity, academic performance, 
campus infrastructure. For current undergrads who got in but need 
a system to thrive, not just survive.

🚪 DOOR 3 — OPPORTUNITY
Converting Education Into Impact
Career navigation, graduate school strategy, network building. 
For recent graduates and seniors turning their degree into what they 
actually came here for.

[CTA below cards]
[Button] Join 3Doors Community →
```

---

## SECTION 4 — ORGANIZATIONS / VENTURES

Heading: **"Three Organizations. One Mission."**

Three full-width cards stacked or in a grid, each with:
- Organization name + logo placeholder
- Founded date
- One-line mission
- 3 key metrics in gold
- Brief description
- External link button

---

**Card 1 — 3Doors**
```
[Logo placeholder — src: assets/images/3doors-logo.png]
3Doors
Founded Jan 2026

The student success platform for the complete higher education journey.

📊 6,000+ followers  |  📅 7x weekly content  |  👥 Growing contributor team

Through content, community, and coaching, 3Doors equips students at 
every phase — scholarship strategies for those trying to get in, 
leadership frameworks for those trying to thrive, career navigation 
for those converting education into impact. Built on a framework 
lived from Cameroon's crisis zone to Dartmouth College.

[Button] Follow 3Doors on LinkedIn →
```

---

**Card 2 — Palaver Institute**
```
[Logo placeholder — src: assets/images/palaver-logo.png]
Palaver Institute
Founded Jul 2025 · Kigali, Rwanda (Remote)

Building research infrastructure to create opportunity for African scholars.

📄 50+ published papers  |  🌍 1,001 applications in 2 weeks  |  🎓 30+ researchers trained

Palaver trains Master's students through mentorship-driven research 
fellowships across 9 fields. Our in-house Palaver Press connects 
grassroots researchers with global academic networks — turning 
indigenous knowledge into rigorous scholarship. We host the largest 
African Research Conference annually (500+ in-person, 200+ virtual attendees).

[Button] Learn About Palaver Institute →
[Email link] triumph@palaverinstitute.org
```

---

**Card 3 — DeWise Foundation**
```
[Logo placeholder — src: assets/images/dewise-logo.png]
DeWise Foundation
Co-Founded Oct 2021 · Yaoundé, Cameroon

Crisis-zone clean energy and education for displaced youth.

💰 $60K+ raised  |  👨‍👩‍👧 5,000+ youth served  |  ⚡ 1,000+ solar devices deployed

Youth-led NGO with 15+ staff and 100+ annual volunteers. Flagship 
projects include WiseCool (solar-powered IoT medical cold chains, 
$33K raised, projected 50% medication lifespan increase at rural 
clinics) and WiseBox (1,000+ solar power banks restoring education 
in conflict zones). Partners: MTN Cameroon, Open Dreams, UN-linked 
climate networks.

Awards: Youth4Climate Grant ($30K) · Davis Projects for Peace ($10K) 
· MTN ICT Challenge 3rd Place (National + Pan-African, Johannesburg)

[Button] Learn About DeWise Foundation →
```

---

## SECTION 5 — EXPERIENCE & TRACK RECORD

Timeline layout. Desktop: alternating left-right. Mobile: single left-aligned column with vertical line.

Each entry has: date range | role | organization | 1-2 sentence summary | key metric or promotion note.

**Timeline entries (in order):**

1. **Founder & CEO** — Palaver Institute · Jul 2025–Present
   50+ papers, 1,001 applications in 2 weeks, 500+ conference attendees annually.

2. **Founder & CEO, The Student Success Architect** — 3Doors · Jan 2026–Present
   6,000+ followers, 7x weekly content, growing contributor team.

3. **Co-Founder & CTO** — DeWise Foundation · Oct 2021–Present
   $60K+ raised, 5,000+ youth served, 15+ staff, 100+ volunteers.

4. **Head Undergraduate Advisor** — Dartmouth Residential Education · Sep 2024–Present
   Promoted from single-floor advisor to head UGA overseeing Goldstein Hall (4 floors). Mentors 4 first-year UGAs.

5. **Assistant Supervisor** — Dartmouth Libraries · Nov 2022–Present
   Promoted from Desk Assistant within 7 months. Supervises 3-4 staff across three library locations serving 200+ daily visitors.

6. **Global Studies Advisor** — Dickey Center for International Understanding · Mar 2023–Jun 2024
   Advised 40+ students; 90% secured Dickey Center funding ($5,000+).

7. **National College Access Program Coordinator** — Open Dreams Educational NGO · Oct 2019–Sep 2022
   Oversaw 5 regional hubs, 150 scholars. Led recruitment of 4,500 students, 900 applications. The origin story.

8. **Global Health Intern** — Vantage Health Technologies (BroadReach Group) · Summer 2023
   1 of 2 Dartmouth undergrads selected from ~4,000. Praised by CTO, Founding Partner, and Product Lead.

---

## SECTION 6 — RECOGNITION & AWARDS

**Heading:** "The Record Speaks."

Display as a grid of award cards (3 columns desktop, 2 tablet, 1 mobile). Each card: award name, issuer, year, one-line description.

**Awards to include (in this order — most prestigious first):**

1. **King Scholar** — King Philanthropies via Dartmouth · 2022
   Dartmouth's highest merit scholarship (~$400,000 over 4 years). 7 recipients from 30,000+ applicants.

2. **Rufus Choate Scholar** — Dartmouth Undergraduate Deans Office · 2023
   4.0 CGPA. Top 5% of all 4,000+ Dartmouth students. Full year 2022–23.

3. **3× Citation for Meritorious Academic Performance** — Dartmouth · 2023, 2024, 2025
   A* grades with special faculty notes on academic transcript.

4. **Davis Projects for Peace Award** — Kathryn Davis Foundation · 2025
   $10,000 grant. Sole recipient from 4,000+ Dartmouth students. Funded WiseBox project.

5. **Evolutionary Game Theory Prize** — Dartmouth Math Department · 2025
   1st Place, Annual Undergraduate Research Poster Competition.

6. **Youth4Climate Initiative Grant** — Youth4Climate · 2025
   $30,000 (~17M XAF) to scale WiseCool solar medical cold chain project.

7. **MTN Cameroon ICT Innovation Challenge** — MTN Cameroon · 2025
   3rd Place nationally. Advanced to Pan-African Innovation Challenge, Johannesburg.

8. **Global Health Intern Award** — Dickey Center, Dartmouth · 2023
   1 of 2 undergrads from ~4,000 selected for summer global health internship.

9. **UNLEASH Global Talent** — UNLEASH Innovation Lab · 2022
   Top 1,000 of 19,000 applicants. Global Innovation Talent, Infosys Campus Mysore, India.

10. **Great Issues Scholar** — Dickey Center · 2022
    1 of 80 first-year scholars selected (from ~200 applicants) for year-long global engagement program.

11. **Crossroads Emerging Leaders / Aspire Institute** — Harvard Lakshmi Mittal Institute · 2021
    Top 100 finalist of ~4,000 global applicants.

12. **Open Dreams Scholar + "A Decade of Triumph"** — Open Dreams Educational NGO · 2022/2024
    1 of first 2 Open Dreams scholars ever admitted to an Ivy League (2022). Organization's 10th anniversary named "A Decade of Triumph" in his honor.

13. **National Selectee — ACAP** — Ministry of Youth Affairs, Cameroon · 2021
    1 of 2 regional representatives (Southwest Cameroon) for National Training on Adolescent Health.

14. **NSLS Inducted Leader Nominee** — Sigma Alpha Pi · 2025

15. **Merit Award for Leadership & Outstanding Contributions** — MedLife / Global Leadership Adventures · 2021
    Dual awards. 6-week public health internship. Described as "standout" and "perfect example of the kind of intern we look for."

---

## SECTION 7 — THOUGHT LEADERSHIP / WRITING

**Heading:** "Frameworks, Not Inspiration."

**Intro text:** 
```
Every week I publish across all 3 Doors. Scholarship strategies. 
Campus leadership systems. Career navigation. Stories of students 
who made it against the odds. Practical steps, not inspiration.
7 posts per week. 52-week framework series running now.
```

Display as a grid of featured post cards (3 columns desktop). Each card:
- Door label pill (ACCESS / EXCELLENCE / OPPORTUNITY in matching color)
- Post title
- 1-sentence excerpt
- "Read on LinkedIn →" link

**Featured posts to include:**

```
Post 1 — ACCESS
"I Left Home Without Telling My Parents"
Three gap years. 19 rejection folders. One email changed everything — 
full funding to Dartmouth College.
[Link to LinkedIn post]

Post 2 — OPPORTUNITY  
"Your Peers' Job Choices Are Not Instructions for What You Should Want"
How to separate your signal from recruiting season's social pressure.
[Link to LinkedIn post]

Post 3 — EXCELLENCE
"One Hole. One Line. One Fish."
What ice fishing on a frozen New Hampshire lake taught about goal-setting.
[Link to LinkedIn post]

Post 4 — ACCESS
"Two Dartmouth Students Are Redesigning How We Access Energy and Education"
Angelica from Bali and Wai Yan from Myanmar — different crises, same Dartmouth.
[Link to LinkedIn post]

Post 5 — ACCESS
"Harvard Flew Me to Cambridge. I Didn't Know Why."
Mohamed's surgery, his spine, his senior speech — and what showing up really means.
[Link to LinkedIn post]

Post 6 — ACCESS
"Two Women From Crisis Zone Are Now Leading Aerospace & Chemical Engineering"
Danie survived a school burning. Ene redirected at 14. Both are thriving in STEM.
[Link to LinkedIn post]
```

**Below the grid:**
```
[Button] Follow on LinkedIn for Weekly Frameworks →
[Small text] Posts every day. Frameworks for Access, Excellence, and Opportunity.
```

---

## SECTION 8 — RESEARCH & PUBLICATIONS

**Heading:** "The Research Dimension."

Simple clean list of publications with links.

```
[Publication 1]
Computational Modeling of Social Influence in Investment Decision-Making:
Market Sentiment vs. Learning Effects in Human Stock Choice Task
Zenodo · October 2025
[Button] View Publication →

[Publication 2]
Evolutionary Game Theory Modeling of Risks in College Dating Strategies
Zenodo · October 2025
[Button] View Publication →

[Publication 3 — In Progress]
Thought-as-Graph: An Explainable AI Architecture Combining Custom 
Graph Neural Networks with Monte Carlo Tree Search and Dowhy
[Label: Writing in Progress]
```

**Also note:** Triumph is founder of Palaver Institute, which has produced 50+ peer-reviewed papers across 9 fields in 12 months through its research fellows. This section can link to Palaver Press.

---

## SECTION 9 — SOCIAL PROOF / TESTIMONIALS

**Heading:** "What Others Say."

3 testimonial cards in a row (stack on mobile).

**Testimonial 1 — Mohamed Salam Moumie**
```
"Triumph has been the most hard working, resilient, perseverant, and 
dedicated person I have ever met. He has a policy to Spare No Opportunity."

— Mohamed Salam Moumie
2x SWE Intern @ Meta | Senior Computer Science, Harvard College | CS50 Teaching Fellow
[LinkedIn profile link]
```

**Testimonial 2 — BroadReach Leadership (composite)**
```
Public praise from CTO Ruan Viljoen, Founding Partner John Sargent, 
and Product Lead Amogh Rajan at the conclusion of his Vantage Health 
Technologies internship, Summer 2023.

— BroadReach Group Leadership
Global Health Technology, South Africa
```

**Testimonial 3 — Open Dreams Educational NGO (institutional)**
```
"The organization's 10th Anniversary was named 'A Decade of Triumph' 
and the 2024 cohort named the 'Batch of Triumph' — in recognition of 
Ivy League pioneering achievement and community impact."

— Open Dreams Educational NGO
Yaoundé, Cameroon · Founded 2014
[Organization link]
```

---

## SECTION 10 — CONTACT

**Heading:** "Let's Build Together."

Three distinct CTA columns side by side (stack on mobile), each with icon, audience, description, and action button:

```
Column 1 — For Students
🚪 Are you a student?
Join 3Doors for weekly frameworks on scholarships, campus leadership,
and career navigation. Free community. Practical steps.
[Button: Join 3Doors →]

Column 2 — For Researchers  
📄 Are you an African researcher?
Palaver Institute trains researchers, supports publication, and connects
you to the global academic network. Apply for the next cohort.
[Button: Apply to Palaver →]
[Email: triumph@palaverinstitute.org]

Column 3 — For Partners & Funders
🤝 Want to build together?
Partner with 3Doors, Palaver Institute, or DeWise Foundation. 
Speaking invitations, collaborations, and funding inquiries welcome.
[Button: Send a Message →] (scrolls to form below)
```

**Contact Form (below the three columns):**

```html
<form action="https://formspree.io/f/YOUR_FORMSPREE_ID" method="POST">
  <input type="text" name="name" placeholder="Your Name" required>
  <input type="email" name="email" placeholder="Your Email" required>
  <select name="inquiry_type">
    <option value="">I am a...</option>
    <option value="student">Student seeking coaching</option>
    <option value="researcher">Researcher interested in Palaver</option>
    <option value="partner">Partner / Funder</option>
    <option value="speaking">Speaking invitation</option>
    <option value="other">Other</option>
  </select>
  <textarea name="message" placeholder="Your message..." rows="5" required></textarea>
  <button type="submit">Send Message →</button>
</form>
```

Note: Person deploying this site needs to create a free Formspree account at formspree.io, create a form, and replace `YOUR_FORMSPREE_ID` with their actual form ID. Takes 2 minutes.

---

## FOOTER

```
Left: Triumph Kia Teh · The Student Success Architect
       Access → Excellence → Opportunity

Center: Quick links (About | Organizations | Recognition | Writing | Contact)

Right: Social icons
       LinkedIn → https://linkedin.com/in/triumph-kia-teh  [update with actual URL]
       Email → triumph@palaverinstitute.org

Bottom bar:
© 2026 Triumph Kia Teh. Built to open doors.
```

---

## JAVASCRIPT BEHAVIORS (js/main.js)

Implement all of the following:

1. **Sticky navbar scroll effect** — on scroll past 80px, add class `.scrolled` to `<nav>` which applies `background: rgba(13,13,13,0.95)` and `backdrop-filter: blur(8px)`

2. **Scroll-triggered fade-in** — use IntersectionObserver to add class `.visible` to any element with class `.fade-up` when it enters viewport. CSS transition: `opacity 0s → 1, transform translateY(30px) → 0, duration 0.6s ease`

3. **Mobile hamburger menu** — toggle `.open` class on nav menu when hamburger button is clicked. Click outside to close.

4. **Smooth scroll** — all `<a href="#section-id">` links scroll smoothly (CSS `scroll-behavior: smooth` on `html` is sufficient)

5. **Active nav link highlight** — as user scrolls, highlight the nav link corresponding to the current visible section using IntersectionObserver

6. **Award cards hover** — slight gold border glow on hover

---

## RESPONSIVE BREAKPOINTS

```css
/* Mobile first */
/* Default: single column, full width */

/* Tablet */
@media (min-width: 768px) {
  /* Two column layouts where applicable */
  /* Timeline alternates sides */
  /* Award grid: 2 columns */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full multi-column layouts */
  /* Award grid: 3 columns */
  /* About section: 60/40 split */
  /* Organizations: 3 cards in a row */
}
```

---

## PLACEHOLDER COMMENTS (for photos)

Add clear HTML comments wherever photos should go:

```html
<!-- PHOTO: Triumph headshot (professional) — replace src below -->
<!-- Recommended: 600x700px, JPG, place in assets/images/triumph-headshot.jpg -->

<!-- PHOTO: 3Doors logo — replace src below -->
<!-- Recommended: SVG or PNG with transparent background, assets/images/3doors-logo.png -->

<!-- PHOTO: Palaver Institute logo — replace src below -->
<!-- Recommended: SVG or PNG, assets/images/palaver-logo.png -->

<!-- PHOTO: DeWise Foundation logo — replace src below -->
<!-- Recommended: SVG or PNG, assets/images/dewise-logo.png -->

<!-- PHOTO: WiseBox photo (two girls holding devices) — replace src below -->
<!-- Place at: assets/images/wisebox-photo.jpg -->
```

---

## README.md — DEPLOYMENT INSTRUCTIONS FOR CONTABO PERSON

Generate a `README.md` file in the project root with the following content:

```markdown
# Triumph Kia Teh Portfolio — Deployment Guide

## What This Is
A fully static website (HTML + CSS + JS). No Node.js, no npm, no database, 
no build step. Just files. Serve them with nginx and it works.

## Server Requirements
- Any Linux VPS (Contabo or similar)
- nginx installed
- Certbot for SSL (Let's Encrypt)

## Step-by-Step Deployment

### 1. Upload Files to Server
Transfer the entire project folder to your server:
```bash
scp -r triumph-portfolio/ user@YOUR_SERVER_IP:/var/www/triumph-portfolio
```

Or use FileZilla / Cyberduck if you prefer a GUI.

### 2. Configure nginx
Create a new nginx site config:
```bash
sudo nano /etc/nginx/sites-available/triumph-portfolio
```

Paste this config (replace `yourdomain.com` with the actual domain):
```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/triumph-portfolio;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(css|js|jpg|jpeg|png|gif|svg|ico|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/triumph-portfolio /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Point Domain DNS
In your domain registrar (wherever the domain was bought):
- Add an **A record** pointing `@` → your Contabo server IP
- Add an **A record** pointing `www` → your Contabo server IP
- DNS propagation takes 10 minutes to 24 hours

### 4. Add SSL (HTTPS) — Free via Let's Encrypt
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the prompts. Certbot auto-renews — nothing to maintain.

### 5. Set Up Formspree (Contact Form)
1. Go to https://formspree.io and create a free account
2. Create a new form, copy the form ID (looks like `xpwzabcd`)
3. Open `index.html`, search for `YOUR_FORMSPREE_ID`
4. Replace it with your actual form ID
5. Re-upload the updated `index.html`

### 6. Add Photos
Replace placeholder `<div>` elements with actual `<img>` tags:
- Triumph's headshot → `assets/images/triumph-headshot.jpg`
- 3Doors logo → `assets/images/3doors-logo.png`
- Palaver logo → `assets/images/palaver-logo.png`
- DeWise logo → `assets/images/dewise-logo.png`

Look for `<!-- PHOTO: -->` comments in `index.html` for exact locations.

### 7. Update LinkedIn URLs
Search `index.html` for `linkedin.com/in/triumph-kia-teh` and confirm 
the URL matches his actual LinkedIn profile URL.

## You're Done
Visit `https://yourdomain.com` — site should be live.

## Contact
triumph@palaverinstitute.org
```

---

## FINAL CHECKLIST FOR CURSOR AGENT

Before finishing, verify:

- [ ] All 10 sections are present and populated with real content from this spec
- [ ] CSS variables are defined and used consistently throughout
- [ ] Google Fonts are loaded correctly in `<head>`
- [ ] Mobile hamburger menu works
- [ ] IntersectionObserver fade-up animations work on all sections
- [ ] Formspree form has `YOUR_FORMSPREE_ID` placeholder (not hardcoded)
- [ ] All photo locations have clear `<!-- PHOTO: -->` HTML comments
- [ ] LinkedIn URLs have a placeholder note to update with real URL
- [ ] `README.md` is complete with full deployment steps
- [ ] No broken links (use `#` as placeholder for external links that aren't provided)
- [ ] Site is fully functional with no JavaScript errors in console
- [ ] Responsive on mobile (375px), tablet (768px), and desktop (1280px)
- [ ] Footer is complete
- [ ] All award data matches exactly what's in this spec

---

*This spec was built from Triumph Kia Teh's complete LinkedIn profile, experience, honors, projects, and publications. All content is real and verified. The Cursor agent should use this spec as the single source of truth for v1.*

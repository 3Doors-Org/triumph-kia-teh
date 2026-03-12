export type NavItem = { id: string; label: string };

export type NavGroup =
  | { kind: "link"; label: string; href: string }
  | { kind: "group"; label: string; items: { label: string; href: string }[] };

export type SocialLink = { label: string; href: string };

export type HeroStat = { label: string };

export type Organization = {
  name: string;
  founded: string;
  missionLine: string;
  metricsLine: string;
  description: string;
  logoSrc: string;
  links: { label: string; href: string }[];
  photo?: { src: string; alt: string; caption?: string };
};

export type TimelineItem = {
  dateRange: string;
  role: string;
  organization: string;
  summary: string;
};

export type Award = {
  name: string;
  issuer: string;
  year: string;
  description: string;
};

export type SpeakingItem = {
  title: string;
  summary: string;
};

export type WritingCard = {
  door: "ACCESS" | "EXCELLENCE" | "OPPORTUNITY";
  title: string;
  excerpt: string;
  href: string;
  ctaLabel: string;
};

export type ResearchItem = {
  title: string;
  meta: string;
  href?: string;
  badge?: string;
};

export type Testimonial = {
  quote: string;
  author: string;
  title?: string;
  href?: string;
  hrefLabel?: string;
};

export type Program = {
  slug: "access" | "excellence" | "opportunity";
  title: string;
  summary: string;
  cta: { label: string; href: string };
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  metrics?: string[];
  heroImage?: { src: string; alt: string };
  links?: { label: string; href: string }[];
};

export const site = {
  title: "Triumph Kia Teh - The Student Success Architect",
  description:
    "Triumph Kia Teh - Dartmouth College student, 3x founder. Access to Excellence to Opportunity. The complete higher education journey.",
  taglineLabel: "THE STUDENT SUCCESS ARCHITECT",
  taglineLine: "Access to Excellence to Opportunity",

  nav: [
    { id: "about", label: "About" },
    { id: "education", label: "Education" },
    { id: "story", label: "Story" },
    { id: "organizations", label: "Organizations" },
    { id: "experience", label: "Experience" },
    { id: "recognition", label: "Recognition" },
    { id: "speaking", label: "Speaking" },
    { id: "writing", label: "Writing" },
    { id: "contact", label: "Contact" },
  ] satisfies NavItem[],

  navRoutes: [
    { kind: "link", label: "Home", href: "/" },
    {
      kind: "group",
      label: "About",
      items: [
        { label: "About", href: "/about/" },
        { label: "Impact", href: "/impact/" },
        { label: "Achievements", href: "/achievements/" },
        { label: "Speaking", href: "/speaking/" },
      ],
    },
    {
      kind: "group",
      label: "Work",
      items: [
        { label: "Organizations", href: "/organizations/" },
        { label: "Programs", href: "/programs/" },
        { label: "Projects", href: "/projects/" },
      ],
    },
    { kind: "link", label: "Writing", href: "/writing/" },
    { kind: "link", label: "Contact", href: "/contact/" },
  ] satisfies NavGroup[],

  socials: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/triumph-kia-teh/" },
    { label: "Email", href: "mailto:triumph@palaverinstitute.org" },
  ] satisfies SocialLink[],

  hero: {
    headline: "I Open All Three Doors.",
    subhead:
      "The complete higher education journey - from crisis zone to Ivy League, and now built into a system anyone can follow.",
    ctas: [
      { label: "Explore My Work", href: "#story" },
      { label: "Connect With Me", href: "#contact" },
    ],
    stats: [
      { label: "6,000+ students reached" },
      { label: "50+ research articles produced" },
      { label: "$70K+ raised in competitive grants" },
    ] satisfies HeroStat[],
  },

  about: {
    label: "ABOUT",
    heading: "From Crisis Zone\nto Dartmouth.",
    paragraphs: [
      "Triumph Kia Teh is a member of Dartmouth's Class of 2026 and a King Scholar, one of seven incoming students selected from over 30,000 applicants to receive Dartmouth's highest merit scholarship worth approximately $400,000 over four years.",
      "In 2021, he left Cameroon's Anglophone crisis zone with nothing but a scholarship dream. He slept on floors in Yaounde, volunteered at NGOs for WiFi access, and built rejection folders for 19 universities. One folder had a different email. Full funding to Dartmouth College.",
      "He has maintained a 4.0 GPA while holding leadership positions across nine campus offices simultaneously, earning recognition as a Rufus Choate Scholar for top 5% academic standing and receiving three Citations for Meritorious Performance for A* grades with special faculty notes on his academic transcript across multiple years.",
      "Now he builds infrastructure through 3Doors, Palaver Institute, and DeWise Foundation, guiding students and scholars through systems of access, excellence, and opportunity.",
    ],
    quote:
      "Student success is not luck. It is understanding the system at every phase and executing with precision.",
    gallery: [
      { src: "/images/open-dreams-scholars.jpg", alt: "Open Dreams scholars with banner" },
      { src: "/images/triumph-dartmouth-library.jpg", alt: "At Baker-Berry Library, Dartmouth" },
      { src: "/images/triumph-acap-certificate.jpg", alt: "ACAP program certificate" },
    ],
    tags: [
      "Student Success Strategy",
      "Higher Education",
      "Research Mentorship",
      "Nonprofit Leadership",
      "Program Development",
      "Computer Science",
    ],
    headshot: { src: "/images/triumph-headshot.jpg", alt: "Triumph Kia Teh" },
  },

  education: {
    label: "EDUCATION",
    heading: "Dartmouth College. Computer Science.",
    degreeLine: "Bachelor of Arts, Computer Science",
    context:
      "Full funding via the King Scholarship (King Philanthropies). One of seven King Scholars selected from 30,000+ applicants. Dartmouth's highest merit scholarship, worth approximately $400,000 over four years.",
    honors: [
      "King Scholar (2022) - King Philanthropies via Dartmouth. 7 recipients from 30,000+ applicants.",
      "Rufus Choate Scholar (2023) - 4.0 CGPA. Top 5% of all 4,000+ Dartmouth students. Full year 2022-23.",
      "3x Citation for Meritorious Academic Performance (2023, 2024, 2025) - A* grades with special faculty notes on transcript.",
      "Evolutionary Game Theory Prize (2025) - 1st Place, Dartmouth Math Department Undergraduate Research Poster Competition.",
      "Davis Projects for Peace Award (2025) - $10,000 grant. Sole recipient from 4,000+ Dartmouth students. Funded WiseBox project.",
      "Global Health Intern Award (2023) - Dickey Center. 1 of 2 undergrads from ~4,000 selected for summer global health internship.",
    ],
    note:
      "This academic foundation supports the work across 3Doors, Palaver Institute, and DeWise Foundation - and the frameworks shared with thousands of students.",
  },

  framework: {
    label: "THE FRAMEWORK",
    heading: "One Journey. Three Doors.",
    intro:
      "Most education systems are fragmented. College counselors help you get in, then disappear. Campus advisors cannot speak to applications. Career coaches lack the campus context. Nobody guides the whole journey. I do.",
    doors: [
      {
        number: "DOOR 1",
        title: "Access - Getting In",
        description:
          "Scholarship strategies, application systems, university selection, financial aid navigation. For pre-college students dreaming of elite universities without the resources everyone else takes for granted.",
      },
      {
        number: "DOOR 2",
        title: "Excellence - Thriving Inside",
        description:
          "Leadership portfolio building, research capacity, academic performance, campus infrastructure. For current undergrads who got in but need a system to thrive, not just survive.",
      },
      {
        number: "DOOR 3",
        title: "Opportunity - Converting Education Into Impact",
        description:
          "Career navigation, graduate school strategy, network building. For recent graduates and seniors turning their degree into what they actually came here for.",
      },
    ],
    cta: { label: "Join 3Doors Community", href: "https://www.linkedin.com/company/3doors/" },
  },

  organizations: [
    {
      name: "3Doors",
      founded: "Founded Jan 2026",
      missionLine: "The student success platform for the complete higher education journey.",
      metricsLine: "6,000+ followers | 7x weekly content | Growing contributor team",
      description:
        "Through content, community, and coaching, 3Doors equips students at every phase - scholarship strategies for those trying to get in, leadership frameworks for those trying to thrive, career navigation for those converting education into impact.",
      logoSrc: "/images/3doors-logo.png",
      links: [
        { label: "3Doors on LinkedIn", href: "https://www.linkedin.com/company/3doors/" },
        { label: "Visit 3doors.org", href: "https://3doors.org" },
      ],
    },
    {
      name: "Palaver Institute",
      founded: "Founded Aug 2025 - Pan-African (Remote)",
      missionLine: "Building research infrastructure to create opportunity for African scholars.",
      metricsLine:
        "50+ journal articles in 12 months | 1,001 applications in 2 weeks | 500+ in person and 200+ virtual at annual conference",
      description:
        "Palaver trains African scholars through mentorship-driven research fellowships and has produced 50+ journal articles across nine disciplines in its first 12 months. Through Palaver Press, Palaver addresses the publication access crisis that blocks African researchers from global knowledge systems.",
      logoSrc: "/images/palaver-logo.svg",
      links: [
        { label: "palaverinstitute.org", href: "https://palaverinstitute.org" },
        { label: "Donate", href: "https://palaverinstitute.org/donate" },
        { label: "Palaver on LinkedIn", href: "https://www.linkedin.com/company/palaver-institute/" },
      ],
    },
    {
      name: "DeWise Foundation",
      founded: "Co-Founded Oct 2021 - Yaounde, Cameroon",
      missionLine: "Crisis-zone clean energy and education for displaced youth.",
      metricsLine: "$70K+ raised | 5,000+ people served | 1,000+ solar devices deployed",
      description:
        "Youth-led organization with 15+ staff and 100+ volunteers annually. Flagship projects include WiseCool, a solar-powered IoT cold storage unit projected to increase medication lifespan by 50%, and WiseBox, 1,000+ solar power banks restoring education access for displaced youth in conflict zones.",
      logoSrc: "/images/dewise-logo.jpg",
      photo: {
        src: "/images/wisebox-two-youths.jpg",
        alt: "Youths with WiseBox solar power banks",
        caption: "WiseBox in the field",
      },
      links: [
        { label: "DeWise website", href: "https://dewise-organization.github.io/dewise-website/" },
        { label: "DeWise on LinkedIn", href: "https://www.linkedin.com/company/infodewise/" },
      ],
    },
  ] satisfies Organization[],

  programs: [
    {
      slug: "access",
      title: "Door 1 - Access",
      summary: "Scholarship strategy, applications, and getting in.",
      cta: { label: "Explore Access", href: "/programs/access/" },
    },
    {
      slug: "excellence",
      title: "Door 2 - Excellence",
      summary: "Thriving inside, leadership, and academic systems.",
      cta: { label: "Explore Excellence", href: "/programs/excellence/" },
    },
    {
      slug: "opportunity",
      title: "Door 3 - Opportunity",
      summary: "Career navigation and converting education into impact.",
      cta: { label: "Explore Opportunity", href: "/programs/opportunity/" },
    },
  ] satisfies Program[],

  projects: [
    {
      slug: "wisebox",
      title: "WiseBox",
      summary: "Solar-powered custom power banks restoring education access for displaced youth in conflict zones.",
      metrics: ["1,000+ devices deployed", "$10,000 Davis Projects for Peace support"],
      heroImage: { src: "/images/wisebox-two-youths.jpg", alt: "Youths with WiseBox solar power banks" },
      links: [{ label: "DeWise website", href: "https://dewise-organization.github.io/dewise-website/" }],
    },
    {
      slug: "wisecool",
      title: "WiseCool",
      summary: "Solar-powered IoT cold storage designed for rural clinics in crisis-affected regions.",
      metrics: ["Projected 50% increase in medication lifespan", "$33,000+ secured for the project"],
      heroImage: { src: "/images/dewise-solar-panels.jpg", alt: "DeWise youths working with solar panels" },
      links: [{ label: "DeWise website", href: "https://dewise-organization.github.io/dewise-website/" }],
    },
  ] satisfies Project[],

  experience: {
    label: "EXPERIENCE",
    heading: "Experience and Track Record",
    items: [
      {
        dateRange: "Jul 2025 - Present",
        role: "Founder and CEO",
        organization: "Palaver Institute",
        summary:
          "50+ journal articles in 12 months, 1,001 applications in 2 weeks, 500+ in person and 200+ virtual at annual conference.",
      },
      {
        dateRange: "Jan 2026 - Present",
        role: "Founder and CEO, The Student Success Architect",
        organization: "3Doors",
        summary: "6,000+ followers, 7x weekly content, growing contributor team.",
      },
      {
        dateRange: "Oct 2021 - Present",
        role: "Co-Founder and Chief Strategy Officer",
        organization: "DeWise Foundation",
        summary:
          "$70K+ raised, 5,000+ crisis affected people served, 15+ staff, 100+ volunteers annually.",
      },
      {
        dateRange: "Sep 2025 - Present",
        role: "Head Undergraduate Advisor",
        organization: "Dartmouth Residential Education",
        summary:
          "Senior residential authority for North Park House. Oversees residential infrastructure for 350 students across six buildings and 24 floors. Supervises and mentors four first year UGAs through crisis response, program design, and nightly duty rounds.",
      },
      {
        dateRange: "Nov 2022 - Present",
        role: "Assistant Supervisor",
        organization: "Dartmouth Libraries",
        summary:
          "Promoted from Desk Assistant within seven months. Supervises 3-4 staff across three library locations serving 200+ daily visitors.",
      },
      {
        dateRange: "Mar 2023 - Jun 2024",
        role: "Peer Advisor",
        organization: "Dickey Center for International Understanding",
        summary:
          "Advised 40+ students. 90% secured at least $5,000 in funding. Helped students access $200,000+ in total funding.",
      },
      {
        dateRange: "Oct 2019 - Sep 2022",
        role: "National College Access Program Coordinator",
        organization: "Open Dreams Educational NGO",
        summary:
          "Oversaw five regional hubs serving 150 scholars nationally. Led recruitment reaching 4,500 students and generating 900 applications.",
      },
      {
        dateRange: "Summer 2023",
        role: "Global Health Intern (award funded)",
        organization: "Vantage Health Technologies (BroadReach Group)",
        summary:
          "Selected as 1 of 2 Dartmouth undergrads from 4,000+ students. Worked under senior leadership on health technology solutions.",
      },
    ] satisfies TimelineItem[],
  },

  recognition: {
    label: "RECOGNITION",
    heading: "The Record Speaks.",
    awards: [
      {
        name: "King Scholar",
        issuer: "King Philanthropies via Dartmouth",
        year: "2022",
        description:
          "Dartmouth's highest merit scholarship (approximately $400,000 over four years). 7 recipients from 30,000+ applicants.",
      },
      {
        name: "Rufus Choate Scholar",
        issuer: "Dartmouth Undergraduate Deans Office",
        year: "2023",
        description: "4.0 CGPA. Top 5% of all 4,000+ Dartmouth students. Full year 2022-23.",
      },
      {
        name: "3x Citation for Meritorious Academic Performance",
        issuer: "Dartmouth",
        year: "2023, 2024, 2025",
        description: "A* grades with special faculty notes on academic transcript.",
      },
      {
        name: "Davis Projects for Peace Award",
        issuer: "Kathryn Davis Foundation",
        year: "2025",
        description: "$10,000 grant. Sole Dartmouth recipient that year among 4,000+ undergraduates. Funded WiseBox.",
      },
      {
        name: "Evolutionary Game Theory Prize",
        issuer: "Dartmouth Math Department",
        year: "2025",
        description: "1st Place, Annual Undergraduate Research Poster Competition.",
      },
      {
        name: "Youth4Climate Initiative Grant",
        issuer: "Youth4Climate",
        year: "2025",
        description: "$30,000 grant to scale WiseCool solar medical cold chain project.",
      },
      {
        name: "MTN Cameroon ICT Innovation Challenge",
        issuer: "MTN Cameroon",
        year: "2025",
        description: "Placed third nationally and advanced to the Pan-African Innovation Challenge in Johannesburg.",
      },
      {
        name: "Global Health Intern Award",
        issuer: "Dickey Center, Dartmouth",
        year: "2023",
        description: "Selected as 1 of 2 undergrads from Dartmouth's 4,000+ students for a funded summer internship.",
      },
      {
        name: "UNLEASH Global Talent",
        issuer: "UNLEASH Innovation Lab",
        year: "2022",
        description: "Selected as 1 of 1,000 global innovation talents from 19,000 applicants.",
      },
      {
        name: "Great Issues Scholar",
        issuer: "Dickey Center",
        year: "2022",
        description: "Selected as 1 of 80 first-year scholars for a year-long global engagement program.",
      },
      {
        name: "Crossroads Emerging Leaders (Aspire Institute)",
        issuer: "Harvard Lakshmi Mittal Institute",
        year: "2021",
        description: "Top 100 finalist from approximately 4,000 applicants.",
      },
      {
        name: "National Selectee - ACAP",
        issuer: "Ministry of Youth Affairs, Cameroon",
        year: "2021",
        description: "Selected as 1 of 2 regional representatives for national training on adolescent health and well-being.",
      },
      {
        name: "Merit Award for Leadership and Outstanding Contributions",
        issuer: "MedLife / Global Leadership Adventures",
        year: "2021",
        description:
          "Dual awards for leadership and outstanding contributions during a six-week public health internship.",
      },
    ] satisfies Award[],
  },

  speaking: {
    label: "SPEAKING AND MEDIA",
    heading: "Where the Work Gets Heard.",
    intro:
      "Keynotes, graduations, and national media features on education access, crisis response, and building systems that scale opportunity.",
    items: [
      {
        title: "World Changers Association",
        summary:
          "Youngest speaker at the Academic and Professionals Conference, presenting to approximately 100 professionals on education access, scholarship strategy, and purpose driven leadership.",
      },
      {
        title: "CamLEI Volunteers Graduation",
        summary:
          "Guest presenter speaking to 45+ young leaders on leveraging volunteer experience for college and career opportunities.",
      },
      {
        title: "CRTV National Television",
        summary:
          "Featured nationally for DeWise's National Energy Transition Fellowship with 200+ attendees and mini grants, with Ministry representatives in attendance.",
      },
      {
        title: "Equinox National TV",
        summary:
          "Selected as sole student representative to co present cervical cancer prevention alongside health experts and CEOs, reaching millions of households nationally.",
      },
    ] satisfies SpeakingItem[],
    ctaEmail: "mailto:triumph@palaverinstitute.org",
  },

  writing: {
    label: "THOUGHT LEADERSHIP",
    heading: "Frameworks, Not Inspiration.",
    intro:
      "Every week I publish across all 3 Doors. Scholarship strategies. Campus leadership systems. Career navigation. Stories of students who made it against the odds. Practical steps, not inspiration. 7 posts per week. 52-week framework series running now.",
    cards: [
      {
        door: "ACCESS",
        title: "I Left Home Without Telling My Parents",
        excerpt:
          "Three gap years. 19 rejection folders. One email changed everything - full funding to Dartmouth College.",
        href: "https://www.linkedin.com/in/triumph-kia-teh/",
        ctaLabel: "View on LinkedIn Profile",
      },
      {
        door: "OPPORTUNITY",
        title: "Your Peers' Job Choices Are Not Instructions for What You Should Want",
        excerpt: "How to separate your signal from recruiting season's social pressure.",
        href: "https://www.linkedin.com/in/triumph-kia-teh/",
        ctaLabel: "View on LinkedIn Profile",
      },
      {
        door: "EXCELLENCE",
        title: "One Hole. One Line. One Fish.",
        excerpt: "What ice fishing on a frozen New Hampshire lake taught about goal-setting.",
        href: "https://www.linkedin.com/in/triumph-kia-teh/",
        ctaLabel: "View on LinkedIn Profile",
      },
      {
        door: "ACCESS",
        title: "Two Dartmouth Students Are Redesigning How We Access Energy and Education",
        excerpt: "Angelica from Bali and Wai Yan from Myanmar - different crises, same Dartmouth.",
        href: "https://www.linkedin.com/in/triumph-kia-teh/",
        ctaLabel: "View on LinkedIn Profile",
      },
      {
        door: "ACCESS",
        title: "Harvard Flew Me to Cambridge. I Did Not Know Why.",
        excerpt: "Mohamed's surgery, his spine, his senior speech - and what showing up really means.",
        href: "https://www.linkedin.com/in/triumph-kia-teh/",
        ctaLabel: "View on LinkedIn Profile",
      },
      {
        door: "ACCESS",
        title: "Two Women From Crisis Zone Are Now Leading Aerospace and Chemical Engineering",
        excerpt: "Danie survived a school burning. Ene redirected at 14. Both are thriving in STEM.",
        href: "https://www.linkedin.com/in/triumph-kia-teh/",
        ctaLabel: "View on LinkedIn Profile",
      },
    ] satisfies WritingCard[],
    profileCta: { label: "Follow on LinkedIn for Weekly Frameworks", href: "https://www.linkedin.com/in/triumph-kia-teh/" },
  },

  research: {
    label: "RESEARCH",
    heading: "The Research Dimension.",
    items: [
      {
        title:
          "Computational Modeling of Social Influence in Investment Decision-Making: Market Sentiment vs. Learning Effects in Human Stock Choice Task",
        meta: "Zenodo - October 2025",
      },
      {
        title: "Evolutionary Game Theory Modeling of Risks in College Dating Strategies",
        meta: "Zenodo - October 2025",
      },
      {
        title:
          "Thought-as-Graph: An Explainable AI Architecture Combining Custom Graph Neural Networks with Monte Carlo Tree Search and Dowhy",
        meta: "In progress",
        badge: "Writing in Progress",
      },
    ] as ResearchItem[],
    palaverPressHref: "https://palaverinstitute.org",
  },

  testimonials: [
    {
      quote:
        "Triumph has been the most hard working, resilient, perseverant, and dedicated person I have ever met. He has a policy to Spare No Opportunity.",
      author: "Mohamed Salam Moumie",
      title: "Senior Computer Science, Harvard College. CS50 Teaching Fellow.",
      href: "https://www.linkedin.com/in/mohamedsalammoumie/",
      hrefLabel: "LinkedIn",
    },
    {
      quote:
        "Public praise from CTO Ruan Viljoen, Founding Partner John Sargent, and Product Lead Amogh Rajan at the conclusion of his Vantage Health Technologies internship, Summer 2023.",
      author: "BroadReach Group Leadership",
      title: "Global Health Technology, South Africa",
    },
    {
      quote:
        "The organization's 10th anniversary was named 'A Decade of Triumph' and the 2024 cohort named the 'Batch of Triumph' - in recognition of Ivy League pioneering achievement and community impact.",
      author: "Open Dreams Educational NGO",
      title: "Yaounde, Cameroon. Founded 2014",
      href: "https://open-dreams.org",
      hrefLabel: "Organization link",
    },
  ] satisfies Testimonial[],

  contact: {
    label: "CONTACT",
    heading: "Let's Build Together.",
    ctas: [
      {
        title: "Are you a student?",
        description:
          "Join 3Doors for weekly frameworks on scholarships, campus leadership, and career navigation. Free community. Practical steps.",
        links: [
          { label: "Join 3Doors", href: "https://www.linkedin.com/company/3doors/" },
          { label: "3doors.org", href: "https://3doors.org" },
        ],
      },
      {
        title: "Are you an African researcher?",
        description:
          "Palaver Institute trains researchers, supports publication, and connects you to the global academic network. Apply for the next cohort.",
        links: [
          { label: "Apply to Palaver", href: "mailto:info@palaverinstitute.org" },
          { label: "palaverinstitute.org", href: "https://palaverinstitute.org" },
        ],
      },
      {
        title: "Want to build together?",
        description:
          "Partner with 3Doors, Palaver Institute, or DeWise Foundation. Speaking invitations, collaborations, and funding inquiries welcome.",
        links: [{ label: "Send a Message", href: "#contact-form" }],
      },
    ],
    form: {
      formspreeAction: "https://formspree.io/f/xgonkjbg",
      email: "triumph@palaverinstitute.org",
    },
  },
} as const;


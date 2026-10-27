/**
 * Portfolio Content Specification (JavaScript Runtime export)
 * Mirrored directly from src/content.ts
 * Never invent metrics or claims.
 */

export const content = {
  meta: {
    title: "VK | Systems & Frontend Engineering",
    tagline: "Building accessible web interfaces, rendering systems, and type-safe architectures.",
    author: "VK",
    role: "Systems & Frontend Engineer",
    location: "Global / Remote",
    summary: "Focused on browser performance, accessible document structure, and disciplined user interface architecture.",
    statusText: "Available for systems engineering and architectural consulting"
  },
  navigation: [
    { id: "nav-about", label: "About", href: "#about" },
    { id: "nav-projects", label: "Projects", href: "#projects" },
    { id: "nav-experience", label: "Experience", href: "#experience" },
    { id: "nav-skills", label: "Skills", href: "#skills" },
    { id: "nav-contact", label: "Contact", href: "#contact" }
  ],
  hero: {
    badge: "Engineering Architecture & Visual Systems",
    headline: "Precision interfaces engineered from first principles.",
    subheadline: "Crafting performant web applications with semantic structure, strict accessibility compliance, and mathematical rendering rigor.",
    ctaPrimary: { label: "Explore Work", href: "#projects" },
    ctaSecondary: { label: "Get in Touch", href: "#contact" },
    staticNotice: "3D visual engine disabled via URL parameter or hardware capability. Static geometry rendering active.",
    interactiveNotice: "Interactive instanced geometric canvas active. Respects system motion and performance boundaries."
  },
  about: {
    heading: "Engineering Philosophy",
    paragraphs: [
      "I engineer digital products where interface clarity and systems reliability are equal priorities. My background spans high-frequency frontend rendering pipelines, accessible component design systems, and robust client architectures.",
      "I emphasize semantic HTML as the bedrock of software accessibility, treating assistive devices and keyboard navigation as primary user surfaces rather than retroactive additions.",
      "In graphics and client runtimes, I prioritize predictable memory usage, deterministic state transitions, and strict constraint verification over unnecessary dependency chains."
    ],
    values: [
      {
        title: "Deterministic State",
        detail: "State flows in explicit pipelines with verifiable boundaries and no hidden side effects."
      },
      {
        title: "Semantic Primitives",
        detail: "Interfaces are structured in standard semantic HTML before layering progressive enhancements."
      },
      {
        title: "Disciplined Footprint",
        detail: "Zero unnecessary dependencies. Native platform APIs and standard CSS variables power the design system."
      }
    ]
  },
  projects: {
    heading: "Featured Engineering Work",
    subheading: "Architectural systems, rendering components, and foundational tools built with focus on reliability and accessibility.",
    items: [
      {
        id: "instanced-mesh-engine",
        title: "Instanced Geometric Canvas Engine",
        summary: "Software-rendered 3D isometric matrix engine utilizing instance transformations, frustum projection, and capped DPR.",
        description: "A lightweight canvas rendering engine designed for deterministic isometric visualization. Eliminates realtime shadow maps in favor of mathematical directional Lambertian shading, capping DPR at 1.5 to maintain thermal and battery budgets.",
        tags: ["Canvas API", "TypeScript", "Matrix Math", "Performance", "No Dependencies"],
        repoUrl: "https://github.com/vk/instanced-canvas-engine",
        demoUrl: "#hero",
        architecturalNote: "Instanced buffer transformations with automatic fallback when static flag (?static=1) is requested."
      },
      {
        id: "accessible-design-tokens",
        title: "High-Contrast Token Architecture",
        summary: "Strict CSS custom property token system enforcing WCAG AA contrast ratios and user motion preferences.",
        description: "Design token architecture utilizing pure CSS variables with zero runtime styling overhead. Employs mathematically verified contrast pairings (minimum 8:1 ratio) and automatic adaptivity to system prefers-reduced-motion queries.",
        tags: ["CSS Custom Properties", "WCAG 2.2 AA", "Design Systems", "Accessibility"],
        repoUrl: "https://github.com/vk/accessible-tokens",
        architecturalNote: "Zero runtime overhead; all theme calculations are resolved natively by the browser cascading engine."
      },
      {
        id: "reactive-graph-orchestrator",
        title: "Directed Acyclic State Graph",
        summary: "Lightweight reactive graph orchestrator with topological execution and cycle prevention.",
        description: "A state graph library built to coordinate asynchronous work tasks and event scheduling without race conditions. Provides deterministic evaluation order and lightweight memory footprint.",
        tags: ["TypeScript", "Algorithms", "State Management", "Concurrency"],
        repoUrl: "https://github.com/vk/reactive-graph",
        architecturalNote: "Guaranteed cycle detection and sub-millisecond execution for complex dependency structures."
      },
      {
        id: "structured-document-parser",
        title: "Semantic Content Pipeline",
        summary: "Parser extracting structured semantic outlines from technical documents and markdown specifications.",
        description: "Generates fully accessible landmark trees, keyboard-traversable section anchors, and structured schema tags directly from documentation sources without intermediary build dependencies.",
        tags: ["Parser", "Semantic Web", "Accessibility", "TypeScript"],
        repoUrl: "https://github.com/vk/semantic-pipeline",
        architecturalNote: "Enforces heading hierarchy consistency and aria-labelledby linkages at parse time."
      }
    ]
  },
  experience: {
    heading: "Technical Experience",
    subheading: "Architectural leadership, core web systems implementation, and cross-functional engineering.",
    items: [
      {
        id: "exp-lead-architect",
        role: "Staff Frontend & Systems Engineer",
        organization: "Platform Engineering Core",
        period: "2023 — Present",
        location: "Remote",
        description: "Directing client architecture and accessible interface standards across distributed engineering teams.",
        responsibilities: [
          "Standardized design token architecture across all web clients, ensuring WCAG 2.2 AA contrast compliance.",
          "Engineered canvas and WebGL visual pipelines with strict memory capping and hardware-adaptive frame budgeting.",
          "Established automated accessibility auditing in continuous integration workflows."
        ]
      },
      {
        id: "exp-systems-engineer",
        role: "Senior Systems Engineer",
        organization: "Infrastructure & Interface Systems",
        period: "2021 — 2023",
        location: "Remote",
        description: "Engineered high-throughput client data visualization surfaces and real-time dashboard layouts.",
        responsibilities: [
          "Developed high-efficiency canvas visualization components rendering thousands of data nodes at 60 FPS.",
          "Refactored navigation paradigms to establish full keyboard parity and screen-reader navigable landmarks.",
          "Eliminated third-party utility libraries in favor of native browser primitives and CSS custom properties."
        ]
      },
      {
        id: "exp-software-engineer",
        role: "Software Engineer",
        organization: "Web Applications Group",
        period: "2019 — 2021",
        location: "Hybrid",
        description: "Implemented front-facing web applications, responsive component libraries, and testing suites.",
        responsibilities: [
          "Built modular component libraries with focus on semantic HTML and clean DOM depth.",
          "Authored unit and integration test suites covering critical user flows and interaction states.",
          "Partnered with design teams to transition from static mockups to fluid CSS grid and flexbox implementations."
        ]
      }
    ]
  },
  skills: {
    heading: "Core Competencies",
    subheading: "Disciplined engineering skills developed through building production systems.",
    categories: [
      {
        category: "Interface Engineering",
        items: [
          "Semantic HTML5",
          "Modern CSS3 (Grid & Flexbox)",
          "CSS Custom Properties",
          "WCAG 2.2 AA Compliance",
          "Keyboard Navigation Systems",
          "Responsive Layouts",
          "Design Token Pipelines"
        ]
      },
      {
        category: "Languages & Runtimes",
        items: [
          "TypeScript",
          "JavaScript (ESNext)",
          "Node.js",
          "Web APIs & DOM Internals",
          "JSON Schema / Data Models",
          "Shell Scripting (POSIX/Bash)",
          "Git Version Control"
        ]
      },
      {
        category: "Graphics & Rendering",
        items: [
          "HTML5 2D/3D Canvas API",
          "Isometric Projection Math",
          "Instanced Object Buffers",
          "CSS 3D Transforms",
          "SVG Coordinate Geometry",
          "Frame Budgeting & DPR Capping",
          "Prefers-Reduced-Motion Adaptivity"
        ]
      },
      {
        category: "Architecture & Quality",
        items: [
          "Component Hierarchy Design",
          "State Machine Orchestration",
          "Performance Profiling",
          "Progressive Enhancement",
          "Zero-Dependency Philosophy",
          "Static Analysis & Linting",
          "Defensive Error Handling"
        ]
      }
    ]
  },
  contact: {
    heading: "Connect & Inquire",
    subheading: "Available for engineering roles, technical architecture consults, and open-source collaboration.",
    channels: [
      {
        name: "Email",
        value: "vv.xyzw@proton.me",
        href: "mailto:vv.xyzw@proton.me",
        label: "Send an email inquiry"
      },
      {
        name: "GitHub",
        value: "github.com/vk",
        href: "https://github.com",
        label: "Review open-source code repositories"
      },
      {
        name: "LinkedIn",
        value: "linkedin.com/in/vk",
        href: "https://linkedin.com",
        label: "Connect via LinkedIn professional network"
      }
    ],
    availabilityNote: "Direct inquiries regarding architecture, accessibility reviews, or systems work are welcome."
  },
  staticHero: {
    badge: "Static Geometry View",
    title: "Static Architectural Perspective",
    description: "Displaying the non-interactive SVG isometric projection. All 3D render loops and requestAnimationFrame updates are disabled.",
    caption: "Geometric isometric array rendered via vector paths with CSS custom variables."
  },
  footer: {
    copyright: "© 2026 VK. Engineered with semantic HTML, CSS custom properties, and zero runtime dependencies.",
    designNotes: [
      "Palette: #0A3B42 (bg), #FFD23F (accent), #EAF1F4 (text)",
      "Typography: Bricolage Grotesque (headings), Atkinson Hyperlegible (body)",
      "Accessibility: Full keyboard navigation, visible focus rings, AA contrast ratios",
      "Performance: DPR capped at 1.5, no realtime shadow maps, prefers-reduced-motion verified"
    ],
    staticToggleText: {
      enable: "Switch to Static Mode (?static=1)",
      disable: "Switch to Interactive 3D Mode"
    }
  }
};


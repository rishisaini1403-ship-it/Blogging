export interface Experience {
  role: string
  company: string
  period: string
  description: string
  highlights: string[]
}

export const experiences: Experience[] = [
  {
    role: 'Senior Frontend Engineer',
    company: 'Tech Corp',
    period: 'Jan 2025 — Present',
    description:
      'Leading the frontend architecture for a SaaS platform serving 50k+ users. Driving migration from a legacy codebase to a modern React + TypeScript stack.',
    highlights: [
      'Migrated 30k lines of legacy code to React 19 with zero downtime',
      'Reduced bundle size by 40% through code splitting and lazy loading',
      'Mentored 3 junior developers through structured code reviews',
    ],
  },
  {
    role: 'Full-Stack Developer',
    company: 'StartupXYZ',
    period: 'Jun 2023 — Dec 2024',
    description:
      'Built and maintained the core product — a real-time collaboration tool. Owned the full stack from Postgres schema design to React UI components.',
    highlights: [
      'Designed and shipped the real-time sync engine using WebSockets',
      'Built an internal admin dashboard handling 100k+ daily events',
      'Wrote comprehensive E2E tests with Playwright, reducing regressions by 60%',
    ],
  },
  {
    role: 'Junior Developer',
    company: 'Agency Co.',
    period: 'Mar 2022 — May 2023',
    description:
      'Developed responsive websites and web apps for a range of clients. Worked closely with designers to implement pixel-perfect UIs.',
    highlights: [
      'Delivered 12 client projects on time and within budget',
      'Introduced TypeScript to the team, improving code quality metrics',
      'Built a reusable component library used across 5+ projects',
    ],
  },
]

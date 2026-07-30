export interface Project {
  title: string
  description: string
  tech: string[]
  image: string
  github: string
  demo: string
}

export const projects: Project[] = [
  {
    title: 'Portfolio',
    description:
      'A minimalist, premium-feeling personal portfolio built with React, TypeScript, and Tailwind CSS. Features a hero-to-sidebar scroll transition, animated sections, and a full blog with markdown rendering.',
    tech: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    image: '',
    github: 'https://github.com/harish/portfolio',
    demo: 'https://harish.dev',
  },
  {
    title: 'CLI Tool',
    description:
      'A command-line task manager written in Go. Supports markdown notes, due dates, tags, and a clean terminal UI with color-coded output and persistent storage.',
    tech: ['Go', 'Cobra', 'SQLite'],
    image: '',
    github: 'https://github.com/harish/cli-tool',
    demo: '',
  },
  {
    title: 'Weather App',
    description:
      'A progressive web app that displays hyperlocal weather data. Uses the OpenWeather API, service workers for offline access, and a clean card-based layout.',
    tech: ['React', 'PWA', 'OpenWeather API'],
    image: '',
    github: 'https://github.com/harish/weather',
    demo: 'https://weather.harish.dev',
  },
]

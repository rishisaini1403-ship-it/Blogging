export interface Skill {
  name: string
  level: 1 | 2 | 3 | 4
  category: string
}

export const skills: Skill[] = [
  { name: 'JavaScript', level: 4, category: 'Languages' },
  { name: 'TypeScript', level: 4, category: 'Languages' },
  { name: 'Python', level: 3, category: 'Languages' },
  { name: 'React', level: 4, category: 'Frontend' },
  { name: 'HTML/CSS', level: 4, category: 'Frontend' },
  { name: 'Node.js', level: 3, category: 'Backend' },
  { name: 'PostgreSQL', level: 3, category: 'Backend' },
  { name: 'Git', level: 3, category: 'Tools' },
  { name: 'Linux', level: 3, category: 'Tools' },
]

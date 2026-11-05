import { CategoryInfo } from '../types/quiz';

export const QUIZ_CATEGORIES: CategoryInfo[] = [
  {
    id: 9,
    name: 'General Knowledge',
    slug: 'general-knowledge',
    iconName: 'Compass',
    description: 'Test your trivia across everyday world facts, culture, and curiosities.',
    seedColor: '#4F46E5', // Indigo
    gradient: 'from-indigo-500 to-blue-600',
    totalQuestionsCount: 45,
  },
  {
    id: 17,
    name: 'Science & Nature',
    slug: 'science',
    iconName: 'Atom',
    description: 'Explore the mysteries of biology, physics, chemistry, and our universe.',
    seedColor: '#059669', // Emerald
    gradient: 'from-emerald-500 to-teal-600',
    totalQuestionsCount: 38,
  },
  {
    id: 19,
    name: 'Mathematics',
    slug: 'mathematics',
    iconName: 'Calculator',
    description: 'Sharpen logic, algebra, geometry, calculus, and numerical puzzles.',
    seedColor: '#D97706', // Amber
    gradient: 'from-amber-500 to-orange-600',
    totalQuestionsCount: 30,
  },
  {
    id: 18,
    name: 'Computer Science',
    slug: 'computer-science',
    iconName: 'Cpu',
    description: 'Algorithms, data structures, programming languages, and architecture.',
    seedColor: '#2563EB', // Blue
    gradient: 'from-blue-500 to-cyan-600',
    totalQuestionsCount: 42,
  },
  {
    id: 23,
    name: 'History',
    slug: 'history',
    iconName: 'Hourglass',
    description: 'Journey through ancient empires, pivotal wars, revolutions, and world eras.',
    seedColor: '#9333EA', // Purple
    gradient: 'from-purple-500 to-pink-600',
    totalQuestionsCount: 36,
  },
  {
    id: 21,
    name: 'Sports',
    slug: 'sports',
    iconName: 'Trophy',
    description: 'Global tournaments, records, legendary athletes, and Olympic trivia.',
    seedColor: '#EA580C', // Orange
    gradient: 'from-orange-500 to-red-600',
    totalQuestionsCount: 32,
  },
  {
    id: 30,
    name: 'Technology',
    slug: 'technology',
    iconName: 'Laptop',
    description: 'Smartphones, AI innovations, web evolution, and hardware breakthroughs.',
    seedColor: '#0891B2', // Cyan
    gradient: 'from-cyan-500 to-blue-600',
    totalQuestionsCount: 35,
  },
];

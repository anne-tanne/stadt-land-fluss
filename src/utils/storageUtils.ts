// Local storage utilities

export const STORAGE_KEYS = {
  QUIZ_PROGRESS: 'länder-quiz-progress',
  QUIZ_SESSION: 'länder-quiz-session',
  STUDY_PROGRESS: 'länder-study-progress'
} as const

export interface QuizProgress {
  currentLetter: string
  letterProgress: { [letter: string]: string[] }
  lastUpdated: string
  selectedContinent?: string
}

export interface QuizSession {
  isActive: boolean
  startTime: string | null
  totalCountriesFound: number
  selectedContinent?: string
}

export const saveToStorage = <T>(key: string, data: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error)
  }
}

export const loadFromStorage = <T>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch (error) {
    console.error(`Error loading from localStorage (${key}):`, error)
    return defaultValue
  }
}

export const removeFromStorage = (key: string): void => {
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage (${key}):`, error)
  }
}

export const clearExpiredProgress = (maxAgeHours: number = 24): void => {
  const now = new Date()
  const maxAge = maxAgeHours * 60 * 60 * 1000

  Object.values(STORAGE_KEYS).forEach(key => {
    const data = loadFromStorage(key, null)
    if (data && typeof data === 'object' && 'lastUpdated' in data) {
      const savedDate = new Date((data as any).lastUpdated)
      if (now.getTime() - savedDate.getTime() > maxAge) {
        removeFromStorage(key)
        console.log(`Cleared expired progress: ${key}`)
      }
    }
  })
} 
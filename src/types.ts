export interface Country {
  name: string
  letter: string
  originalLetter: string
  continent: string
  population?: string
  learned: boolean
  lastReviewed: string | null
  reviewCount: number
  nextReview: string | null
  alternatives?: string[]
}

export interface City {
  name: string
  letter: string
  originalLetter: string
  continent: string
  country: string
  population: string
  learned: boolean
  lastReviewed: string | null
  reviewCount: number
  nextReview: string | null
  alternatives?: string[]
}

export type DataItem = Country | City

export interface StudySession {
  currentItem: DataItem | null
  isAnswerRevealed: boolean
  sessionProgress: number
  totalInSession: number
} 
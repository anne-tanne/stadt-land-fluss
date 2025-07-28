export interface Country {
  name: string
  letter: string
  originalLetter: string
  learned: boolean
  lastReviewed: string | null
  reviewCount: number
  nextReview: string | null
}

export interface StudySession {
  currentCountry: Country | null
  isAnswerRevealed: boolean
  sessionProgress: number
  totalInSession: number
} 
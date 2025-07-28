import { useState, useEffect } from 'react'
import type { Country, StudySession } from '../types'
import { RotateCcw, ArrowLeft, ArrowRight, Check, X } from 'lucide-react'

interface StudyModeProps {
  countries: Country[]
  onCountryProgress: (countryName: string, learned: boolean) => void
}

const StudyMode = ({ countries, onCountryProgress }: StudyModeProps) => {
  const [session, setSession] = useState<StudySession>({
    currentCountry: null,
    isAnswerRevealed: false,
    sessionProgress: 0,
    totalInSession: 0
  })
  const [studyQueue, setStudyQueue] = useState<Country[]>([])
  const [isFlipped, setIsFlipped] = useState<boolean>(false)

  useEffect(() => {
    // Get countries that need review (not learned or due for review)
    const now = new Date()
    const needsReview = countries.filter(country => 
      !country.learned || 
      (country.nextReview && new Date(country.nextReview) <= now)
    )
    
    // Shuffle the queue for random order
    const shuffled = [...needsReview].sort(() => Math.random() - 0.5)
    setStudyQueue(shuffled)
    setSession(prev => ({ ...prev, totalInSession: shuffled.length }))
  }, [countries])

  useEffect(() => {
    if (studyQueue.length > 0 && !session.currentCountry) {
      setSession(prev => ({ ...prev, currentCountry: studyQueue[0] }))
    }
  }, [studyQueue, session.currentCountry])

  const handleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  const handleAnswer = (correct: boolean) => {
    if (session.currentCountry) {
      onCountryProgress(session.currentCountry.name, correct)
      
      // Remove current country from queue
      const newQueue = studyQueue.slice(1)
      setStudyQueue(newQueue)
      
      // Move to next country or end session
      if (newQueue.length > 0) {
        setSession({
          currentCountry: newQueue[0],
          isAnswerRevealed: false,
          sessionProgress: session.sessionProgress + 1,
          totalInSession: session.totalInSession
        })
        setIsFlipped(false)
      } else {
        setSession({
          currentCountry: null,
          isAnswerRevealed: false,
          sessionProgress: session.sessionProgress + 1,
          totalInSession: session.totalInSession
        })
      }
    }
  }

  const resetSession = () => {
    const now = new Date()
    const needsReview = countries.filter(country => 
      !country.learned || 
      (country.nextReview && new Date(country.nextReview) <= now)
    )
    const shuffled = [...needsReview].sort(() => Math.random() - 0.5)
    setStudyQueue(shuffled)
    setSession({
      currentCountry: shuffled.length > 0 ? shuffled[0] : null,
      isAnswerRevealed: false,
      sessionProgress: 0,
      totalInSession: shuffled.length
    })
    setIsFlipped(false)
  }

  if (studyQueue.length === 0 && session.currentCountry === null) {
    return (
      <div className="study-mode">
        <div className="study-complete">
          <h2>🎉 Study Session Complete!</h2>
          <p>You've reviewed {session.sessionProgress} countries.</p>
          <button className="reset-btn" onClick={resetSession}>
            <RotateCcw size={20} />
            Start New Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="study-mode">
      <div className="study-header">
        <h2>Study Mode - Flashcards</h2>
        <div className="progress-info">
          <span>Progress: {session.sessionProgress + 1} / {session.totalInSession}</span>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((session.sessionProgress + 1) / session.totalInSession) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {session.currentCountry && (
        <div className="flashcard-container">
          <div 
            className={`flashcard ${isFlipped ? 'flipped' : ''}`}
            onClick={handleFlip}
          >
            <div className="flashcard-front">
              <h3>Starting Letter</h3>
              <div className="flashcard-content">
                <h2 className="letter-display">{session.currentCountry.letter}</h2>
                <p>Click to see a country that starts with this letter</p>
              </div>
            </div>
            
            <div className="flashcard-back">
              <h3>Country Name</h3>
              <div className="flashcard-content">
                <h2>{session.currentCountry.name}</h2>
                <p>Starts with: {session.currentCountry.letter}</p>
              </div>
            </div>
          </div>

          <div className="flashcard-actions">
            <button 
              className="flip-btn" 
              onClick={handleFlip}
            >
              {isFlipped ? <ArrowLeft size={20} /> : <ArrowRight size={20} />}
              {isFlipped ? 'Show Letter' : 'Show Country'}
            </button>
          </div>

          <div className="answer-buttons">
            <button 
              className="answer-btn correct" 
              onClick={() => handleAnswer(true)}
            >
              <Check size={20} />
              I Knew This
            </button>
            <button 
              className="answer-btn incorrect" 
              onClick={() => handleAnswer(false)}
            >
              <X size={20} />
              I Didn't Know
            </button>
          </div>

          <div className="country-stats">
            <p>Reviewed: {session.currentCountry.reviewCount} times</p>
            {session.currentCountry.lastReviewed && (
              <p>Last reviewed: {new Date(session.currentCountry.lastReviewed).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default StudyMode 
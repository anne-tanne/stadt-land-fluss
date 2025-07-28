import React from 'react'
import { getAvailableLetters } from '../../utils/letterUtils'
import styles from '../../styles/Quiz.module.css'

interface LetterNavigationProps {
  currentLetter: string
  onLetterChange: (letter: string) => void
  getLetterProgress: (letter: string) => { found: number; total: number }
}

export const LetterNavigation: React.FC<LetterNavigationProps> = ({
  currentLetter,
  onLetterChange,
  getLetterProgress
}) => {
  const availableLetters = getAvailableLetters()

  return (
    <div className={styles.letterNavigation}>
      <h3>Buchstaben Navigation</h3>
      <div className={styles.letterButtons}>
        {availableLetters.map(letter => {
          const progress = getLetterProgress(letter)
          const isActive = letter === currentLetter
          const isComplete = progress.found === progress.total && progress.total > 0
          
          return (
            <button
              key={letter}
              className={`${styles.letterBtn} ${isActive ? styles.active : ''} ${isComplete ? styles.complete : ''}`}
              onClick={() => onLetterChange(letter)}
            >
              <span className={styles.letter}>{letter}</span>
              <span className={styles.progress}>{progress.found}/{progress.total}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
} 
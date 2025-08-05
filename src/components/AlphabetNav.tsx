import type { DataItem } from '../types'

interface AlphabetNavProps {
  selectedLetter: string
  onLetterSelect: (letter: string) => void
  data: DataItem[]
  selectedContinent?: string
}

const AlphabetNav = ({ selectedLetter, onLetterSelect, data }: AlphabetNavProps) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const getProgressForLetter = (letter: string) => {
    const letterData = data.filter(item => item.letter === letter)
    if (letterData.length === 0) return 0
    const learnedCount = letterData.filter(item => item.learned).length
    return Math.round((learnedCount / letterData.length) * 100)
  }

  return (
    <nav className="alphabet-nav">
      <div className="alphabet-grid">
        {alphabet.map(letter => {
          const progress = getProgressForLetter(letter)
          const hasData = data.some(item => item.letter === letter)
          
          return (
            <button
              key={letter}
              className={`alphabet-btn ${selectedLetter === letter ? 'active' : ''} ${!hasData ? 'disabled' : ''}`}
              onClick={() => hasData && onLetterSelect(letter)}
              disabled={!hasData}
            >
              <span className="letter">{letter}</span>
              {hasData && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {hasData && (
                <span className="progress-text">{progress}%</span>
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default AlphabetNav 
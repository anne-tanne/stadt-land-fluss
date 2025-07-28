import type { Country } from '../types'

interface AlphabetNavProps {
  selectedLetter: string
  onLetterSelect: (letter: string) => void
  countries: Country[]
}

const AlphabetNav = ({ selectedLetter, onLetterSelect, countries }: AlphabetNavProps) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

  const getProgressForLetter = (letter: string) => {
    const letterCountries = countries.filter(country => country.letter === letter)
    if (letterCountries.length === 0) return 0
    const learnedCount = letterCountries.filter(country => country.learned).length
    return Math.round((learnedCount / letterCountries.length) * 100)
  }

  return (
    <nav className="alphabet-nav">
      <div className="alphabet-grid">
        {alphabet.map(letter => {
          const progress = getProgressForLetter(letter)
          const hasCountries = countries.some(country => country.letter === letter)
          
          return (
            <button
              key={letter}
              className={`alphabet-btn ${selectedLetter === letter ? 'active' : ''} ${!hasCountries ? 'disabled' : ''}`}
              onClick={() => hasCountries && onLetterSelect(letter)}
              disabled={!hasCountries}
            >
              <span className="letter">{letter}</span>
              {hasCountries && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}
              {hasCountries && (
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
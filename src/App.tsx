import { useState, useEffect } from 'react'
import './App.css'
import countriesData from './countries.json'
import AlphabetNav from './components/AlphabetNav'
import CountryList from './components/CountryList'
import StudyMode from './components/StudyMode'
import QuizMode from './components/QuizMode'
import type { Country } from './types'

type AppMode = 'browse' | 'study' | 'quiz'

// Function to normalize special characters to their base letters
const normalizeLetter = (letter: string): string => {
  const specialChars: { [key: string]: string } = {
    'Ö': 'O',
    'Ä': 'A', 
    'Ü': 'U',
    'ö': 'o',
    'ä': 'a',
    'ü': 'u'
  }
  return specialChars[letter] || letter
}

function App() {
  const [selectedLetter, setSelectedLetter] = useState<string>('A')
  const [appMode, setAppMode] = useState<AppMode>('browse')
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    // Convert the JSON data to our Country format with normalized letters
    const countriesWithProgress = countriesData.map((countryName: string) => {
      const firstChar = countryName.charAt(0)
      const normalizedLetter = normalizeLetter(firstChar.toUpperCase())
      
      return {
        name: countryName,
        letter: normalizedLetter,
        originalLetter: firstChar.toUpperCase(), // Keep original for display
        learned: false,
        lastReviewed: null,
        reviewCount: 0,
        nextReview: null
      }
    })
    setCountries(countriesWithProgress)
  }, [])

  const getCountriesByLetter = (letter: string) => {
    return countries.filter(country => country.letter === letter)
  }

  const updateCountryProgress = (countryName: string, learned: boolean) => {
    setCountries(prev => prev.map(country => 
      country.name === countryName 
        ? { 
            ...country, 
            learned, 
            lastReviewed: new Date().toISOString(),
            reviewCount: country.reviewCount + 1,
            nextReview: learned ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
          }
        : country
    ))
  }

  const markCountryAsLearned = (countryName: string) => {
    updateCountryProgress(countryName, true)
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title" onClick={() => setAppMode('browse')}>
        🌍 Stadt, Land, Fluss
        </h1>
        <div className="mode-toggle">
          <button 
            className={appMode === 'browse' ? 'active' : ''} 
            onClick={() => setAppMode('browse')}
          >
            Browse
          </button>
          <button 
            className={appMode === 'quiz' ? 'active' : ''} 
            onClick={() => setAppMode('quiz')}
          >
            Quiz Mode
          </button>
        </div>
      </header>

      <main className="app-main">
        {appMode === 'browse' && (
          <>
            <AlphabetNav 
              selectedLetter={selectedLetter} 
              onLetterSelect={setSelectedLetter}
              countries={countries}
            />
            <CountryList 
              countries={getCountriesByLetter(selectedLetter)}
              onCountryToggle={updateCountryProgress}
            />
          </>
        )}
        
        {appMode === 'study' && (
          <StudyMode 
            countries={countries}
            onCountryProgress={updateCountryProgress}
          />
        )}
        
        {appMode === 'quiz' && (
          <QuizMode 
            countries={countries}
            onCountryLearned={markCountryAsLearned}
          />
        )}
      </main>
    </div>
  )
}

export default App

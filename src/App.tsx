import { useState, useEffect } from 'react'
import './App.css'
import countriesData from './countries.json'
import AlphabetNav from './components/AlphabetNav'
import CountryList from './components/CountryList'
import StudyMode from './components/StudyMode'
import QuizMode from './components/QuizMode'
import ContinentNav from './components/ContinentNav'
import OverallView from './components/OverallView'
import type { Country } from './types'
import { useTranslation } from './translations'

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
  const { t } = useTranslation()
  const [selectedLetter, setSelectedLetter] = useState<string>('A')
  const [selectedContinent, setSelectedContinent] = useState<string>('Alle')
  const [viewMode, setViewMode] = useState<'alphabetical' | 'overall'>('alphabetical')
  const [appMode, setAppMode] = useState<AppMode>('browse')
  const [countries, setCountries] = useState<Country[]>([])

  useEffect(() => {
    // Convert the JSON data to our Country format with normalized letters
    const countriesWithProgress = countriesData.map((countryData: any) => {
      const firstChar = countryData.name.charAt(0)
      const normalizedLetter = normalizeLetter(firstChar.toUpperCase())
      
      return {
        name: countryData.name,
        letter: normalizedLetter,
        originalLetter: firstChar.toUpperCase(), // Keep original for display
        continent: countryData.continent,
        learned: false,
        lastReviewed: null,
        reviewCount: 0,
        nextReview: null
      }
    })
    setCountries(countriesWithProgress)
  }, [])

  const getFilteredCountries = () => {
    let filtered = countries

    // Filter by continent
    if (selectedContinent !== 'Alle') {
      filtered = filtered.filter(country => country.continent === selectedContinent)
    }

    return filtered
  }

  const getCountriesByLetter = (letter: string) => {
    const filtered = getFilteredCountries()
    return filtered.filter(country => country.letter === letter)
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
        🌍 {t('appTitle')}
        </h1>
        <div className="mode-toggle">
          <button 
            className={appMode === 'browse' ? 'active' : ''} 
            onClick={() => setAppMode('browse')}
          >
            {t('browse')}
          </button>
          <button 
            className={appMode === 'quiz' ? 'active' : ''} 
            onClick={() => setAppMode('quiz')}
          >
            {t('quizMode')}
          </button>
        </div>
      </header>

      <main className="app-main">
        {appMode === 'browse' && (
          <>
            <div className="browse-controls">
              <div className="view-mode-toggle">
                <button 
                  className={viewMode === 'alphabetical' ? 'active' : ''} 
                  onClick={() => setViewMode('alphabetical')}
                >
                  {t('alphabeticalView')}
                </button>
                <button 
                  className={viewMode === 'overall' ? 'active' : ''} 
                  onClick={() => setViewMode('overall')}
                >
                  {t('overallView')}
                </button>
              </div>
              
              <ContinentNav 
                selectedContinent={selectedContinent}
                onContinentSelect={setSelectedContinent}
                countries={countries}
              />
            </div>

            {viewMode === 'alphabetical' && (
              <>
                <AlphabetNav 
                  selectedLetter={selectedLetter} 
                  onLetterSelect={setSelectedLetter}
                  countries={getFilteredCountries()}
                />
                <CountryList 
                  countries={getCountriesByLetter(selectedLetter)}
                  onCountryToggle={updateCountryProgress}
                />
              </>
            )}

            {viewMode === 'overall' && (
              <OverallView 
                countries={getFilteredCountries()}
                onCountryToggle={updateCountryProgress}
              />
            )}
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

import React, { useState } from 'react'
import './App.css'
import AlphabetNav from './components/AlphabetNav'
import CountryList from './components/CountryList'
import StudyMode from './components/StudyMode'
import { QuizModeRefactored } from './components/QuizModeRefactored'
import ContinentNav from './components/ContinentNav'
import OverallView from './components/OverallView'
import { CountryProvider, useCountryContext } from './contexts/CountryContext'
import { useTranslation } from './translations'

type AppMode = 'browse' | 'study' | 'quiz'

const AppContent: React.FC = () => {
  const { t } = useTranslation()
  const { markCountryAsLearned, getFilteredCountries, getCountriesByLetter } = useCountryContext()
  
  const [selectedLetter, setSelectedLetter] = useState<string>('A')
  const [selectedContinent, setSelectedContinent] = useState<string>('Alle')
  const [viewMode, setViewMode] = useState<'alphabetical' | 'overall'>('alphabetical')
  const [appMode, setAppMode] = useState<AppMode>('browse')

  const filteredCountries = getFilteredCountries(selectedContinent)
  const countriesByLetter = getCountriesByLetter(selectedLetter, selectedContinent)

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
            📚 {t('browse')}
          </button>
          <button 
            className={appMode === 'study' ? 'active' : ''} 
            onClick={() => setAppMode('study')}
          >
            🧠 {t('studyMode')}
          </button>
          <button 
            className={appMode === 'quiz' ? 'active' : ''} 
            onClick={() => setAppMode('quiz')}
          >
            🎯 {t('quizMode')}
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
                  🔤 {t('alphabeticalView')}
                </button>
                <button 
                  className={viewMode === 'overall' ? 'active' : ''} 
                  onClick={() => setViewMode('overall')}
                >
                  🌍 {t('overallView')}
                </button>
              </div>
            </div>

            <ContinentNav 
              selectedContinent={selectedContinent}
              onContinentSelect={setSelectedContinent}
              countries={filteredCountries}
            />

            {viewMode === 'alphabetical' ? (
              <>
                <AlphabetNav 
                  selectedLetter={selectedLetter}
                  onLetterSelect={setSelectedLetter}
                  countries={filteredCountries}
                />
                <CountryList 
                  countries={countriesByLetter}
                  onCountryToggle={markCountryAsLearned}
                />
              </>
            ) : (
              <OverallView 
                countries={filteredCountries}
                onCountryToggle={markCountryAsLearned}
              />
            )}
          </>
        )}

        {appMode === 'study' && (
          <StudyMode 
            countries={filteredCountries}
            onCountryProgress={markCountryAsLearned}
          />
        )}

        {appMode === 'quiz' && (
          <QuizModeRefactored 
            onCountryLearned={markCountryAsLearned}
          />
        )}
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <CountryProvider>
      <AppContent />
    </CountryProvider>
  )
}

export default App 
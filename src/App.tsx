import React, { useMemo } from 'react'
import './App.css'
import './styles/design-system.css'
import './styles/components.css'
import AlphabetNav from './components/AlphabetNav'
import CountryList from './components/CountryList'
import { QuizMode } from './components/QuizMode'
import { ContinentDropdown } from './components/ContinentDropdown'
import OverallView from './components/OverallView'
import { ErrorBoundary } from './components/ErrorBoundary'
import { CountryProvider, useCountryContext } from './contexts/CountryContext'
import { useAppState } from './hooks/useAppState'
import { useTranslation } from './translations'

const AppContent: React.FC = () => {
  const { t } = useTranslation()
  const { markCountryAsLearned, getFilteredCountries, getCountriesByLetter } = useCountryContext()
  const {
    appMode,
    viewMode,
    selectedLetter,
    selectedContinent,
    setAppMode,
    setViewMode,
    setSelectedLetter,
    setSelectedContinent,
    resetToBrowse
  } = useAppState()

  const filteredCountries = useMemo(() => 
    getFilteredCountries(selectedContinent), 
    [getFilteredCountries, selectedContinent]
  )
  
  const countriesByLetter = useMemo(() => 
    getCountriesByLetter(selectedLetter, selectedContinent), 
    [getCountriesByLetter, selectedLetter, selectedContinent]
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title" onClick={resetToBrowse}>
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
            className={appMode === 'quiz' ? 'active' : ''} 
            onClick={() => setAppMode('quiz')}
          >
            🎯 {t('quizMode')}
          </button>
        </div>
      </header>

      <main className="app-main">
        <ErrorBoundary>
        {appMode === 'browse' && (
            <>
              <ContinentDropdown 
                selectedContinent={selectedContinent}
                onContinentChange={setSelectedContinent}
              />

              <div className="browse-controls">
                <div className="view-mode-toggle">
                  <button 
                    className={viewMode === 'overall' ? 'active' : ''} 
                    onClick={() => setViewMode('overall')}
                  >
                    {t('overallView')}
                  </button>
                  <button 
                    className={viewMode === 'alphabetical' ? 'active' : ''} 
                    onClick={() => setViewMode('alphabetical')}
                  >
                    {t('alphabeticalView')}
                  </button>
                </div>
              </div>

              {viewMode === 'alphabetical' ? (
          <>
            <AlphabetNav 
              selectedLetter={selectedLetter} 
              onLetterSelect={setSelectedLetter}
                    countries={filteredCountries}
                    selectedContinent={selectedContinent}
            />
            <CountryList 
                    countries={countriesByLetter}
                    onCountryToggle={markCountryAsLearned}
                    selectedContinent={selectedContinent}
            />
          </>
              ) : (
                <OverallView 
                  countries={filteredCountries}
                  onCountryToggle={markCountryAsLearned}
                  selectedContinent={selectedContinent}
          />
              )}
            </>
        )}
        
        {appMode === 'quiz' && (
            <QuizMode 
              selectedContinent={selectedContinent}
              onCountryLearned={markCountryAsLearned}
              onReturnToBrowse={resetToBrowse}
            />
          )}
        </ErrorBoundary>
      </main>
    </div>
  )
}

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <CountryProvider>
        <AppContent />
      </CountryProvider>
    </ErrorBoundary>
  )
}

export default App
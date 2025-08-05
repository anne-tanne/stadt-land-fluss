import React, { useMemo, useEffect } from 'react'
import './App.css'
import './styles/design-system.css'
import './styles/components.css'
import AlphabetNav from './components/AlphabetNav'
import CountryList from './components/CountryList'
import { QuizMode } from './components/QuizMode'
import { ContinentDropdown } from './components/ContinentDropdown'
import OverallView from './components/OverallView'
import { ErrorBoundary } from './components/ErrorBoundary'
import { DataProvider, useDataContext } from './contexts/CountryContext'

import { useAppState } from './hooks/useAppState'
import { useTranslation } from './translations'

const AppContent: React.FC = () => {
  const { t } = useTranslation()
  const { markItemAsLearned, getFilteredData, getDataByLetter, dataMode, setDataMode } = useDataContext()
  
  // Clear quiz-related localStorage on app load to prevent data mixing issues
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Only clear quiz-related storage, not all localStorage
      localStorage.removeItem('länder-quiz-progress')
      localStorage.removeItem('länder-quiz-session')
      localStorage.removeItem('länder-study-progress')
    }
  }, [])
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

  const filteredData = useMemo(() => 
    getFilteredData(selectedContinent), 
    [getFilteredData, selectedContinent]
  )
  
  const dataByLetter = useMemo(() => 
    getDataByLetter(selectedLetter, selectedContinent), 
    [getDataByLetter, selectedLetter, selectedContinent]
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title" onClick={resetToBrowse}>
          🌍 {t('appTitle')}
        </h1>
        <div className="mode-toggle">
          <div className="data-mode-section">
            <button 
              className={appMode === 'browse' && dataMode === 'cities' ? 'active' : ''} 
              onClick={() => {
                setAppMode('browse')
                setDataMode('cities')
              }}
            >
              🏙️ Stadt
            </button>
            <button 
              className={appMode === 'browse' && dataMode === 'countries' ? 'active' : ''} 
              onClick={() => {
                setAppMode('browse')
                setDataMode('countries')
              }}
            >
              🌍 Land
            </button>
          </div>
          <div className="quiz-section">
            <button 
              className={appMode === 'quiz' ? 'active' : ''} 
              onClick={() => setAppMode('quiz')}
            >
              🎯 Quiz
            </button>
          </div>
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

              <div className="view-toggle">
                <button 
                  className={viewMode === 'alphabetical' ? 'active' : ''} 
                  onClick={() => setViewMode('alphabetical')}
                >
                  📝 Alphabetisch
                </button>
                <button 
                  className={viewMode === 'overall' ? 'active' : ''} 
                  onClick={() => setViewMode('overall')}
                >
                  📊 Übersicht
                </button>
              </div>

              {viewMode === 'alphabetical' ? (
                <>
                  <AlphabetNav 
                    selectedLetter={selectedLetter} 
                    onLetterSelect={setSelectedLetter}
                    data={filteredData}
                    selectedContinent={selectedContinent}
                  />
                  <CountryList 
                    data={dataByLetter}
                    onItemToggle={markItemAsLearned}
                    selectedContinent={selectedContinent}
                    dataMode={dataMode}
                  />
                </>
              ) : (
                <OverallView 
                  data={filteredData}
                  onItemToggle={markItemAsLearned}
                  selectedContinent={selectedContinent}
                  dataMode={dataMode}
                />
              )}
            </>
        )}
        
        {appMode === 'quiz' && (
          <QuizMode 
              selectedContinent={selectedContinent}
            onItemLearned={markItemAsLearned}
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
      <DataProvider>
        <AppContent />
      </DataProvider>
    </ErrorBoundary>
  )
}

export default App
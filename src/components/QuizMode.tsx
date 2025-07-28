import { useState, useEffect, useRef } from 'react'
import type { Country } from '../types'
import { Check, RotateCcw, Target, Play, Home } from 'lucide-react'
import { useTranslation } from '../translations'
import ContinentNav from './ContinentNav'

interface QuizModeProps {
  countries: Country[]
  onCountryLearned: (countryName: string) => void
}

// Function to normalize special characters to their base letters (for internal use if needed)


// Local storage keys
const QUIZ_STORAGE_KEY = 'länder-quiz-progress'
const QUIZ_SESSION_KEY = 'länder-quiz-session'

interface QuizProgress {
  currentLetter: string
  letterProgress: { [letter: string]: string[] } // Save progress for each letter
  lastUpdated: string
  selectedContinent?: string // Add continent to progress
}

interface QuizSession {
  isActive: boolean
  startTime: string | null
  totalCountriesFound: number
  selectedContinent?: string // Add continent to session
}

const QuizMode = ({ countries, onCountryLearned }: QuizModeProps) => {
  const { t } = useTranslation()
  console.log('QuizMode component called with countries:', countries.length)
  
  const [currentLetter, setCurrentLetter] = useState<string>('A')
  const [inputValue, setInputValue] = useState<string>('')
  const [foundCountries, setFoundCountries] = useState<Set<string>>(new Set())
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false)
  const [showEndScreen, setShowEndScreen] = useState<boolean>(false)
  const [selectedContinent, setSelectedContinent] = useState<string>('Alle')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  // Filter countries by selected continent
  const getFilteredCountries = () => {
    if (selectedContinent === 'Alle') {
      return countries
    }
    return countries.filter(country => country.continent === selectedContinent)
  }

  const filteredCountries = getFilteredCountries()

  // Load saved progress and session on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY)
    const savedSession = localStorage.getItem(QUIZ_SESSION_KEY)
    
    console.log('Loading quiz state...')
    console.log('Saved progress:', savedProgress)
    console.log('Saved session:', savedSession)
    
    if (savedProgress) {
      try {
        const progress: QuizProgress = JSON.parse(savedProgress)
        const savedDate = new Date(progress.lastUpdated)
        const now = new Date()

        // Only restore if saved within the last 24 hours
        if (now.getTime() - savedDate.getTime() < 24 * 60 * 60 * 1000) {
          setCurrentLetter(progress.currentLetter)
          // Restore selected continent if available
          if (progress.selectedContinent) {
            setSelectedContinent(progress.selectedContinent)
          }
          // Load progress for current letter
          const currentLetterProgress = progress.letterProgress[progress.currentLetter] || []
          setFoundCountries(new Set(currentLetterProgress))
          console.log('Progress restored:', progress)
        } else {
          // Clear old progress
          localStorage.removeItem(QUIZ_STORAGE_KEY)
          localStorage.removeItem(QUIZ_SESSION_KEY)
          console.log('Old progress cleared (expired)')
        }
      } catch (error) {
        console.error('Error loading quiz progress:', error)
        localStorage.removeItem(QUIZ_STORAGE_KEY)
        localStorage.removeItem(QUIZ_SESSION_KEY)
      }
    }

    if (savedSession) {
      try {
        const session: QuizSession = JSON.parse(savedSession)
        console.log('Session loaded:', session)
        
        // Restore selected continent if available
        if (session.selectedContinent) {
          setSelectedContinent(session.selectedContinent)
        }
        
        // Always restore the session state if it exists and is valid
        if (session.isActive) {
          setIsQuizActive(true)
          console.log('Active session restored automatically')
          
          // If there's an active session, ensure we have the latest progress
          if (savedProgress) {
            try {
              const progress: QuizProgress = JSON.parse(savedProgress)
              const currentLetterProgress = progress.letterProgress[progress.currentLetter] || []
              setFoundCountries(new Set(currentLetterProgress))
              console.log('Active session progress restored')
            } catch (error) {
              console.error('Error restoring progress for active session:', error)
            }
          }
        } else {
          console.log('Session is inactive, showing start screen')
        }
      } catch (error) {
        console.error('Error loading quiz session:', error)
        localStorage.removeItem(QUIZ_SESSION_KEY)
      }
    } else {
      console.log('No saved session found')
    }
    
    // Mark as initialized after restoration is complete
    setIsInitialized(true)
  }, [])

  // Save progress whenever currentLetter or foundCountries changes
  useEffect(() => {
    if (!isInitialized) return // Don't save during initialization
    
    console.log('Progress saving triggered - currentLetter:', currentLetter, 'foundCountries size:', foundCountries.size)
    const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY)
    let progress: QuizProgress
    if (savedProgress) {
      try {
        progress = JSON.parse(savedProgress)
        progress.letterProgress[currentLetter] = Array.from(foundCountries)
        progress.currentLetter = currentLetter
        progress.selectedContinent = selectedContinent
        progress.lastUpdated = new Date().toISOString()
        console.log('Updated existing progress:', progress)
      } catch (error) {
        progress = { currentLetter, letterProgress: { [currentLetter]: Array.from(foundCountries) }, selectedContinent, lastUpdated: new Date().toISOString() }
        console.log('Created new progress due to error:', progress)
      }
    } else {
      progress = { currentLetter, letterProgress: { [currentLetter]: Array.from(foundCountries) }, selectedContinent, lastUpdated: new Date().toISOString() }
      console.log('Created new progress:', progress)
    }
    localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(progress))
    console.log('Progress saved to localStorage')
  }, [currentLetter, foundCountries, selectedContinent, isInitialized])

  // Save session state whenever isQuizActive changes
  useEffect(() => {
    const session: QuizSession = {
      isActive: isQuizActive,
      startTime: isQuizActive ? new Date().toISOString() : null,
      totalCountriesFound: getTotalCountriesFound(),
      selectedContinent: selectedContinent // Save selected continent
    }
    localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session))
  }, [isQuizActive, selectedContinent])

  // Also save session when progress changes (in case user switches modes during active quiz)
  useEffect(() => {
    if (isQuizActive) {
      const session: QuizSession = {
        isActive: true,
        startTime: new Date().toISOString(),
        totalCountriesFound: getTotalCountriesFound(),
        selectedContinent: selectedContinent // Save selected continent
      }
      localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session))
    }
  }, [foundCountries, currentLetter, selectedContinent])

  // Prevent session from being deactivated when component unmounts (switching modes)
  useEffect(() => {
    return () => {
      // When component unmounts (switching modes), preserve the session if it was active
      if (isQuizActive) {
        console.log('Component unmounting, preserving active session...')
        const session: QuizSession = {
          isActive: true,
          startTime: new Date().toISOString(),
          totalCountriesFound: getTotalCountriesFound(),
          selectedContinent: selectedContinent // Preserve selected continent
        }
        localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session))
        console.log('Active session preserved:', session)
      }
    }
  }, [isQuizActive, selectedContinent])

  const getTotalCountriesFound = () => {
    const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (savedProgress) {
      try {
        const progress: QuizProgress = JSON.parse(savedProgress)
        return Object.values(progress.letterProgress).reduce((total, countries) => total + countries.length, 0)
      } catch (error) {
        return 0
      }
    }
    return 0
  }

  const isAllCountriesCompleted = () => {
    const totalFound = getTotalCountriesFound()
    return totalFound >= filteredCountries.length
  }

  const startQuiz = () => {
    // Force the quiz to start
    setIsQuizActive(true)
    
    // Also save the session immediately
    const session: QuizSession = {
      isActive: true,
      startTime: new Date().toISOString(),
      totalCountriesFound: getTotalCountriesFound(),
      selectedContinent: selectedContinent // Save selected continent
    }
    localStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(session))
    
    setMessage('')
    setMessageType('info')
  }

  const endQuiz = () => {
    setIsQuizActive(false)
    setShowEndScreen(true)
  }

  const restartQuiz = () => {
    setShowEndScreen(false)
    setIsQuizActive(false)
    setCurrentLetter('A')
    setFoundCountries(new Set())
    setInputValue('')
    setMessage('')
    localStorage.removeItem(QUIZ_STORAGE_KEY)
    localStorage.removeItem(QUIZ_SESSION_KEY)
  }

  const getCountriesForLetter = (letter: string) => {
    return filteredCountries.filter(country => country.letter === letter)
  }

  const currentCountries = getCountriesForLetter(currentLetter)
  const totalCountries = currentCountries.length
  const foundCount = foundCountries.size
  const remainingCountries = currentCountries.filter(country => !foundCountries.has(country.name))

  // Calculate similarity between two strings (for typo tolerance)
  const calculateSimilarity = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim()
    const s2 = str2.toLowerCase().trim()

    if (s1 === s2) return 1

    // Common abbreviations and alternative names
    const abbreviations: { [key: string]: string } = {
      'usa': 'vereinigte staaten von amerika',
      'united states': 'vereinigte staaten von amerika',
      'united states of america': 'vereinigte staaten von amerika',
      'uk': 'vereinigtes königreich',
      'united kingdom': 'vereinigtes königreich',
      'great britain': 'vereinigtes königreich',
      'england': 'vereinigtes königreich',
      'vae': 'vereinigte arabische emirate',
      'uae': 'vereinigte arabische emirate',
      'united arab emirates': 'vereinigte arabische emirate',
      'dr': 'dominikanische republik',
      'dominican republic': 'dominikanische republik',
      'czech republic': 'tschechien (tschechische republik)',
      'czech': 'tschechien (tschechische republik)',
      'russia': 'russland (russische föderation)',
      'russian federation': 'russland (russische föderation)',
      'ivory coast': 'elfenbeinküste (côte d\'ivoire)',
      'cote d\'ivoire': 'elfenbeinküste (côte d\'ivoire)',
      'east timor': 'osttimor (timor-leste)',
      'timor leste': 'osttimor (timor-leste)',
      'south sudan': 'südsudan',
      'eswatini': 'eswatini (swasiland)',
      'swaziland': 'eswatini (swasiland)',
      'north korea': 'nordkorea (korea, demokratische volksrepublik)',
      'south korea': 'südkorea (korea, republik)',
      'laos': 'laos, demokratische volksrepublik',
      'myanmar': 'myanmar',
      'burma': 'myanmar',
      'cambodia': 'kambodscha',
      'vatican': 'vatikanstadt',
      'holy see': 'vatikanstadt',
      'vatican city': 'vatikanstadt'
    }

    // Check if input matches any abbreviation
    if (abbreviations[s1] === s2) return 1

    // Normalize accents and umlauts for comparison
    const normalizeAccents = (str: string): string => {
      return str
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/ä/g, 'a')
        .replace(/ö/g, 'o')
        .replace(/ü/g, 'u')
        .replace(/ß/g, 'ss')
        .replace(/æ/g, 'ae')
        .replace(/œ/g, 'oe')
    }

    const normalizedS1 = normalizeAccents(s1)
    const normalizedS2 = normalizeAccents(s2)

    // Check if normalized versions match
    if (normalizedS1 === normalizedS2) return 1

    // Handle countries with parentheses (e.g., "Nordkorea (Korea, Demokratische Volksrepublik)")
    // Extract the main name before parentheses
    const mainNameMatch = s2.match(/^([^(]+)/)
    const mainName = mainNameMatch ? mainNameMatch[1].trim() : s2
    const normalizedMainName = normalizeAccents(mainName)
    
    // If input matches the main name (with or without accents), it's correct
    if (s1 === mainName || normalizedS1 === normalizedMainName) return 1
    
    // Handle countries with commas (e.g., "Laos, Demokratische Volksrepublik")
    // Split by comma and check if input matches the first part
    const countryParts = s2.split(',')
    const primaryName = countryParts[0].trim()
    const normalizedPrimaryName = normalizeAccents(primaryName)
    
    // If input matches the primary name (before comma), it's correct
    if (s1 === primaryName || normalizedS1 === normalizedPrimaryName) return 1
    
    // Check if input is a substring of the primary name (for partial matches)
    if (primaryName.includes(s1) && s1.length >= 3) return 0.95
    if (normalizedPrimaryName.includes(normalizedS1) && normalizedS1.length >= 3) return 0.95
    
    // Check for one character difference in the primary name
    if (Math.abs(s1.length - primaryName.length) <= 1) {
      let differences = 0
      const maxLength = Math.max(s1.length, primaryName.length)

      for (let i = 0; i < maxLength; i++) {
        if (s1[i] !== primaryName[i]) {
          differences++
          if (differences > 1) break
        }
      }
      
      if (differences <= 1) return 0.9
    }

    // Check for one character difference in the normalized primary name
    if (Math.abs(normalizedS1.length - normalizedPrimaryName.length) <= 1) {
      let differences = 0
      const maxLength = Math.max(normalizedS1.length, normalizedPrimaryName.length)

      for (let i = 0; i < maxLength; i++) {
        if (normalizedS1[i] !== normalizedPrimaryName[i]) {
          differences++
          if (differences > 1) break
        }
      }
      
      if (differences <= 1) return 0.9
    }

    // Original similarity check for the full name
    if (Math.abs(s1.length - s2.length) > 1) return 0

    let differences = 0
    const maxLength = Math.max(s1.length, s2.length)

    for (let i = 0; i < maxLength; i++) {
      if (s1[i] !== s2[i]) {
        differences++
        if (differences > 1) return 0
      }
    }

    return differences === 1 ? 0.9 : 1
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const input = inputValue.trim()

    if (!input) return

    // Check if already found
    if (foundCountries.has(input)) {
      setMessage('⚠️ Already added!')
      setMessageType('info')
      setInputValue('')
      setTimeout(() => {
        setMessage('')
      }, 2000)
      return
    }

    // Find the best match
    let bestMatch: Country | null = null
    let bestSimilarity = 0

    for (const country of remainingCountries) {
      const similarity = calculateSimilarity(input, country.name)
      if (similarity > bestSimilarity) {
        bestSimilarity = similarity
        bestMatch = country
      }
    }

    if (bestMatch && bestSimilarity >= 0.9) {
      // Correct answer
      setFoundCountries(prev => new Set([...prev, bestMatch!.name]))
      onCountryLearned(bestMatch.name)
      setMessage(`✅ Richtig! ${bestMatch.name}`)
      setMessageType('success')
      setInputValue('')

      // Check if all countries for this letter are found
      if (foundCount + 1 >= totalCountries) {
        setTimeout(() => {
          setMessage('🎉 All countries for this letter completed!')
          setMessageType('success')
        }, 1000)
      }

      // Check if all countries in the entire quiz are completed
      setTimeout(() => {
        if (isAllCountriesCompleted()) {
          setMessage('🎉🎉🎉 GLÜCKWUNSCH! Du hast ALLE Länder gefunden! 🎉🎉🎉')
          setMessageType('success')
          setTimeout(() => {
            endQuiz()
          }, 2000)
        }
      }, 1500)
    } else {
      // Incorrect answer
      setMessage('❌ Not found. Try again!')
      setMessageType('error')
      // Clear error message after 3 seconds
      setTimeout(() => {
        setMessage('')
      }, 3000)
    }
  }

  const changeLetter = (newLetter?: string) => {
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    
    if (newLetter) {
      setCurrentLetter(newLetter)
    } else {
      const currentIndex = alphabet.indexOf(currentLetter)
      const nextIndex = (currentIndex + 1) % alphabet.length
      const nextLetter = alphabet[nextIndex]

      // Find a letter that has countries
      let letterToUse = nextLetter
      let attempts = 0

      while (getCountriesForLetter(letterToUse).length === 0 && attempts < 26) {
        const nextAttemptIndex = (alphabet.indexOf(letterToUse) + 1) % 26
        letterToUse = alphabet[nextAttemptIndex]
        attempts++
      }

      setCurrentLetter(letterToUse)
    }
    
    // Load progress for the new letter
    const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (savedProgress) {
      try {
        const progress: QuizProgress = JSON.parse(savedProgress)
        const newLetterProgress = progress.letterProgress[newLetter || currentLetter] || []
        setFoundCountries(new Set(newLetterProgress))
      } catch (error) {
        setFoundCountries(new Set())
      }
    } else {
      setFoundCountries(new Set())
    }
    
    setInputValue('')
    setMessage('')
  }

  const resetCurrentLetter = () => {
    setFoundCountries(new Set())
    setInputValue('')
    setMessage('')
  }

  const resetAllProgress = () => {
    setFoundCountries(new Set())
    setCurrentLetter('A')
    setInputValue('')
    setMessage('')
    localStorage.removeItem(QUIZ_STORAGE_KEY)
    localStorage.removeItem(QUIZ_SESSION_KEY)
    setIsQuizActive(false)
  }



  useEffect(() => {
    // Focus input when component mounts or letter changes
    if (inputRef.current && isQuizActive) {
      inputRef.current.focus()
    }
  }, [currentLetter, isQuizActive])

  // Get all letters that have countries
  const availableLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(letter => 
    getCountriesForLetter(letter).length > 0
  )

  // Get progress for each letter
  const getLetterProgress = (letter: string) => {
    // For the current letter, use the current state instead of localStorage
    if (letter === currentLetter) {
      const letterCountries = getCountriesForLetter(letter)
      return { found: foundCountries.size, total: letterCountries.length }
    }
    
    // For other letters, read from localStorage
    const savedProgress = localStorage.getItem(QUIZ_STORAGE_KEY)
    if (savedProgress) {
      try {
        const progress: QuizProgress = JSON.parse(savedProgress)
        const letterCountries = getCountriesForLetter(letter)
        const foundForLetter = progress.letterProgress[letter] || []
        return { found: foundForLetter.length, total: letterCountries.length }
      } catch (error) {
        return { found: 0, total: getCountriesForLetter(letter).length }
      }
    }
    return { found: 0, total: getCountriesForLetter(letter).length }
  }

  // Show start screen if quiz is not active
  console.log('QuizMode render - isQuizActive:', isQuizActive, 'totalCountries:', totalCountries, 'foundCount:', foundCount)
  
  if (!isQuizActive) {
    const totalFound = getTotalCountriesFound()
    const hasProgress = totalFound > 0
    console.log('Showing start screen - totalFound:', totalFound, 'hasProgress:', hasProgress)

    return (
      <div className="quiz-mode">
        <div className="quiz-start-screen">
          <h2>🌍 {t('quizStartTitle')}</h2>
          <p>{t('quizStartDescription')}</p>
          
          <div className="continent-selection">
            <h3>Wähle einen Kontinent:</h3>
            <ContinentNav
              selectedContinent={selectedContinent}
              onContinentSelect={setSelectedContinent}
              countries={countries}
            />
          </div>
          
          <div className="quiz-info">
            <p>Länder für Quiz: <strong>{filteredCountries.length}</strong></p>
            {selectedContinent !== 'Alle' && (
              <p>Kontinent: <strong>{selectedContinent}</strong></p>
            )}
          </div>
          
          <div className="start-actions">
            <button 
              className="start-quiz-btn" 
              onClick={startQuiz}
              disabled={filteredCountries.length === 0}
            >
              <Play size={20} />
              {hasProgress ? 'Quiz fortsetzen' : t('startQuiz')}
            </button>
            
            {hasProgress && (
              <button className="reset-all-btn" onClick={resetAllProgress}>
                <RotateCcw size={20} />
                Neu starten
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (showEndScreen) {
    const totalFound = getTotalCountriesFound()
    const totalPossible = filteredCountries.length
    const isFullyCompleted = totalFound >= totalPossible
    
    return (
      <div className="quiz-mode">
        <div className="quiz-end-screen">
          {isFullyCompleted ? (
            <h2>🏆🎉 {t('congratulations')}! 🎉🏆</h2>
          ) : (
            <h2>🎉 {t('quizComplete')}</h2>
          )}
          
          {isFullyCompleted && (
            <div className="congratulations-message">
              <h3>Du hast ALLE {totalPossible} Länder gefunden!</h3>
              <p>Großartige Arbeit! Du bist ein Geographie-Meister! 🌍✨</p>
            </div>
          )}
          
          <div className="quiz-stats">
            <div className="stat-item">
              <h3>Gefundene Länder</h3>
              <p className="stat-number">{totalFound}</p>
              <p className="stat-label">von {totalPossible}</p>
            </div>
            <div className="stat-item">
              <h3>Abschlussrate</h3>
              <p className="stat-number">{Math.round((totalFound / totalPossible) * 100)}%</p>
            </div>
          </div>
          
          <div className="letter-progress-summary">
            <h3>{t('letterProgress')}</h3>
            <div className="letter-grid">
              {availableLetters.map(letter => {
                const progress = getLetterProgress(letter)
                if (progress.total > 0) {
                  return (
                    <div key={letter} className="letter-stat">
                      <span className="letter">{letter}</span>
                      <span className="progress">{progress.found}/{progress.total}</span>
                      <div className="mini-progress-bar">
                        <div 
                          className="mini-progress-fill" 
                          style={{ width: `${(progress.found / progress.total) * 100}%` }}
                        />
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
          </div>
          
          <div className="end-actions">
            <button className="start-quiz-btn" onClick={restartQuiz}>
              <RotateCcw size={20} />
              Neues Quiz starten
            </button>
            <button className="browse-btn" onClick={() => window.location.reload()}>
              <Home size={20} />
              {t('backToBrowse')}
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (totalCountries === 0) {
    console.log('No countries for letter:', currentLetter)
    return (
      <div className="quiz-mode">
        <div className="quiz-complete">
          <h2>Keine Länder für den Buchstaben "{currentLetter}" gefunden</h2>
          <button className="change-letter-btn" onClick={() => changeLetter()}>
            <Target size={20} />
            {t('nextLetter')}
          </button>
        </div>
      </div>
    )
  }

  console.log('Showing active quiz for letter:', currentLetter)
  return (
    <div className="quiz-mode">
      {/* End Quiz Button */}
      <div className="quiz-controls">
        <button className="end-quiz-btn" onClick={endQuiz}>
          {t('endQuiz')}
        </button>
      </div>

      {/* Letter Navigation Bar */}
      <div className="letter-navigation">
        <h3>Buchstaben Navigation</h3>
        <div className="letter-buttons">
          {availableLetters.map(letter => {
            const progress = getLetterProgress(letter)
            const isActive = letter === currentLetter
            const isComplete = progress.found === progress.total && progress.total > 0
            
            return (
              <button
                key={letter}
                className={`letter-btn ${isActive ? 'active' : ''} ${isComplete ? 'complete' : ''}`}
                onClick={() => changeLetter(letter)}
              >
                <span className="letter">{letter}</span>
                <span className="progress">{progress.found}/{progress.total}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="quiz-header">
        <div className="letter-info">
          <div className="letter-display">
            <span className="current-letter">{currentLetter}</span>
            <div className="progress-info">
              <span className="progress-text">{foundCount} / {totalCountries}</span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${(foundCount / totalCountries) * 100}%` }}
                />
              </div>
            </div>
          </div>
          <div className="letter-actions">
            <button className="reset-btn" onClick={resetCurrentLetter}>
              <RotateCcw size={16} />
              {t('resetLetter')}
            </button>
          </div>
        </div>
      </div>

      <div className="quiz-card">
        <div className="question-section">
          <h3>Nenne Länder, die mit "{currentLetter}" beginnen</h3>
          <p className="hint-text">Tippe einen Ländernamen ein und drücke Enter. Ein Tippfehler ist erlaubt.</p>

          {foundCount === totalCountries ? (
            <div className="completion-message">
              <h3>🎉 Alle Länder für "{currentLetter}" gefunden!</h3>
              <button className="change-letter-btn" onClick={() => changeLetter()}>
                <Target size={20} />
                {t('nextLetter')}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="input-form">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={t('enterCountryName')}
                className="country-input"
                autoComplete="off"
              />
              <button type="submit" className="submit-btn">
                <Check size={20} />
              </button>
            </form>
          )}

          {message && (
            <div className={`message ${messageType}`}>
              {message}
            </div>
          )}
        </div>

        <div className="found-countries">
          <h4>{t('foundCountries')}:</h4>
          <div className="countries-list">
            {Array.from(foundCountries).map(country => (
              <span key={country} className="found-country">
                {country}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default QuizMode 
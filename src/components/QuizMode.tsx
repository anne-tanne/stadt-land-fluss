import React, { useState } from 'react'
import { useDataContext } from '../contexts/CountryContext'
import { useQuizProgress } from '../hooks/useQuizProgress'
import { useQuizLogic } from '../hooks/useQuizLogic'
import { QuizStartScreen } from './quiz/QuizStartScreen'
import { QuizControls } from './quiz/QuizControls'
import { ContinentDisplay } from './quiz/ContinentDisplay'
import { LetterNavigation } from './quiz/LetterNavigation'
import { QuizHeader } from './quiz/QuizHeader'
import { QuizInput } from './quiz/QuizInput'
import { FoundCountries } from './quiz/FoundCountries'
import { HintPopup } from './quiz/HintPopup'
import { QuizEndScreen } from './quiz/QuizEndScreen'
import styles from '../styles/Quiz.module.css'

interface QuizModeProps {
  selectedContinent: string
  onReturnToBrowse: () => void
  onItemLearned: (itemName: string) => void
}

export const QuizMode: React.FC<QuizModeProps> = ({
  onItemLearned, 
  onReturnToBrowse 
}) => {
  const { data, getFilteredData } = useDataContext()
  
  const {
    currentLetter,
    setCurrentLetter,
    foundCountries,
    selectedContinent,
    setSelectedContinent,
    isQuizActive,
    getTotalCountriesFound,
    getLetterProgress,
    getContinentProgress,
    addFoundCountry,
    resetProgress,
    saveForLater,
    startQuiz
  } = useQuizProgress(data)

  const {
    inputValue,
    setInputValue,
    message,
    messageType,
    isFading,
    currentCountries,
    totalCountries,
    foundCount,
    handleSubmit,
    changeLetter,
    // Hint popup state
    showHintPopup,
    openHintPopup,
    closeHintPopup,
    hintCountry,
    hintLevel,
    hintInputValue,
    setHintInputValue,
    handleHintInputSubmit,
    showNextLetter,
    showFullCountry,
    revealHintedCountry,
    hintedCountries,
    heavyHintedCountries,
    everHintedCountries,
    everHeavyHintedCountries
  } = useQuizLogic(currentLetter, foundCountries, addFoundCountry, onItemLearned, selectedContinent)

  const filteredData = getFilteredData(selectedContinent)
  const hasProgress = getTotalCountriesFound() > 0

  // Check if all items for the selected continent are found
  const allFoundForContinent = Array.from(foundCountries).filter(itemName => 
    filteredData.some(item => item.name === itemName)
  )
  const isContinentComplete = allFoundForContinent.length === filteredData.length && filteredData.length > 0

  const handleContinentChange = (continent: string) => {
    setSelectedContinent(continent)
  }

  const handleStartQuiz = () => {
    startQuiz()
    setShowEndScreen(false)
  }

  const handleResetProgress = () => {
    resetProgress()
  }

  const [showEndScreen, setShowEndScreen] = useState<boolean>(false)

  const handleEndQuiz = () => {
    setShowEndScreen(true)
  }

  const handleQuizComplete = () => {
    // Reset progress and return to browse mode
    resetProgress()
    setShowEndScreen(false)
    onReturnToBrowse()
  }

  const handleLetterChange = (letter: string) => {
    // Load progress for the new letter BEFORE changing currentLetter
    const savedProgress = localStorage.getItem('länder-quiz-progress')
    if (savedProgress) {
      try {
        // We need to update foundCountries for the new letter
        // This is a bit complex with the current structure
        // For now, we'll just change the letter and let the progress hook handle it
      } catch (error) {
        // Handle error
      }
    }
    setCurrentLetter(letter)
    setInputValue('')
  }

  const handleNextLetter = () => {
    const nextLetter = changeLetter()
    if (nextLetter) {
      handleLetterChange(nextLetter)
    }
  }

  const handleResetLetter = () => {
    // Clear found countries for current letter
    // This would need to be handled by the progress hook
    // For now, we'll just reset the input
    setInputValue('')
  }

  const handleSaveForLater = () => {
    saveForLater()
    onReturnToBrowse()
  }

  // Show start screen if quiz is not active
  if (!isQuizActive) {
    return (
              <QuizStartScreen
          selectedContinent={selectedContinent}
          onContinentChange={handleContinentChange}
          onStartQuiz={handleStartQuiz}
          onResetProgress={handleResetProgress}
          hasProgress={hasProgress}
          filteredCountriesCount={filteredData.length}
        />
    )
  }

  // Show end screen if all countries for the continent are found OR user wants to end quiz
  if (isContinentComplete || showEndScreen) {
    return (
      <QuizEndScreen
        selectedContinent={selectedContinent}
        totalFound={allFoundForContinent.length}
        totalCountries={filteredData.length}
        hintedCountries={everHintedCountries}
        heavyHintedCountries={everHeavyHintedCountries}
        onReturnToBrowse={handleQuizComplete}
      />
    )
  }

  // Show message if no countries for current letter
  if (totalCountries === 0) {
    return (
      <div className={styles.quizMode}>
        <div className={styles.completionMessage}>
          <h2>Keine Länder für den Buchstaben "{currentLetter}" gefunden</h2>
          <button className={styles.changeLetterBtn} onClick={handleNextLetter}>
            Nächster Buchstabe
          </button>
        </div>
      </div>
    )
  }

  // Show active quiz
  return (
    <div className={styles.quizMode}>
      <QuizControls
        onSaveForLater={handleSaveForLater}
        onEndQuiz={handleEndQuiz}
      />

              <ContinentDisplay
          selectedContinent={selectedContinent}
          filteredCountriesCount={filteredData.length}
          continentProgress={getContinentProgress()}
        />

      <LetterNavigation
        currentLetter={currentLetter}
        onLetterChange={handleLetterChange}
        getLetterProgress={getLetterProgress}
        selectedContinent={selectedContinent}
      />

      <QuizHeader
        currentLetter={currentLetter}
        foundCount={foundCount}
        totalCountries={totalCountries}
        onResetLetter={handleResetLetter}
      />

      <QuizInput
        currentLetter={currentLetter}
        inputValue={inputValue}
        onInputChange={setInputValue}
        onSubmit={handleSubmit}
        foundCount={foundCount}
        totalCountries={totalCountries}
        onNextLetter={handleNextLetter}
        onOpenHint={openHintPopup}
      />

          {message && (
        <div className={`${styles.message} ${styles[messageType]} ${isFading ? styles['fade-out'] : ''}`}>
              {message}
            </div>
          )}

      <FoundCountries
        foundCountries={foundCountries}
        currentCountries={currentCountries}
        selectedContinent={selectedContinent}
        hintedCountries={hintedCountries}
        heavyHintedCountries={heavyHintedCountries}
      />

      <HintPopup
        isOpen={showHintPopup}
        hintCountry={hintCountry}
        hintLevel={hintLevel}
        inputValue={hintInputValue}
        onInputChange={setHintInputValue}
        onSubmit={handleHintInputSubmit}
        onClose={closeHintPopup}
        onShowNextLetter={showNextLetter}
        onShowFullCountry={showFullCountry}
        onRevealCountry={revealHintedCountry}
      />
    </div>
  )
}
import { useState, useRef } from 'react'
import { useCountryContext } from '../contexts/CountryContext'
import { useTranslation } from '../translations'
import { isCountryNameValid } from '../utils/validationUtils'
import { getAvailableLetters } from '../utils/letterUtils'

export const useQuizLogic = (
  currentLetter: string,
  foundCountries: Set<string>,
  onAddFoundCountry: (countryName: string) => void,
  onCountryLearned: (countryName: string) => void,
  selectedContinent: string = 'Alle'
) => {
  const { getCountriesByLetter } = useCountryContext()
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [isFading, setIsFading] = useState<boolean>(false)
  
  // Use refs to store timer IDs so we can clear them
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentCountries = getCountriesByLetter(currentLetter, selectedContinent)
  const totalCountries = currentCountries.length
  const foundForCurrentLetter = Array.from(foundCountries).filter(countryName => 
    currentCountries.some(country => country.name === countryName)
  )
  const foundCount = foundForCurrentLetter.length
  const remainingCountries = currentCountries.filter(country => !foundCountries.has(country.name))

  const showMessage = (text: string, type: 'success' | 'error' | 'info', duration: number) => {
    // Clear any existing timers
    if (fadeTimerRef.current) {
      clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = null
    }
    if (clearTimerRef.current) {
      clearTimeout(clearTimerRef.current)
      clearTimerRef.current = null
    }
    
    setMessage(text)
    setMessageType(type)
    setIsFading(false)
    
    fadeTimerRef.current = setTimeout(() => {
      setIsFading(true)
      clearTimerRef.current = setTimeout(() => {
        setMessage('')
        setIsFading(false)
      }, 500) // Fade out duration
    }, duration - 500) // Start fade before complete removal
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return

    const input = inputValue.trim()
    setInputValue('')

    // Check if country is already found
    if (foundCountries.has(input)) {
      showMessage('Dieses Land wurde bereits gefunden!', 'error', 2000)
      return
    }

    // Find matching country
    const matchedCountry = remainingCountries.find(country => 
      isCountryNameValid(input, country)
    )

    if (matchedCountry) {
      onAddFoundCountry(matchedCountry.name)
      onCountryLearned(matchedCountry.name)
      
      // Check if this was the last country for this letter
      const newFoundCount = foundCount + 1
      if (newFoundCount === totalCountries) {
        // Don't show success message if all countries are found
        // The completion message will be shown instead
        return
      }
      
      showMessage(`✅ ${t('correctAnswer')} - ${matchedCountry.name}!`, 'success', 2000)
    } else {
      showMessage(`❌ ${t('incorrectAnswer')}. ${t('tryAgain')}`, 'error', 3000)
    }
  }

  const changeLetter = (newLetter?: string) => {
    const alphabet = getAvailableLetters()
    let targetLetter = newLetter
    
    if (!newLetter) {
      const currentIndex = alphabet.indexOf(currentLetter)
      const nextIndex = (currentIndex + 1) % alphabet.length
      const nextLetter = alphabet[nextIndex]
      let letterToUse = nextLetter
      let attempts = 0
      while (getCountriesByLetter(letterToUse, selectedContinent).length === 0 && attempts < 26) {
        const nextAttemptIndex = (alphabet.indexOf(letterToUse) + 1) % 26
        letterToUse = alphabet[nextAttemptIndex]
        attempts++
      }
      targetLetter = letterToUse
    }
    
    return targetLetter
  }

  const resetCurrentLetter = () => {
    setInputValue('')
    setMessage('')
    setIsFading(false)
    // Note: This would need to be handled by the parent component
    // as it needs to clear foundCountries for the current letter
  }

  return {
    inputValue,
    setInputValue,
    message,
    messageType,
    isFading,
    currentCountries,
    totalCountries,
    foundCount,
    remainingCountries,
    handleSubmit,
    changeLetter,
    resetCurrentLetter
  }
} 
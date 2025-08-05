import { useState, useRef } from 'react'
import { useDataContext } from '../contexts/CountryContext'
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
  const { getDataByLetter } = useDataContext()
  const { t } = useTranslation()
  const [inputValue, setInputValue] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [messageType, setMessageType] = useState<'success' | 'error' | 'info'>('info')
  const [isFading, setIsFading] = useState<boolean>(false)
  const [showHintPopup, setShowHintPopup] = useState<boolean>(false)
  const [hintCountry, setHintCountry] = useState<string>('')
  const [hintLevel, setHintLevel] = useState<number>(0)
  const [hintInputValue, setHintInputValue] = useState<string>('')
  const [hintedCountries, setHintedCountries] = useState<Set<string>>(new Set())
  const [heavyHintedCountries, setHeavyHintedCountries] = useState<Set<string>>(new Set())
  // Track all countries that have ever been hinted, regardless of popup state
  const [everHintedCountries, setEverHintedCountries] = useState<Set<string>>(new Set())
  const [everHeavyHintedCountries, setEverHeavyHintedCountries] = useState<Set<string>>(new Set())
  
  // Use refs to store timer IDs so we can clear them
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null)
  const clearTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentCountries = getDataByLetter(currentLetter, selectedContinent)
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

  const openHintPopup = () => {
    if (remainingCountries.length === 0) {
      showMessage('Keine Länder mehr zu finden!', 'info', 2000)
      return
    }

    // Pick a random remaining country
    const randomIndex = Math.floor(Math.random() * remainingCountries.length)
    const newHintCountry = remainingCountries[randomIndex].name
    setHintCountry(newHintCountry)
    setHintLevel(2) // Start with first 2 letters
    setHintInputValue('')
    setShowHintPopup(true)
    
    // Mark this country as ever hinted (light hint level)
    setEverHintedCountries(prev => new Set([...prev, newHintCountry]))
  }

  const closeHintPopup = () => {
    setShowHintPopup(false)
    setHintCountry('')
    setHintLevel(0)
    setHintInputValue('')
  }

  const showNextLetter = () => {
    if (hintLevel < hintCountry.length) {
      setHintLevel(prev => prev + 1)
      
      // If we're showing more than 2 letters, mark as heavy hint
      if (hintLevel + 1 > 2) {
        setEverHeavyHintedCountries(prev => new Set([...prev, hintCountry]))
        // Remove from light hints if it was there
        setEverHintedCountries(prev => {
          const newSet = new Set(prev)
          newSet.delete(hintCountry)
          return newSet
        })
      }
    }
  }

  const showFullCountry = () => {
    setHintLevel(hintCountry.length)
    // Mark as heavy hint when showing full country
    setEverHeavyHintedCountries(prev => new Set([...prev, hintCountry]))
    // Remove from light hints if it was there
    setEverHintedCountries(prev => {
      const newSet = new Set(prev)
      newSet.delete(hintCountry)
      return newSet
    })
  }

  const handleHintInputSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!hintInputValue.trim()) return

    const input = hintInputValue.trim()
    setHintInputValue('')

    // Check if country is already found (check against all found countries and their alternatives)
    const isAlreadyFound = Array.from(foundCountries).some(foundCountryName => {
      const foundCountry = currentCountries.find(country => country.name === foundCountryName)
      if (!foundCountry) return false
      
      // Check if input exactly matches the found country name or any of its alternatives
      const inputNormalized = input.toLowerCase().trim()
      const foundNameNormalized = foundCountry.name.toLowerCase().trim()
      
      if (inputNormalized === foundNameNormalized) {
        return true
      }
      
      if (foundCountry.alternatives) {
        for (const alternative of foundCountry.alternatives) {
          const alternativeNormalized = alternative.toLowerCase().trim()
          if (inputNormalized === alternativeNormalized) {
            return true
          }
        }
      }
      
      return false
    })

    if (isAlreadyFound) {
      showMessage('Du hast dieses Land bereits gefunden!', 'info', 2000)
      return
    }

    // Find matching country
    const matchedCountry = remainingCountries.find(country => 
      isCountryNameValid(input, country)
    )

    if (matchedCountry) {
      onAddFoundCountry(matchedCountry.name)
      onCountryLearned(matchedCountry.name)
      
      // Mark as hinted based on hint level
      if (matchedCountry.name === hintCountry) {
        if (hintLevel <= 2) {
          // Minimal hint (2 letters) - orange
          setHintedCountries(prev => new Set([...prev, matchedCountry.name]))
        } else {
          // Heavy hint (3+ letters) - red
          setHeavyHintedCountries(prev => new Set([...prev, matchedCountry.name]))
        }
      }
      
      closeHintPopup()
      
      // Check if this was the last country for this letter
      const newFoundCount = foundCount + 1
      if (newFoundCount === totalCountries) {
        return
      }
      
      showMessage(`✅ ${t('correctAnswer')} - ${matchedCountry.name}!`, 'success', 2000)
    } else {
      showMessage(`❌ ${t('incorrectAnswer')}. ${t('tryAgain')}`, 'error', 3000)
    }
  }

  const revealHintedCountry = () => {
    if (hintCountry) {
      onAddFoundCountry(hintCountry)
      onCountryLearned(hintCountry)
      setHeavyHintedCountries(prev => new Set([...prev, hintCountry]))
      setEverHeavyHintedCountries(prev => new Set([...prev, hintCountry]))
      closeHintPopup()
      showMessage(`🔴 ${hintCountry} wurde mit Tipp hinzugefügt`, 'info', 3000)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!inputValue.trim()) return

    const input = inputValue.trim()
    setInputValue('')

    // Check if country is already found (check against all found countries and their alternatives)
    const isAlreadyFound = Array.from(foundCountries).some(foundCountryName => {
      const foundCountry = currentCountries.find(country => country.name === foundCountryName)
      if (!foundCountry) return false
      
      // Check if input exactly matches the found country name or any of its alternatives
      const inputNormalized = input.toLowerCase().trim()
      const foundNameNormalized = foundCountry.name.toLowerCase().trim()
      
      if (inputNormalized === foundNameNormalized) {
        return true
      }
      
      if (foundCountry.alternatives) {
        for (const alternative of foundCountry.alternatives) {
          const alternativeNormalized = alternative.toLowerCase().trim()
          if (inputNormalized === alternativeNormalized) {
            return true
          }
        }
      }
      
      return false
    })

    if (isAlreadyFound) {
      showMessage('Du hast dieses Land bereits gefunden!', 'info', 2000)
      return
    }

    // Find matching country
    const matchedCountry = remainingCountries.find(country => 
      isCountryNameValid(input, country)
    )

    if (matchedCountry) {
      onAddFoundCountry(matchedCountry.name)
      onCountryLearned(matchedCountry.name)
      
      // Check if this country was ever hinted and mark accordingly
      if (everHeavyHintedCountries.has(matchedCountry.name)) {
        // Already marked as heavily hinted (red)
        setHeavyHintedCountries(prev => new Set([...prev, matchedCountry.name]))
      } else if (everHintedCountries.has(matchedCountry.name)) {
        // Already marked as lightly hinted (orange)
        setHintedCountries(prev => new Set([...prev, matchedCountry.name]))
      }
      
      // Check if this was the last country for this letter
      const newFoundCount = foundCount + 1
      if (newFoundCount === totalCountries) {
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
      while (getDataByLetter(letterToUse, selectedContinent).length === 0 && attempts < 26) {
        const nextAttemptIndex = (alphabet.indexOf(letterToUse) + 1) % 26
        letterToUse = alphabet[nextAttemptIndex]
        attempts++
      }
      targetLetter = letterToUse
    }
    
    // Reset hint when changing letters
    setHintLevel(0)
    setHintCountry('')
    setShowHintPopup(false)
    
    return targetLetter
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
  }
} 
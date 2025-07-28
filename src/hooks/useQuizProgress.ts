import { useState, useEffect } from 'react'
import type { Country } from '../types'
import { STORAGE_KEYS, saveToStorage, loadFromStorage, removeFromStorage, type QuizProgress, type QuizSession } from '../utils/storageUtils'

export const useQuizProgress = (countries: Country[]) => {
  const [currentLetter, setCurrentLetter] = useState<string>('A')
  const [foundCountries, setFoundCountries] = useState<Set<string>>(new Set())
  const [selectedContinent, setSelectedContinent] = useState<string>('Alle')
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false)

  // Load saved progress and session on component mount
  useEffect(() => {
    const savedProgress = loadFromStorage<QuizProgress | null>(STORAGE_KEYS.QUIZ_PROGRESS, null)
    const savedSession = loadFromStorage<QuizSession | null>(STORAGE_KEYS.QUIZ_SESSION, null)
    
    console.log('Loading quiz state...')
    console.log('Saved progress:', savedProgress)
    console.log('Saved session:', savedSession)
    
    if (savedProgress) {
      const savedDate = new Date(savedProgress.lastUpdated)
      const now = new Date()

      // Only restore if saved within the last 24 hours
      if (now.getTime() - savedDate.getTime() < 24 * 60 * 60 * 1000) {
        setCurrentLetter(savedProgress.currentLetter)
        if (savedProgress.selectedContinent) {
          setSelectedContinent(savedProgress.selectedContinent)
        }
        const currentLetterProgress = savedProgress.letterProgress[savedProgress.currentLetter] || []
        setFoundCountries(new Set(currentLetterProgress))
        console.log('Progress restored:', savedProgress)
      } else {
        // Clear old progress
        removeFromStorage(STORAGE_KEYS.QUIZ_PROGRESS)
        removeFromStorage(STORAGE_KEYS.QUIZ_SESSION)
        console.log('Old progress cleared (expired)')
      }
    }
  }, [])

  // Save progress whenever it changes
  useEffect(() => {
    if (isQuizActive) {
      const progress: QuizProgress = {
        currentLetter,
        letterProgress: getLetterProgressObject(),
        lastUpdated: new Date().toISOString(),
        selectedContinent
      }
      saveToStorage(STORAGE_KEYS.QUIZ_PROGRESS, progress)
    }
  }, [currentLetter, foundCountries, selectedContinent, isQuizActive])

  const getLetterProgressObject = () => {
    const progress: { [letter: string]: string[] } = {}
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
    
    alphabet.forEach(letter => {
      const letterCountries = countries.filter(country => country.letter === letter)
      const foundForLetter = Array.from(foundCountries).filter(countryName => 
        letterCountries.some(country => country.name === countryName)
      )
      if (foundForLetter.length > 0) {
        progress[letter] = foundForLetter
      }
    })
    
    return progress
  }

  const getTotalCountriesFound = () => {
    return foundCountries.size
  }

  const getLetterProgress = (letter: string) => {
    const letterCountries = countries.filter(country => country.letter === letter)
    const foundForLetter = Array.from(foundCountries).filter(countryName => 
      letterCountries.some(country => country.name === countryName)
    )
    return { found: foundForLetter.length, total: letterCountries.length }
  }

  const addFoundCountry = (countryName: string) => {
    setFoundCountries(prev => new Set([...prev, countryName]))
  }

  const resetProgress = () => {
    setCurrentLetter('A')
    setFoundCountries(new Set())
    setSelectedContinent('Alle')
    setIsQuizActive(false)
    removeFromStorage(STORAGE_KEYS.QUIZ_PROGRESS)
    removeFromStorage(STORAGE_KEYS.QUIZ_SESSION)
  }

  const saveForLater = () => {
    setIsQuizActive(false)
  }

  const startQuiz = () => {
    setIsQuizActive(true)
    
    const session: QuizSession = {
      isActive: true,
      startTime: new Date().toISOString(),
      totalCountriesFound: getTotalCountriesFound(),
      selectedContinent
    }
    saveToStorage(STORAGE_KEYS.QUIZ_SESSION, session)
  }

  return {
    currentLetter,
    setCurrentLetter,
    foundCountries,
    selectedContinent,
    setSelectedContinent,
    isQuizActive,
    setIsQuizActive,
    getTotalCountriesFound,
    getLetterProgress,
    addFoundCountry,
    resetProgress,
    saveForLater,
    startQuiz
  }
} 
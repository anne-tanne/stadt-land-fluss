import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Country } from '../types'
import countriesData from '../data/countries-de.json'
import { normalizeLetter } from '../utils/letterUtils'

export const useCountries = () => {
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
        nextReview: null,
        alternatives: countryData.alternatives || []
      }
    })
    setCountries(countriesWithProgress)
  }, [])

  const updateCountryProgress = useCallback((countryName: string, learned: boolean) => {
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
  }, [])

  const markCountryAsLearned = useCallback((countryName: string) => {
    updateCountryProgress(countryName, true)
  }, [updateCountryProgress])

  const getFilteredCountries = useCallback((selectedContinent: string) => {
    let filtered = countries

    // Filter by continent
    if (selectedContinent !== 'Alle') {
      if (selectedContinent === 'Amerikas') {
        filtered = filtered.filter(country => 
          country.continent === 'Nordamerika' || country.continent === 'Südamerika'
        )
      } else {
        filtered = filtered.filter(country => country.continent === selectedContinent)
      }
    }

    return filtered
  }, [countries])

  const getCountriesByLetter = useCallback((letter: string, selectedContinent: string = 'Alle') => {
    const filtered = getFilteredCountries(selectedContinent)
    return filtered.filter(country => country.letter === letter)
  }, [getFilteredCountries])

  const getAvailableContinents = useMemo(() => {
    const continents = ['Alle', 'Amerikas', ...Array.from(new Set(countries.map(country => country.continent)))]
    return continents
  }, [countries])

  return {
    countries,
    updateCountryProgress,
    markCountryAsLearned,
    getFilteredCountries,
    getCountriesByLetter,
    getAvailableContinents
  }
} 
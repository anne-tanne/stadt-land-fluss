import { useState, useEffect, useMemo, useCallback } from 'react'
import type { Country, City, DataItem } from '../types'
import countriesData from '../data/countries-de.json'
import citiesData from '../data/million-cities-de.json'
import { normalizeLetter } from '../utils/letterUtils'

export type DataMode = 'countries' | 'cities'

export const useData = (mode: DataMode = 'countries') => {
  const [data, setData] = useState<DataItem[]>([])

  useEffect(() => {
    if (mode === 'countries') {
      // Convert the JSON data to our Country format with normalized letters
      const countriesWithProgress = countriesData.map((countryData: any) => {
        const normalizedLetter = normalizeLetter(countryData.letter)
        
        return {
          name: countryData.name,
          letter: normalizedLetter,
          originalLetter: countryData.letter, // Keep original for display
          continent: countryData.continent,
          population: countryData.population,
          learned: false,
          lastReviewed: null,
          reviewCount: 0,
          nextReview: null,
          alternatives: countryData.alternatives || []
        } as Country
      })
      setData(countriesWithProgress)
    } else {
      // Convert cities data to our City format
      const citiesWithProgress: City[] = []
      
      citiesData.forEach((cityData: any) => {
        const firstChar = cityData.Stadt.charAt(0)
        const normalizedLetter = normalizeLetter(firstChar.toUpperCase())
        
        // Handle cities that span multiple continents (like Istanbul: "Asien/Europa")
        const continents = cityData.Kontinent.split('/')
        
        continents.forEach((continent: string) => {
          const trimmedContinent = continent.trim()
          citiesWithProgress.push({
            name: cityData.Stadt,
            letter: normalizedLetter,
            originalLetter: firstChar.toUpperCase(),
            continent: trimmedContinent,
            country: cityData.Land,
            population: cityData.Einwohner,
            learned: false,
            lastReviewed: null,
            reviewCount: 0,
            nextReview: null,
            alternatives: []
          } as City)
        })
      })
      
      setData(citiesWithProgress)
    }
  }, [mode])

  const updateItemProgress = useCallback((itemName: string, learned: boolean) => {
    setData(prev => prev.map(item => 
      item.name === itemName 
        ? { 
            ...item, 
            learned, 
            lastReviewed: new Date().toISOString(),
            reviewCount: item.reviewCount + 1,
            nextReview: learned ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() : null
          }
        : item
    ))
  }, [])

  const markItemAsLearned = useCallback((itemName: string) => {
    updateItemProgress(itemName, true)
  }, [updateItemProgress])

  const getFilteredData = useCallback((selectedContinent: string) => {
    let filtered = data

    // Filter by continent
    if (selectedContinent !== 'Alle') {
      if (selectedContinent === 'Amerikas') {
        filtered = filtered.filter(item => 
          item.continent === 'Nordamerika' || item.continent === 'Südamerika'
        )
      } else {
        filtered = filtered.filter(item => item.continent === selectedContinent)
      }
    }

    return filtered
  }, [data])

  const getDataByLetter = useCallback((letter: string, selectedContinent: string = 'Alle') => {
    const filtered = getFilteredData(selectedContinent)
    return filtered.filter(item => item.letter === letter)
  }, [getFilteredData])

  const getAvailableContinents = useMemo(() => {
    const continents = ['Alle', 'Amerikas', ...Array.from(new Set(data.map(item => item.continent)))]
    return continents
  }, [data])

  return {
    data,
    updateItemProgress,
    markItemAsLearned,
    getFilteredData,
    getDataByLetter,
    getAvailableContinents
  }
} 
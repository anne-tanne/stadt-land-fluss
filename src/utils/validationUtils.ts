// Country name validation and similarity utilities
import type { Country } from '../types'

// Normalize text for comparison (lowercase, remove accents, trim)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .normalize('NFD') // Decompose characters with accents
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics (accents)
    .replace(/[äöüß]/g, (match) => {
      // Handle German umlauts
      switch (match) {
        case 'ä': return 'a'
        case 'ö': return 'o'
        case 'ü': return 'u'
        case 'ß': return 'ss'
        default: return match
      }
    })
}

export const calculateSimilarity = (str1: string, str2: string): number => {
  const s1 = normalizeText(str1)
  const s2 = normalizeText(str2)

  if (s1 === s2) return 1

  // Simple Levenshtein distance calculation for typo tolerance
  const matrix: number[][] = []
  
  for (let i = 0; i <= s1.length; i++) {
    matrix[i] = [i]
  }
  
  for (let j = 0; j <= s2.length; j++) {
    matrix[0][j] = j
  }
  
  for (let i = 1; i <= s1.length; i++) {
    for (let j = 1; j <= s2.length; j++) {
      if (s1[i - 1] === s2[j - 1]) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i - 1][j] + 1,     // deletion
          matrix[i][j - 1] + 1      // insertion
        )
      }
    }
  }
  
  const distance = matrix[s1.length][s2.length]
  const maxLength = Math.max(s1.length, s2.length)
  
  return maxLength === 0 ? 1 : (maxLength - distance) / maxLength
}

export const isCountryNameValid = (
  input: string, 
  country: Country, 
  threshold: number = 0.8
): boolean => {
  const inputNormalized = normalizeText(input)
  
  // Check exact match with main name
  if (inputNormalized === normalizeText(country.name)) {
    return true
  }
  
  // Check alternatives if they exist
  if (country.alternatives) {
    for (const alternative of country.alternatives) {
      if (inputNormalized === normalizeText(alternative)) {
        return true
      }
    }
  }
  
  // Check similarity with main name
  const mainNameSimilarity = calculateSimilarity(input, country.name)
  if (mainNameSimilarity >= threshold) {
    return true
  }
  
  // Check similarity with alternatives
  if (country.alternatives) {
    for (const alternative of country.alternatives) {
      const alternativeSimilarity = calculateSimilarity(input, alternative)
      if (alternativeSimilarity >= threshold) {
        return true
      }
    }
  }
  
  return false
}

// Helper function to find country by input (for suggestions)
export const findCountryByInput = (
  input: string, 
  countries: Country[], 
  threshold: number = 0.8
): Country | null => {
  const inputNormalized = normalizeText(input)
  
  // First try exact matches
  for (const country of countries) {
    if (inputNormalized === normalizeText(country.name)) {
      return country
    }
    
    if (country.alternatives) {
      for (const alternative of country.alternatives) {
        if (inputNormalized === normalizeText(alternative)) {
          return country
        }
      }
    }
  }
  
  // Then try similarity matches
  let bestMatch: Country | null = null
  let bestSimilarity = 0
  
  for (const country of countries) {
    const mainSimilarity = calculateSimilarity(input, country.name)
    if (mainSimilarity > bestSimilarity && mainSimilarity >= threshold) {
      bestSimilarity = mainSimilarity
      bestMatch = country
    }
    
    if (country.alternatives) {
      for (const alternative of country.alternatives) {
        const alternativeSimilarity = calculateSimilarity(input, alternative)
        if (alternativeSimilarity > bestSimilarity && alternativeSimilarity >= threshold) {
          bestSimilarity = alternativeSimilarity
          bestMatch = country
        }
      }
    }
  }
  
  return bestMatch
} 
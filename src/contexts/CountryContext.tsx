import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useCountries } from '../hooks/useCountries'
import type { Country } from '../types'

interface CountryContextType {
  countries: Country[]
  updateCountryProgress: (countryName: string, learned: boolean) => void
  markCountryAsLearned: (countryName: string) => void
  getFilteredCountries: (selectedContinent: string) => Country[]
  getCountriesByLetter: (letter: string, selectedContinent?: string) => Country[]
  getAvailableContinents: () => string[]
}

const CountryContext = createContext<CountryContextType | undefined>(undefined)

export const useCountryContext = () => {
  const context = useContext(CountryContext)
  if (context === undefined) {
    throw new Error('useCountryContext must be used within a CountryProvider')
  }
  return context
}

interface CountryProviderProps {
  children: ReactNode
}

export const CountryProvider: React.FC<CountryProviderProps> = ({ children }) => {
  const countryData = useCountries()

  return (
    <CountryContext.Provider value={countryData}>
      {children}
    </CountryContext.Provider>
  )
} 
import React from 'react'
import type { Country } from '../../types'
import styles from '../../styles/Quiz.module.css'

interface FoundCountriesProps {
  foundCountries: Set<string>
  currentCountries: Country[]
}

export const FoundCountries: React.FC<FoundCountriesProps> = ({
  foundCountries,
  currentCountries
}) => {
  const foundCountriesList = currentCountries.filter(country => 
    foundCountries.has(country.name)
  )

  if (foundCountriesList.length === 0) {
    return null
  }

  return (
    <div className={styles.foundCountries}>
      <h4>{foundCountriesList.length} Länder gefunden:</h4>
      <div className={styles.countriesList}>
        {foundCountriesList.map(country => (
          <div key={country.name} className={styles.foundCountry}>
            <span className={styles.countryName}>{country.name}</span>
            <span className={styles.continentBadge}>{country.continent}</span>
          </div>
        ))}
      </div>
    </div>
  )
} 
import React from 'react'
import type { Country } from '../../types'
import styles from '../../styles/Quiz.module.css'

interface FoundCountriesProps {
  foundCountries: Set<string>
  currentCountries: Country[]
  selectedContinent: string
}

export const FoundCountries: React.FC<FoundCountriesProps> = ({
  foundCountries,
  currentCountries,
  selectedContinent
}) => {
  const foundCountriesList = currentCountries.filter(country => 
    foundCountries.has(country.name)
  )

  if (foundCountriesList.length === 0) {
    return null
  }

  // If only one continent is selected, show countries without continent titles
  if (selectedContinent !== 'Alle') {
    return (
      <div className={styles.foundCountries}>
        <h4>{foundCountriesList.length} Länder gefunden:</h4>
        <div className={styles.countriesList}>
          {foundCountriesList.map(country => (
            <div key={country.name} className={styles.foundCountry}>
              <span className={styles.countryName}>{country.name}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Group countries by continent for "Alle" view
  const countriesByContinent = foundCountriesList.reduce((acc, country) => {
    if (!acc[country.continent]) {
      acc[country.continent] = []
    }
    acc[country.continent].push(country)
    return acc
  }, {} as Record<string, Country[]>)

  return (
    <div className={styles.foundCountries}>
      <h4>{foundCountriesList.length} Länder gefunden:</h4>
      <div className={styles.continentsList}>
        {Object.entries(countriesByContinent).map(([continent, countries]) => (
          <div key={continent} className={styles.continentGroup}>
            <h5 className={styles.continentTitle}>{continent}</h5>
            <div className={styles.countriesList}>
              {countries.map(country => (
                <div key={country.name} className={styles.foundCountry}>
                  <span className={styles.countryName}>{country.name}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 
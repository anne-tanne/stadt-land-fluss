import React from 'react'
import type { Country } from '../types'
import { useTranslation } from '../translations'

interface CountryCardProps {
  country: Country
  showLetter?: boolean
  showLearnButton?: boolean
  onCountryToggle?: (countryName: string, learned: boolean) => void
}

export const CountryCard: React.FC<CountryCardProps> = React.memo(({ 
  country, 
  showLetter = true, 
  showLearnButton = true,
  onCountryToggle 
}) => {
  const handleToggle = () => {
    if (onCountryToggle) {
      onCountryToggle(country.name, !country.learned)
    }
  }

  return (
    <div className={`country-card ${country.learned ? 'learned' : ''}`}>
      <div className="country-info">
        <div className="country-details">
          <span className="continent-badge">{country.continent}</span>
          {showLetter && (
            <span className="letter-badge">
              {country.originalLetter}
            </span>
          )}
        </div>
        <h3>{country.name}</h3>
        <div className="country-stats">
          <p>Review Count: {country.reviewCount}</p>
          {country.lastReviewed && (
            <p>Last Reviewed: {new Date(country.lastReviewed).toLocaleDateString()}</p>
          )}
        </div>
      </div>
      
      {showLearnButton && onCountryToggle && (
        <button 
          className={`learn-btn ${country.learned ? 'learned' : ''}`}
          onClick={handleToggle}
        >
          {country.learned ? '✓ Gelernt' : 'Als gelernt markieren'}
        </button>
      )}
    </div>
  )
})

CountryCard.displayName = 'CountryCard' 
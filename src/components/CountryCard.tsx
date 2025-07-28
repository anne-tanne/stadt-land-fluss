import React from 'react'
import type { Country } from '../types'
import { useTranslation } from '../translations'

interface CountryCardProps {
  country: Country
  showLetter?: boolean
  showLearnButton?: boolean
  onCountryToggle?: (countryName: string, learned: boolean) => void
}

export const CountryCard: React.FC<CountryCardProps> = ({
  country,
  showLetter = true,
  showLearnButton = false,
  onCountryToggle
}) => {
  const { t } = useTranslation()

  return (
    <div className={`country-card ${country.learned ? 'learned' : ''}`}>
      <div className="country-info">
        <div className="country-details">
          <span className="continent-badge">{country.continent}</span>
          {showLetter && (
            <span className="letter-badge">{country.letter}</span>
          )}
        </div>
        <h3>{country.name}</h3>
        <div className="country-stats">
          <span className="review-count">
            {t('reviewed')}: {country.reviewCount} mal
          </span>
          {country.lastReviewed && (
            <span className="last-reviewed">
              {t('lastReviewed')}: {new Date(country.lastReviewed).toLocaleDateString('de-DE')}
            </span>
          )}
        </div>
      </div>
      {showLearnButton && onCountryToggle && (
        <div className="country-actions">
          <button
            className={`learn-btn ${country.learned ? 'learned' : ''}`}
            onClick={() => onCountryToggle(country.name, !country.learned)}
          >
            {country.learned ? '✓' : '🌍'}
            {country.learned ? t('learned') : t('markAsLearned')}
          </button>
        </div>
      )}
    </div>
  )
} 
import type { Country } from '../types'
import { Check, Globe } from 'lucide-react'
import { useTranslation } from '../translations'

interface OverallViewProps {
  countries: Country[]
  onCountryToggle: (countryName: string, learned: boolean) => void
}

const OverallView = ({ countries, onCountryToggle }: OverallViewProps) => {
  const { t } = useTranslation()
  
  // Sort countries alphabetically
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name))

  if (sortedCountries.length === 0) {
    return (
      <div className="overall-view empty">
        <p>{t('noCountriesFound')}</p>
      </div>
    )
  }

  return (
    <div className="overall-view">
      <h2>{t('allCountries')} ({sortedCountries.length})</h2>
      <div className="countries-grid">
        {sortedCountries.map(country => (
          <div 
            key={country.name} 
            className={`country-card ${country.learned ? 'learned' : ''}`}
          >
            <div className="country-info">
              <h3>{country.name}</h3>
              <div className="country-details">
                <span className="continent-badge">{country.continent}</span>
                <span className="letter-badge">{country.letter}</span>
              </div>
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
            <div className="country-actions">
              <button
                className={`learn-btn ${country.learned ? 'learned' : ''}`}
                onClick={() => onCountryToggle(country.name, !country.learned)}
              >
                {country.learned ? <Check size={20} /> : <Globe size={20} />}
                {country.learned ? t('learned') : t('markAsLearned')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverallView 
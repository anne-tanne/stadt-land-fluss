import type { Country } from '../types'
import { Check, Globe } from 'lucide-react'
import { useTranslation } from '../translations'

interface CountryListProps {
  countries: Country[]
  onCountryToggle: (countryName: string, learned: boolean) => void
}

const CountryList = ({ countries, onCountryToggle }: CountryListProps) => {
  const { t } = useTranslation()
  
  if (countries.length === 0) {
    return (
      <div className="country-list empty">
        <p>{t('noCountriesFoundForLetter')}</p>
      </div>
    )
  }

  return (
    <div className="country-list">
      <h2>{t('countriesStartingWith', { letter: countries[0]?.letter })} ({countries.length})</h2>
      <div className="countries-grid">
        {countries.map(country => (
          <div 
            key={country.name} 
            className={`country-card ${country.learned ? 'learned' : ''}`}
          >
            <div className="country-info">
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

export default CountryList 
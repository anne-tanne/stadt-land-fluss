import type { Country } from '../types'
import { Check, Globe } from 'lucide-react'

interface CountryListProps {
  countries: Country[]
  onCountryToggle: (countryName: string, learned: boolean) => void
}

const CountryList = ({ countries, onCountryToggle }: CountryListProps) => {
  if (countries.length === 0) {
    return (
      <div className="country-list empty">
        <p>No countries found for this letter.</p>
      </div>
    )
  }

  return (
    <div className="country-list">
      <h2>Countries starting with "{countries[0]?.letter}" ({countries.length})</h2>
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
                  Reviewed: {country.reviewCount} times
                </span>
                {country.lastReviewed && (
                  <span className="last-reviewed">
                    Last: {new Date(country.lastReviewed).toLocaleDateString()}
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
                {country.learned ? 'Learned' : 'Mark as Learned'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CountryList 
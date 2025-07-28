import type { Country } from '../types'
import { Check, Globe } from 'lucide-react'

interface OverallViewProps {
  countries: Country[]
  onCountryToggle: (countryName: string, learned: boolean) => void
}

const OverallView = ({ countries, onCountryToggle }: OverallViewProps) => {
  // Sort countries alphabetically
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name))

  if (sortedCountries.length === 0) {
    return (
      <div className="overall-view empty">
        <p>No countries found.</p>
      </div>
    )
  }

  return (
    <div className="overall-view">
      <h2>All Countries ({sortedCountries.length})</h2>
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

export default OverallView 
import React from 'react'
import type { DataItem } from '../types'


interface CountryCardProps {
  item: DataItem
  showLetter?: boolean
  showLearnButton?: boolean
  onItemToggle?: (itemName: string, learned: boolean) => void
}

export const CountryCard: React.FC<CountryCardProps> = React.memo(({ 
  item, 
  showLetter = true, 
  showLearnButton = true,
  onItemToggle 
}) => {
  const handleToggle = () => {
    if (onItemToggle) {
      onItemToggle(item.name, !item.learned)
    }
  }

  // Function to clean up duplicated country names and prefer umlaut versions
  const cleanCountryName = (countryName: string) => {
    // Split by space to handle duplicated names
    const parts = countryName.split(' ')
    
    // If it's just one word, return as is
    if (parts.length === 1) return countryName
    
    // If it's duplicated (same word twice), return the first one
    if (parts.length === 2 && parts[0] === parts[1]) {
      return parts[0]
    }
    
    // For longer names, look for the version with umlauts first
    const umlautVersion = parts.find(part => 
      part.includes('ä') || part.includes('ö') || part.includes('ü') || 
      part.includes('Ä') || part.includes('Ö') || part.includes('Ü')
    )
    
    if (umlautVersion) {
      return umlautVersion
    }
    
    // If no umlaut version found, return the first part
    return parts[0]
  }

  return (
    <div className={`country-card ${item.learned ? 'learned' : ''}`}>
      <div className="country-info">
        <div className="country-details">
          <span className="continent-badge">{item.continent}</span>
          {showLetter && (
            <span className="letter-badge">
              {item.originalLetter}
            </span>
          )}
        </div>
        <h3>{item.name}</h3>
        <div className="country-stats">
          {item.lastReviewed && (
            <p>Last Reviewed: {new Date(item.lastReviewed).toLocaleDateString()}</p>
          )}
          {'country' in item && (
            <p>Land: {cleanCountryName(item.country)}</p>
          )}
          {'population' in item && item.population && (
            <p>Einwohner: {item.population}</p>
          )}
        </div>
      </div>
      
      {showLearnButton && onItemToggle && (
        <button 
          className={`learn-btn ${item.learned ? 'learned' : ''}`}
          onClick={handleToggle}
        >
          {item.learned ? '✓ Gelernt' : 'Als gelernt markieren'}
        </button>
      )}
    </div>
  )
})

CountryCard.displayName = 'CountryCard' 
import React from 'react'
import styles from '../../styles/Quiz.module.css'

interface ContinentDisplayProps {
  selectedContinent: string
  filteredCountriesCount: number
}

export const ContinentDisplay: React.FC<ContinentDisplayProps> = ({
  selectedContinent,
  filteredCountriesCount
}) => {
  const getContinentDisplay = () => {
    switch (selectedContinent) {
      case 'Alle':
        return '🌍 Alle Kontinente'
      case 'Amerikas':
        return '🌎 Amerikas (Nord & Süd)'
      case 'Afrika':
        return '🌍 Afrika'
      case 'Asien':
        return '🌏 Asien'
      case 'Europa':
        return '🌍 Europa'
      case 'Nordamerika':
        return '🌎 Nordamerika'
      case 'Südamerika':
        return '🌎 Südamerika'
      case 'Ozeanien':
        return '🌏 Ozeanien'
      default:
        return selectedContinent
    }
  }

  return (
    <div className={styles.continentDisplay}>
      <span className={styles.continentBadge}>
        {getContinentDisplay()}
      </span>
      <span className={styles.continentCount}>({filteredCountriesCount} Länder)</span>
    </div>
  )
} 
import type { Country } from '../types'
import { useTranslation } from '../translations'
import { CountryCard } from './CountryCard'

interface OverallViewProps {
  countries: Country[]
  onCountryToggle?: (countryName: string, learned: boolean) => void
  selectedContinent: string
}

const OverallView = ({ countries, selectedContinent }: OverallViewProps) => {
  const { t } = useTranslation()
  
  // Sort countries alphabetically
  const sortedCountries = [...countries].sort((a, b) => a.name.localeCompare(b.name))

  // Function to get dynamic title based on selected continent
  const getTitle = () => {
    if (selectedContinent === 'Alle') {
      return `${t('allCountries')} (${sortedCountries.length})`
    }
    return `Alle Länder in ${selectedContinent} (${sortedCountries.length})`
  }

  if (sortedCountries.length === 0) {
    return (
      <div className="overall-view empty">
        <p>{t('noCountriesFound')}</p>
      </div>
    )
  }

  return (
    <div className="overall-view">
      <h2 className="white-box-title">{getTitle()}</h2>
      <div className="countries-grid">
        {sortedCountries.map(country => (
          <CountryCard
            key={country.name}
            country={country}
            showLetter={false}
            showLearnButton={false}
          />
        ))}
      </div>
    </div>
  )
}

export default OverallView 
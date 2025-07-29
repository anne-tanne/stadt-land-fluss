import type { Country } from '../types'
import { useTranslation } from '../translations'
import { CountryCard } from './CountryCard'

interface CountryListProps {
  countries: Country[]
  onCountryToggle?: (countryName: string, learned: boolean) => void
  selectedContinent?: string
}

const CountryList = ({ countries, selectedContinent }: CountryListProps) => {
  const { t } = useTranslation()
  
  const getTitle = () => {
    if (countries.length === 0) return ''
    
    const letter = countries[0]?.letter
    if (selectedContinent && selectedContinent !== 'Alle') {
      return `Länder in ${selectedContinent}, die mit "${letter}" beginnen (${countries.length})`
    }
    return `${t('countriesStartingWith', { letter })} (${countries.length})`
  }
  
  if (countries.length === 0) {
    return (
      <div className="country-list empty">
        <p>{t('noCountriesFoundForLetter')}</p>
      </div>
    )
  }

  return (
    <div className="country-list">
      <h2 className="white-box-title">{getTitle()}</h2>
      <div className="countries-grid">
        {countries.map(country => (
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

export default CountryList 
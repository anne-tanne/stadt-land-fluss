import type { Country } from '../types'
import { useTranslation } from '../translations'
import { CountryCard } from './CountryCard'

interface CountryListProps {
  countries: Country[]
  onCountryToggle?: (countryName: string, learned: boolean) => void
}

const CountryList = ({ countries }: CountryListProps) => {
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
      <h2 className="white-box-title">{t('countriesStartingWith', { letter: countries[0]?.letter })} ({countries.length})</h2>
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
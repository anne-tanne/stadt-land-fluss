import React from 'react'
import { useDataContext } from '../contexts/CountryContext'

export const DataModeSelector: React.FC = () => {
  const { dataMode, setDataMode } = useDataContext()

  return (
    <div className="data-mode-selector">
      <h3>Datenmodus:</h3>
      <div className="mode-buttons">
        <button 
          className={`mode-btn ${dataMode === 'countries' ? 'active' : ''}`}
          onClick={() => setDataMode('countries')}
          style={{
            backgroundColor: dataMode === 'countries' ? '#667eea' : 'white',
            color: dataMode === 'countries' ? 'white' : '#4a5568',
            borderColor: dataMode === 'countries' ? '#667eea' : '#e2e8f0',
            transform: dataMode === 'countries' ? 'translateY(-2px)' : 'none',
            boxShadow: dataMode === 'countries' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
          }}
        >
          🌍 Länder
        </button>
        <button 
          className={`mode-btn ${dataMode === 'cities' ? 'active' : ''}`}
          onClick={() => setDataMode('cities')}
          style={{
            backgroundColor: dataMode === 'cities' ? '#667eea' : 'white',
            color: dataMode === 'cities' ? 'white' : '#4a5568',
            borderColor: dataMode === 'cities' ? '#667eea' : '#e2e8f0',
            transform: dataMode === 'cities' ? 'translateY(-2px)' : 'none',
            boxShadow: dataMode === 'cities' ? '0 4px 12px rgba(102, 126, 234, 0.3)' : 'none'
          }}
        >
          🏙️ Städte
        </button>
      </div>
    </div>
  )
} 
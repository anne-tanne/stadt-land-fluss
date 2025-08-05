import React, { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useData, type DataMode } from '../hooks/useData'
import type { DataItem } from '../types'

interface DataContextType {
  data: DataItem[]
  dataMode: DataMode
  setDataMode: (mode: DataMode) => void
  updateItemProgress: (itemName: string, learned: boolean) => void
  markItemAsLearned: (itemName: string) => void
  getFilteredData: (selectedContinent: string) => DataItem[]
  getDataByLetter: (letter: string, selectedContinent?: string) => DataItem[]
  getAvailableContinents: string[]
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export const useDataContext = () => {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useDataContext must be used within a DataProvider')
  }
  return context
}

interface DataProviderProps {
  children: ReactNode
}

export const DataProvider: React.FC<DataProviderProps> = ({ children }) => {
  const [dataMode, setDataMode] = React.useState<DataMode>('countries')
  const dataHook = useData(dataMode)

  const contextValue: DataContextType = {
    ...dataHook,
    dataMode,
    setDataMode
  }

  return (
    <DataContext.Provider value={contextValue}>
      {children}
    </DataContext.Provider>
  )
} 
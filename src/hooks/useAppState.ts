import { useState, useCallback } from 'react'

export type AppMode = 'browse' | 'study' | 'quiz'
export type ViewMode = 'alphabetical' | 'overall'

interface AppState {
  appMode: AppMode
  viewMode: ViewMode
  selectedLetter: string
  selectedContinent: string
}

interface AppActions {
  setAppMode: (mode: AppMode) => void
  setViewMode: (mode: ViewMode) => void
  setSelectedLetter: (letter: string) => void
  setSelectedContinent: (continent: string) => void
  resetToBrowse: () => void
}

export const useAppState = (): AppState & AppActions => {
  const [appMode, setAppMode] = useState<AppMode>('browse')
  const [viewMode, setViewMode] = useState<ViewMode>('alphabetical')
  const [selectedLetter, setSelectedLetter] = useState<string>('A')
  const [selectedContinent, setSelectedContinent] = useState<string>('Alle')

  const resetToBrowse = useCallback(() => {
    setAppMode('browse')
  }, [])

  return {
    appMode,
    viewMode,
    selectedLetter,
    selectedContinent,
    setAppMode,
    setViewMode,
    setSelectedLetter,
    setSelectedContinent,
    resetToBrowse
  }
} 
export type Language = 'de' | 'en'

export interface Translations {
  // App header
  appTitle: string
  browse: string
  quizMode: string
  
  // View modes
  alphabeticalView: string
  overallView: string
  
  // Continent names
  all: string
  africa: string
  asia: string
  europe: string
  northAmerica: string
  southAmerica: string
  oceania: string
  
  // Country list
  countriesStartingWith: string
  allCountries: string
  noCountriesFound: string
  noCountriesFoundForLetter: string
  
  // Country cards
  reviewed: string
  lastReviewed: string
  markAsLearned: string
  learned: string
  
  // Quiz mode
  quizStartTitle: string
  quizStartDescription: string
  progressSummary: string
  totalCountries: string
  learnedCountries: string
  remainingCountries: string
  letterProgress: string
  startQuiz: string
  endQuiz: string
  quizComplete: string
  congratulations: string
  quizCompleteDescription: string
  backToBrowse: string
  
  // Quiz interface
  currentLetter: string
  enterCountryName: string
  submit: string
  foundCountries: string
  correctAnswer: string
  incorrectAnswer: string
  tryAgain: string
  nextLetter: string
  resetLetter: string
  resetAll: string
  
  // Study mode
  studyMode: string
  studyModeDescription: string
  studySessionComplete: string
  studySessionCompleteDescription: string
  startNewSession: string
  progress: string
  showLetter: string
  showCountry: string
  iKnewThis: string
  iDidntKnow: string
  startingLetter: string
  countryName: string
  startsWith: string
  
  // Messages
  success: string
  error: string
  info: string
}

export const translations: Record<Language, Translations> = {
  de: {
    // App header
    appTitle: 'Stadt, Land, Fluss',
    browse: 'Übersicht',
    quizMode: 'Quiz-Modus',
    
    // View modes
    alphabeticalView: 'Alphabetische Ansicht',
    overallView: 'Alle Länder',
    
    // Continent names
    all: 'Alle',
    africa: 'Afrika',
    asia: 'Asien',
    europe: 'Europa',
    northAmerica: 'Nordamerika',
    southAmerica: 'Südamerika',
    oceania: 'Ozeanien',
    
    // Country list
    countriesStartingWith: 'Länder, die mit "{letter}" beginnen',
    allCountries: 'Alle Länder',
    noCountriesFound: 'Keine Länder gefunden.',
    noCountriesFoundForLetter: 'Keine Länder für diesen Buchstaben gefunden.',
    
    // Country cards
    reviewed: 'Wiederholt',
    lastReviewed: 'Zuletzt',
    markAsLearned: 'Als gelernt markieren',
    learned: 'Gelernt',
    
    // Quiz mode
    quizStartTitle: 'Quiz-Modus',
    quizStartDescription: 'Teste dein Wissen über Länder! Finde alle Länder, die mit dem ausgewählten Buchstaben beginnen.',
    progressSummary: 'Fortschritt',
    totalCountries: 'Länder insgesamt',
    learnedCountries: 'Gelernte Länder',
    remainingCountries: 'Verbleibende Länder',
    letterProgress: 'Buchstaben-Fortschritt',
    startQuiz: 'Quiz starten',
    endQuiz: 'Quiz beenden',
    quizComplete: 'Quiz abgeschlossen!',
    congratulations: 'Herzlichen Glückwunsch!',
    quizCompleteDescription: 'Du hast alle Länder für diesen Buchstaben gefunden!',
    backToBrowse: 'Zurück zur Übersicht',
    
    // Quiz interface
    currentLetter: 'Aktueller Buchstabe',
    enterCountryName: 'Ländernamen eingeben...',
    submit: 'Eingabe',
    foundCountries: 'Gefundene Länder',
    correctAnswer: 'Richtige Antwort!',
    incorrectAnswer: 'Falsche Antwort',
    tryAgain: 'Versuche es erneut',
    nextLetter: 'Nächster Buchstabe',
    resetLetter: 'Buchstabe zurücksetzen',
    resetAll: 'Alles zurücksetzen',
    
    // Study mode
    studyMode: 'Lern-Modus - Karteikarten',
    studyModeDescription: 'Lerne Länder mit interaktiven Karteikarten',
    studySessionComplete: 'Lernsitzung abgeschlossen!',
    studySessionCompleteDescription: 'Du hast {count} Länder wiederholt.',
    startNewSession: 'Neue Sitzung starten',
    progress: 'Fortschritt',
    showLetter: 'Buchstabe anzeigen',
    showCountry: 'Land anzeigen',
    iKnewThis: 'Das wusste ich',
    iDidntKnow: 'Das wusste ich nicht',
    startingLetter: 'Anfangsbuchstabe',
    countryName: 'Ländername',
    startsWith: 'Beginnt mit',
    
    // Messages
    success: 'Erfolg',
    error: 'Fehler',
    info: 'Information'
  },
  en: {
    // App header
    appTitle: 'City, Country, River',
    browse: 'Browse',
    quizMode: 'Quiz Mode',
    
    // View modes
    alphabeticalView: 'Alphabetical View',
    overallView: 'Overall View',
    
    // Continent names
    all: 'All',
    africa: 'Africa',
    asia: 'Asia',
    europe: 'Europe',
    northAmerica: 'North America',
    southAmerica: 'South America',
    oceania: 'Oceania',
    
    // Country list
    countriesStartingWith: 'Countries starting with "{letter}"',
    allCountries: 'All Countries',
    noCountriesFound: 'No countries found.',
    noCountriesFoundForLetter: 'No countries found for this letter.',
    
    // Country cards
    reviewed: 'Reviewed',
    lastReviewed: 'Last',
    markAsLearned: 'Mark as Learned',
    learned: 'Learned',
    
    // Quiz mode
    quizStartTitle: 'Quiz Mode',
    quizStartDescription: 'Test your knowledge of countries! Find all countries that start with the selected letter.',
    progressSummary: 'Progress Summary',
    totalCountries: 'Total Countries',
    learnedCountries: 'Learned Countries',
    remainingCountries: 'Remaining Countries',
    letterProgress: 'Letter Progress',
    startQuiz: 'Start Quiz',
    endQuiz: 'End Quiz',
    quizComplete: 'Quiz Complete!',
    congratulations: 'Congratulations!',
    quizCompleteDescription: 'You found all countries for this letter!',
    backToBrowse: 'Back to Browse',
    
    // Quiz interface
    currentLetter: 'Current Letter',
    enterCountryName: 'Enter country name...',
    submit: 'Submit',
    foundCountries: 'Found Countries',
    correctAnswer: 'Correct answer!',
    incorrectAnswer: 'Incorrect answer',
    tryAgain: 'Try again',
    nextLetter: 'Next Letter',
    resetLetter: 'Reset Letter',
    resetAll: 'Reset All',
    
    // Study mode
    studyMode: 'Study Mode - Flashcards',
    studyModeDescription: 'Learn countries with interactive flashcards',
    studySessionComplete: 'Study Session Complete!',
    studySessionCompleteDescription: 'You reviewed {count} countries.',
    startNewSession: 'Start New Session',
    progress: 'Progress',
    showLetter: 'Show Letter',
    showCountry: 'Show Country',
    iKnewThis: 'I Knew This',
    iDidntKnow: 'I Did Not Know',
    startingLetter: 'Starting Letter',
    countryName: 'Country Name',
    startsWith: 'Starts with',
    
    // Messages
    success: 'Success',
    error: 'Error',
    info: 'Information'
  }
}

// Helper function to get translation with interpolation
export function t(key: keyof Translations, language: Language = 'de', params?: Record<string, string | number>): string {
  let translation = translations[language][key]
  
  if (params) {
    Object.entries(params).forEach(([param, value]) => {
      translation = translation.replace(`{${param}}`, String(value))
    })
  }
  
  return translation
}

// Hook for easy translation access
export function useTranslation(language: Language = 'de') {
  return {
    t: (key: keyof Translations, params?: Record<string, string | number>) => t(key, language, params),
    language
  }
} 
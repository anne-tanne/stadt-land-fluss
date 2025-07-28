// Letter normalization and processing utilities

export const normalizeLetter = (letter: string): string => {
  const specialChars: { [key: string]: string } = {
    'Ö': 'O',
    'Ä': 'A', 
    'Ü': 'U',
    'ö': 'o',
    'ä': 'a',
    'ü': 'u'
  }
  return specialChars[letter] || letter
}

export const normalizeAccents = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/ü/g, 'u')
    .replace(/ß/g, 's')
}

export const getAvailableLetters = (): string[] => {
  return 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
} 
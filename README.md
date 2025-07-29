# Stadt Land Fluss - Project Notes 🗺️

Personal project to stop sucking at Stadt, Land, Fluss.

## What exists

### Browse Mode
- Continent filter (dropdown)
- Overall view (all countries)
- Alphabetical view (by letter)
- Country cards with continent badges
- No "mark as learned" button (hidden)

### Quiz Mode  
- Continent selection before start
- Letter navigation (shows progress)
- Country input with validation
- Progress saving (localStorage)
- "Später fortsetzen" / "Quiz beenden" buttons
- Found countries display
- Message feedback (fade out)

### Data
- `countries-de.json` - 200+ countries with German names
- Continent mapping (Afrika, Asien, Europa, etc.)
- Letter normalization (Ä→A, Ö→O, etc.)
- Alternative names support

### Tech
- React + TypeScript
- Custom hooks (useCountries, useQuizProgress, useQuizLogic)
- Context for state management
- CSS modules + design system
- German translations

## What works
- ✅ Quiz progress saves/loads
- ✅ Continent filtering
- ✅ Letter navigation
- ✅ Country validation (typo tolerant)
- ✅ Responsive design
- ✅ Error boundaries

## What needs work
- ⚠️ Message transitions (still a bit abrupt)
- ⚠️ Performance (some memoization needed)
- ⚠️ CSS organization (too much in App.css)
- ⚠️ Mobile experience

## Ideas for later
- [ ] More countries/territories
- [ ] Statistics/analytics
- [ ] Cities/rivers mode
- [ ] Offline support
- [ ] Better animations

## Key files
- `src/hooks/useQuizProgress.ts` - Quiz state
- `src/components/QuizModeRefactored.tsx` - Main quiz
- `src/data/countries-de.json` - Country data
- `src/translations.ts` - German text

## Run locally
```bash
cd stadt-land-fluss
npm run dev
```

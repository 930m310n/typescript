# Geomelon TypeScript Client

TypeScript/JavaScript client for the [Geomelon API](https://rapidapi.com/hom3chuk/api/geomelon) — a read-only geospatial database of cities, countries, regions, and languages with multilingual support.

Available on [RapidAPI](https://rapidapi.com/hom3chuk/api/geomelon).

## Installation

```bash
npm install geomelon
```

## Requirements

- Node.js 18+ (uses native `fetch`)
- A RapidAPI key with access to the Geomelon API

## Quick start

```typescript
import { GeomelonClient } from 'geomelon';

const geo = new GeomelonClient({ apiKey: 'YOUR_RAPIDAPI_KEY' });

// Find cities near a point
const cities = await geo.cities.byCoordinatesClosest({ lat: 41.38, lon: 2.18 });
console.log(cities[0].name); // "Barcelona"

// Search cities by name with language preference
const results = await geo.cities.search({ name: 'tokyo', preferredLanguages: 'ja' });
console.log(results[0].localizedName); // "東京"
```

CommonJS:
```javascript
const { GeomelonClient } = require('geomelon');
const geo = new GeomelonClient({ apiKey: 'YOUR_RAPIDAPI_KEY' });
```

## Configuration

```typescript
const geo = new GeomelonClient({
  apiKey: 'YOUR_RAPIDAPI_KEY', // required
  host: 'geomelon.p.rapidapi.com', // optional, override for custom gateway
});
```

## API reference

### Cities

```typescript
// Search with filters and pagination
geo.cities.search({
  name: 'paris',          // prefix search (also matches translations)
  countryCode: 'FR',      // ISO 3166-1 alpha-2, case-insensitive
  regionId: 'uuid',
  minPopulation: 100000,
  maxPopulation: 5000000,
  sort: 'population_desc', // population_desc | population_asc | name_asc | name_desc
  preferredLanguages: 'fr,en', // comma-separated, priority order
  limit: 20,
  offset: 0,
})

// Get city by ID
geo.cities.get('964512d1-f150-4876-87ec-0ba47aef694a')

// All translations for a city
geo.cities.translations('964512d1-f150-4876-87ec-0ba47aef694a')

// Settlement types (city, municipality, etc.)
geo.cities.settlementTypes('964512d1-f150-4876-87ec-0ba47aef694a')

// Distance between two cities
geo.cities.distance('uuid-city1', 'uuid-city2') // → { distanceKm: 504.7 }

// Nearest cities to a coordinate
geo.cities.byCoordinatesClosest({ lat: 41.38, lon: 2.18, preferredLanguages: 'en' })

// Most populated cities near a coordinate
geo.cities.byCoordinatesLargest({ lat: 41.38, lon: 2.18, preferredLanguages: 'en' })
```

### Countries

```typescript
// List countries (optionally filter by telephone code)
geo.countries.list({ limit: 200, offset: 0, telephoneCode: '+34' })

// Get country by ID (includes embedded translations and regions)
geo.countries.get('a1e06cc1-817c-429f-84f4-6ab51dac9bfa')

// Translations for a country
geo.countries.translations('uuid', { preferredLanguages: 'fr,de' })

// Regions within a country
geo.countries.regions('uuid')
```

### Regions

```typescript
// List regions, optionally filtered by country
geo.regions.list({ countryId: 'uuid' })

// Get region by ID (includes nested country)
geo.regions.get('dde1e1c6-ca22-48e6-8ad7-f97b141c1929')

// Translations for a region
geo.regions.translations('uuid', { preferredLanguages: 'ca,fr' })
```

### Languages

```typescript
// List languages sorted by city coverage
geo.languages.list({ limit: 50, offset: 0 })

// Get language by ID
geo.languages.get('08cb6cd7-7c3e-4058-a34a-405052db63ec')
```

## Response types

All types are exported for use in TypeScript projects:

```typescript
import type {
  CityDto,
  CountryDto,
  CountryExtendedDto,
  RegionDto,
  RegionExtendedDto,
  LanguageDto,
  DistanceDto,
  SearchCitiesParams,
  // ... all param and response types
} from 'geomelon';
```

## Error handling

The client throws an `Error` for non-2xx responses with the HTTP status code and body in the message:

```typescript
try {
  const city = await geo.cities.get('non-existent-id');
} catch (err) {
  // Error: Geomelon API error 404: {"message":"City non-existent-id not found"}
}
```

## Build

```bash
npm install
npm run build       # outputs dist/cjs/ and dist/esm/
```

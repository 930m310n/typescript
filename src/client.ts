import type {
  ByCoordinatesParams,
  CityDto,
  CityTranslationDto,
  CountryDto,
  CountryExtendedDto,
  CountryTranslationDto,
  DistanceDto,
  LanguageDto,
  ListCountriesParams,
  ListLanguagesParams,
  ListRegionsParams,
  RegionDto,
  RegionExtendedDto,
  RegionTranslationDto,
  SearchCitiesParams,
  SettlementTypeDto,
  TranslationsParams,
} from './types.js';

export interface GeomelonClientConfig {
  apiKey: string;
  host?: string;
}

const DEFAULT_HOST = 'geomelon.p.rapidapi.com';

function buildUrl(
  host: string,
  path: string,
  params?: Record<string, string | number | boolean | undefined>,
): string {
  const url = new URL(`https://${host}${path}`);
  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined) {
        url.searchParams.set(key, String(value));
      }
    }
  }
  return url.toString();
}

type Params = Record<string, string | number | boolean | undefined>;

async function request<T>(
  host: string,
  apiKey: string,
  path: string,
  params?: Params,
): Promise<T> {
  const url = buildUrl(host, path, params);
  const res = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      'x-rapidapi-host': host,
      'x-rapidapi-key': apiKey,
    },
  });
  if (!res.ok) {
    throw new Error(`Geomelon API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

class CitiesClient {
  constructor(private readonly host: string, private readonly apiKey: string) {}

  search(params?: SearchCitiesParams): Promise<CityDto[]> {
    return request(this.host, this.apiKey, '/cities/search', params as unknown as Params);
  }

  get(id: string): Promise<CityDto> {
    return request(this.host, this.apiKey, `/cities/${id}`);
  }

  translations(id: string): Promise<CityTranslationDto[]> {
    return request(this.host, this.apiKey, `/cities/${id}/translations`);
  }

  settlementTypes(id: string): Promise<SettlementTypeDto[]> {
    return request(this.host, this.apiKey, `/cities/${id}/settlement-types`);
  }

  distance(city1: string, city2: string): Promise<DistanceDto> {
    return request(this.host, this.apiKey, '/cities/distance', { city1, city2 });
  }

  byCoordinatesClosest(params: ByCoordinatesParams): Promise<CityDto[]> {
    return request(this.host, this.apiKey, '/cities/byCoordinates/closest', params as unknown as Params);
  }

  byCoordinatesLargest(params: ByCoordinatesParams): Promise<CityDto[]> {
    return request(this.host, this.apiKey, '/cities/byCoordinates/largest', params as unknown as Params);
  }
}

class CountriesClient {
  constructor(private readonly host: string, private readonly apiKey: string) {}

  list(params?: ListCountriesParams): Promise<CountryDto[]> {
    return request(this.host, this.apiKey, '/countries', params as unknown as Params);
  }

  get(id: string): Promise<CountryExtendedDto> {
    return request(this.host, this.apiKey, `/countries/${id}`);
  }

  translations(id: string, params?: TranslationsParams): Promise<CountryTranslationDto[]> {
    return request(this.host, this.apiKey, `/countries/${id}/translations`, params as unknown as Params);
  }

  regions(id: string): Promise<RegionDto[]> {
    return request(this.host, this.apiKey, `/countries/${id}/regions`);
  }
}

class RegionsClient {
  constructor(private readonly host: string, private readonly apiKey: string) {}

  list(params?: ListRegionsParams): Promise<RegionDto[]> {
    return request(this.host, this.apiKey, '/regions', params as unknown as Params);
  }

  get(id: string): Promise<RegionExtendedDto> {
    return request(this.host, this.apiKey, `/regions/${id}`);
  }

  translations(id: string, params?: TranslationsParams): Promise<RegionTranslationDto[]> {
    return request(this.host, this.apiKey, `/regions/${id}/translations`, params as unknown as Params);
  }
}

class LanguagesClient {
  constructor(private readonly host: string, private readonly apiKey: string) {}

  list(params?: ListLanguagesParams): Promise<LanguageDto[]> {
    return request(this.host, this.apiKey, '/languages', params as unknown as Params);
  }

  get(id: string): Promise<LanguageDto> {
    return request(this.host, this.apiKey, `/languages/${id}`);
  }
}

export class GeomelonClient {
  readonly cities: CitiesClient;
  readonly countries: CountriesClient;
  readonly regions: RegionsClient;
  readonly languages: LanguagesClient;

  constructor(config: GeomelonClientConfig) {
    const host = config.host ?? DEFAULT_HOST;
    this.cities = new CitiesClient(host, config.apiKey);
    this.countries = new CountriesClient(host, config.apiKey);
    this.regions = new RegionsClient(host, config.apiKey);
    this.languages = new LanguagesClient(host, config.apiKey);
  }
}

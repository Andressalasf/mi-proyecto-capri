// Interfaces para ubicaciones

export interface Country {
  id: string;
  name: string;
  code?: string;
  createdAt?: string;
  updatedAt?: string;
  states?: State[];
}

export interface State {
  id: string;
  name: string;
  country_id: string;
  createdAt?: string;
  updatedAt?: string;
  country?: Country;
  cities?: City[];
}

export interface City {
  id: string;
  name: string;
  state_id: string;
  createdAt?: string;
  updatedAt?: string;
  state?: State;
}

// Interfaces para respuestas de la API
export interface CountryApiResponse {
  countries: Country[];
}

export interface StateApiResponse {
  states: State[];
}

export interface CityApiResponse {
  cities: City[];
} 
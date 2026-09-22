export type PlaceType =
  | "restaurant"
  | "bakery"
  | "butcher"
  | "grocery_branch"
  | "judaica"
  | "synagogue"
  | "mikvah"
  | "school"
  | "hotel"
  | "community";

export type KashrutStatus =
  | "certified"
  | "community_report"
  | "unknown"
  | "disputed"
  | "closed";

export type FoodCategory = "meat" | "dairy" | "parve";

export type StockCategory =
  | "meat"
  | "wine"
  | "matzah"
  | "cheese"
  | "frozen"
  | "bakery";

export type Nusach =
  | "ashkenaz"
  | "sefarad"
  | "edot_hamizrach"
  | "spanish_portuguese"
  | "yemenite"
  | "chabad"
  | "other";

export type Denomination = "orthodox" | "conservative" | "other";

export type OrthodoxStream =
  | "modern"
  | "yeshivish"
  | "chabad"
  | "hasidic"
  | "sephardi"
  | "other";

export type UserRole = "member" | "local_moderator" | "agency" | "admin";

export type EditStatus = "pending" | "accepted" | "rejected";

export interface Agency {
  id: string;
  name: string;
  shortName: string;
}

export interface Place {
  id: string;
  name: string;
  nameLocal?: string;
  transliteration?: string;
  type: PlaceType;
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  countryCode: string;
  chainId?: string;
  chainName?: string;
  kashrutStatus: KashrutStatus;
  agencyId?: string;
  agencyName?: string;
  foodCategory?: FoodCategory;
  notes?: string;
  source: "seed" | "osm" | "community" | "agency";
  confirmedAt?: string;
  phone?: string;
  website?: string;
  /** Synagogue / judaica specifics */
  nusach?: Nusach;
  denomination?: Denomination;
  orthodoxStream?: OrthodoxStream;
  prayerTimes?: { shacharit?: string; mincha?: string; maariv?: string };
  /** Optional kashrut filters */
  chalavIsrael?: boolean;
  patIsrael?: boolean;
  yoshon?: boolean;
  bishulIsrael?: boolean;
  yayinMevushal?: boolean;
  glatt?: boolean;
  beitYosef?: boolean;
}

export interface StockReport {
  id: string;
  placeId: string;
  category: StockCategory;
  note: string;
  reportedAt: string;
  confirmedAt: string;
  authorName: string;
  confirmations: number;
}

export interface Community {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  population?: number;
  populationYear?: number;
  populationSource?: string;
  languages: string[];
  denominationNotes?: string;
}

export interface EditSuggestion {
  id: string;
  placeId: string;
  authorName: string;
  field: string;
  oldValue: string;
  newValue: string;
  status: EditStatus;
  createdAt: string;
  note?: string;
}

export interface ThreadMessage {
  id: string;
  threadKey: string;
  authorId: string;
  authorName: string;
  body: string;
  createdAt: string;
  reported?: boolean;
}

export interface UserProfile {
  id: string;
  displayName: string;
  email: string;
  role: UserRole;
  denomination?: Denomination;
  orthodoxStream?: OrthodoxStream;
  preferredLocale: string;
  city?: string;
  lat?: number;
  lng?: number;
  shabbatMode: boolean;
}

export interface PlaceFilters {
  query: string;
  types: PlaceType[];
  status: KashrutStatus[];
  denomination?: Denomination;
  nusach?: Nusach;
  orthodoxStream?: OrthodoxStream;
}

export type ServiceFilter = {
  id: string;
  label: string;
  aliases: string[];
};

export const SERVICE_FILTERS: ServiceFilter[] = [
  { id: "Консультация", label: "Первичная консультация", aliases: ["консультация", "осмотр"] },
  { id: "Кариес", label: "Лечение кариеса", aliases: ["кариес", "пломб"] },
  { id: "Брекеты", label: "Брекеты и элайнеры", aliases: ["брекет", "элайнер", "ортодонт"] },
  { id: "Отбеливание", label: "Отбеливание зубов", aliases: ["отбел", "zoom"] },
  { id: "Имплантация", label: "Имплантация", aliases: ["имплант"] },
  { id: "Удаление", label: "Удаление зуба", aliases: ["удалени", "хирург"] },
  { id: "Чистка", label: "Профессиональная чистка зубов", aliases: ["чистк", "гигиен"] },
  { id: "Виниры", label: "Установка виниров", aliases: ["винир"] },
];

export const CITIES = ["Алматы", "Астана", "Шымкент"] as const;

export type CatalogQuery = {
  q: string;
  city: string;
  services: string[];
};

const LEGACY_SERVICE_BY_TEXT: Record<string, string> = {
  "чистка зубов": "Чистка",
  чистка: "Чистка",
};

function normalizeText(value: string) {
  return value.trim().toLowerCase();
}

export function parseCatalogQuery(searchParams: URLSearchParams): CatalogQuery {
  const q = searchParams.get("q")?.trim() ?? "";
  const city = searchParams.get("city")?.trim() ?? "";

  const explicitServices = [
    ...searchParams.getAll("services"),
    ...(searchParams.get("services")?.split(",") ?? []),
  ]
    .map((entry) => entry.trim())
    .filter(Boolean);

  const dedupedServices = Array.from(
    new Set(explicitServices.filter((serviceId) => SERVICE_FILTERS.some((item) => item.id === serviceId))),
  );

  if (q || dedupedServices.length > 0) {
    return { q, city, services: dedupedServices };
  }

  const legacySearch = searchParams.get("search")?.trim() ?? "";
  if (!legacySearch) {
    return { q: "", city, services: [] };
  }

  const legacyNormalized = normalizeText(legacySearch);
  const legacyService =
    LEGACY_SERVICE_BY_TEXT[legacyNormalized] ??
    SERVICE_FILTERS.find(
      (service) =>
        normalizeText(service.id) === legacyNormalized ||
        service.aliases.some((alias) => legacyNormalized.includes(alias)),
    )?.id;

  if (legacyService) {
    return { q: "", city, services: [legacyService] };
  }

  return { q: legacySearch, city, services: [] };
}

export function buildCatalogSearchParams(query: CatalogQuery) {
  const params = new URLSearchParams();
  if (query.q.trim()) params.set("q", query.q.trim());
  if (query.city.trim()) params.set("city", query.city.trim());
  query.services.forEach((serviceId) => params.append("services", serviceId));
  return params;
}

export function matchServiceByFilter(serviceName: string, serviceId: string) {
  const filter = SERVICE_FILTERS.find((item) => item.id === serviceId);
  if (!filter) return false;

  const normalizedName = normalizeText(serviceName);
  return filter.aliases.some((alias) => normalizedName.includes(alias));
}

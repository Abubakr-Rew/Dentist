import { useMemo } from "react";
import { Clinic } from "../mocks/data";
import { matchServiceByFilter } from "../lib/search/catalog";

export type ClinicSummary = Clinic & { dentist_count: number };

type UseClinicsFilterArgs = {
  clinics: ClinicSummary[];
  q: string;
  city: string;
  services: string[];
};

export function useClinicsFilter({ clinics, q, city, services }: UseClinicsFilterArgs) {
  const normalizedQuery = q.trim().toLowerCase();

  return useMemo(() => {
    return clinics.filter((clinic) => {
      if (normalizedQuery && !clinic.name.toLowerCase().includes(normalizedQuery)) {
        return false;
      }

      if (city && clinic.city !== city) {
        return false;
      }

      if (services.length > 0) {
        const offersAllServices = services.every((serviceId) =>
          clinic.dentists.some((dentist) =>
            dentist.services.some((service) => matchServiceByFilter(service.name, serviceId)),
          ),
        );
        if (!offersAllServices) return false;
      }

      return true;
    });
  }, [city, clinics, normalizedQuery, services]);
}

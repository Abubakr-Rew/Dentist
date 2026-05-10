import { useMemo } from "react";
import type { ClinicSummary } from "../services/api";

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
        // If clinic has service_ids (from new Firestore schema), check if it matches all required services
        if (clinic.service_ids && clinic.service_ids.length > 0) {
          const hasRequiredServices = services.every((sId) => 
            clinic.service_ids.includes(sId)
          );
          if (!hasRequiredServices) return false;
        } else {
          // If no service_ids on summary, we can't filter effectively without fetching details
          // For now, we allow it to pass or fail based on business logic.
          // Let's assume for demo purposes that if no tags exist, it doesn't match specific service filters.
          return false;
        }
      }

      return true;
    });
  }, [city, clinics, normalizedQuery, services]);
}

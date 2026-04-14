import type { BreadcrumbItem } from "../../components/layout/Breadcrumbs";

export function getClinicBreadcrumbs(clinicName: string): BreadcrumbItem[] {
  return [
    { label: "Главная", href: "/" },
    { label: "Клиники", href: "/clinics" },
    { label: clinicName },
  ];
}

import { Link } from "react-router-dom";
import { CaretRight } from "@phosphor-icons/react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 text-sm text-slate-500">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link className="hover:text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded" to={item.href}>
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "text-slate-900 font-medium" : undefined} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && <CaretRight size={14} weight="bold" aria-hidden />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

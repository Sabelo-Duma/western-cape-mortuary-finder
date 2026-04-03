interface ServiceEntry {
  id: string;
  service_name: string;
}

export function ServiceTags({ services }: { services: ServiceEntry[] }) {
  if (!services.length) return null;

  return (
    <div className="flex flex-wrap gap-2" aria-label="Services offered">
      {services.map((service) => (
        <span
          key={service.id}
          className="inline-flex items-center rounded-full border border-gray-200 px-3 py-1 text-sm text-gray-600"
        >
          {service.service_name}
        </span>
      ))}
    </div>
  );
}

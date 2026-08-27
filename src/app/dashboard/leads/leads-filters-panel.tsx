import { Search } from "lucide-react";

import { SOURCE_OPTIONS, STATUS_OPTIONS } from "./leads-data";
import type { LeadsFilters } from "./leads-types";
import { DateInput, FieldLabel } from "./leads-ui";

export function LeadsFiltersPanel({ filters }: { filters: LeadsFilters }) {
  return (
    <form className="soft-panel-enter rounded-3xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_30px_rgba(15,23,42,.045)]">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        <SelectFilter
          label="Status"
          name="status"
          value={filters.status}
          options={STATUS_OPTIONS}
        />
        <SelectFilter
          label="Temperature"
          name="temperature"
          value={filters.temperature}
          options={temperatureOptions}
        />
        <TextFilter
          label="Country"
          name="country"
          value={filters.country}
          placeholder="France, Tunisia..."
        />
        <TextFilter
          label="Sector"
          name="sector"
          value={filters.sector}
          placeholder="SaaS, e-commerce..."
        />
        <SelectFilter
          label="Urgency"
          name="urgency"
          value={filters.urgency}
          options={urgencyOptions}
        />
        <SelectFilter
          label="CRM status"
          name="crm"
          value={filters.crm}
          options={crmOptions}
        />
        <SelectFilter
          label="Source"
          name="source"
          value={filters.source}
          options={SOURCE_OPTIONS}
        />
        <FieldLabel label="From">
          <DateInput name="from" value={filters.from} />
        </FieldLabel>
        <FieldLabel label="To">
          <DateInput name="to" value={filters.to} />
        </FieldLabel>
        <FieldLabel label="Search name, email, company...">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa3]" />
            <input
              name="q"
              defaultValue={filters.query}
              placeholder="Search name, email, company..."
              className="h-11 w-full rounded-md border border-[#dedee4] bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
            />
          </div>
        </FieldLabel>
        <div className="flex items-end">
          <button
            type="submit"
            className="h-11 w-full rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            Apply filters
          </button>
        </div>
      </div>
    </form>
  );
}

function SelectFilter({
  label,
  name,
  value,
  options,
}: {
  label: string;
  name: string;
  value: string;
  options: ReadonlyArray<{ label: string; value: string }>;
}) {
  return (
    <FieldLabel label={label}>
      <select
        name={name}
        defaultValue={value}
        className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm font-medium text-[#4f4f59] outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
      >
        {options.map((option) => (
          <option key={option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FieldLabel>
  );
}

function TextFilter({
  label,
  name,
  value,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  placeholder: string;
}) {
  return (
    <FieldLabel label={label}>
      <input
        name={name}
        defaultValue={value}
        placeholder={placeholder}
        className="h-11 w-full rounded-md border border-[#dedee4] bg-white px-3 text-sm outline-none"
      />
    </FieldLabel>
  );
}

const temperatureOptions = [
  { label: "All", value: "" },
  { label: "Hot", value: "hot" },
  { label: "Warm", value: "warm" },
  { label: "Cold", value: "cold" },
];

const urgencyOptions = [
  { label: "All", value: "" },
  { label: "High", value: "high" },
  { label: "Medium", value: "medium" },
  { label: "Low", value: "low" },
];

const crmOptions = [
  { label: "All", value: "" },
  { label: "Not sent", value: "not_sent" },
  { label: "Pending", value: "pending" },
  { label: "Sent", value: "sent" },
  { label: "Failed", value: "failed" },
];

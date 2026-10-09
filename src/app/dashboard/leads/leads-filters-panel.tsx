import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";

import { SOURCE_OPTIONS, STATUS_OPTIONS } from "./leads-data";
import type { LeadsFilters } from "./leads-types";
import { DateInput, FieldLabel } from "./leads-ui";

export function LeadsFiltersPanel({ filters, sort = "newest", pageSize = 25 }: { filters: LeadsFilters; sort?: string; pageSize?: number }) {
  return (
    <form className="soft-panel-enter -mb-3 min-w-0 rounded-2xl border border-slate-200/80 bg-white px-4 py-3">
      <input type="hidden" name="pageSize" value={pageSize} />
      <div className="mb-3 flex flex-wrap gap-2" role="group" aria-label="Follow-up filter">
        {[{ value: "", label: "Toutes les relances" }, { value: "none", label: "Sans relance" }, { value: "overdue", label: "Relance en retard" }].map(item => (
          <label key={item.value} className="cursor-pointer">
            <input className="peer sr-only" type="radio" name="followUp" value={item.value} defaultChecked={(filters.followUp || "") === item.value} />
            <span className="block rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-500 peer-checked:border-indigo-200 peer-checked:bg-indigo-50 peer-checked:text-indigo-700 peer-focus-visible:ring-2 peer-focus-visible:ring-indigo-400">{item.label}</span>
          </label>
        ))}
      </div>
      <div className="grid items-end gap-3 sm:grid-cols-2 xl:grid-cols-[minmax(0,1fr)_auto_auto_auto]">
        <label className="block min-w-0">
          <span className="sr-only">Search name, email, company</span>
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9a9aa3]" />
            <input
              name="q"
              defaultValue={filters.query}
              placeholder="Search name, email, company..."
              className="h-10 min-w-0 w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
            />
          </div>
        </label>

        <select name="sort" aria-label="Sort leads" defaultValue={sort} className="h-10 min-w-0 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-600">
          <option value="newest">Newest first</option><option value="oldest">Oldest first</option><option value="score">Highest score</option>
        </select>
        <button type="submit" className="h-10 rounded-lg bg-[#5964d6] px-4 text-sm font-medium text-white hover:bg-[#4f5acb]">Apply</button>
        <Link href="/dashboard/leads" className="px-2 py-2 text-center text-xs font-medium text-slate-500 hover:text-indigo-600">Reset filters</Link>
      </div>
      <details className="mt-1" open={Object.entries(filters).some(([key, value]) => key !== "query" && Boolean(value))}>
        <summary className="w-fit cursor-pointer rounded-lg px-2 py-2 text-xs font-medium text-slate-600 focus-visible:outline-2 focus-visible:outline-indigo-500">
          <span className="inline-flex items-center gap-2"><SlidersHorizontal className="size-3.5" />Advanced filters</span>
        </summary>
      <div className="mt-3 grid gap-3 border-t border-slate-100 pt-3 sm:grid-cols-2 lg:grid-cols-3">
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
        <div className="flex items-end">
          <button
            type="submit"
            className="h-10 min-w-0 w-full rounded-lg bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            Apply filters
          </button>
        </div>
      </div>
      </details>
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
        className="h-10 min-w-0 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-[#4f4f59] outline-none focus:border-[#85858f] focus:ring-2 focus:ring-[#171717]/10"
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
        className="h-10 min-w-0 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none"
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

import { Loader2, Search } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { KnowledgeFilterField } from "./knowledge-ui";

export type KnowledgeSearchResult = {
  id: string;
  content: string;
  similarity: number;
  title: string | null;
};

type KnowledgeSearchTesterProps = {
  query: string;
  results: KnowledgeSearchResult[];
  testing: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
};

export function KnowledgeSearchTester({
  query,
  results,
  testing,
  onQueryChange,
  onSearch,
}: KnowledgeSearchTesterProps) {
  return (
    <section className="mt-6 rounded-3xl border border-[#e1e4f8] bg-[#f8f8ff] p-5">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end">
        <KnowledgeFilterField label="Test indexed knowledge">
          <div className="relative lg:min-w-[560px]">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") onSearch();
              }}
              placeholder="Example: What plans and prices are available?"
              className="h-11 rounded-xl border-[#d9dcf1] bg-white pl-10"
            />
          </div>
        </KnowledgeFilterField>
        <Button
          onClick={onSearch}
          disabled={!query.trim() || testing}
          className="h-11 rounded-xl bg-[#5964d6] px-6 text-white hover:bg-[#4f5acb]"
        >
          {testing ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Search className="size-4" />
          )}
          Test search
        </Button>
      </div>
      {results.length > 0 ? (
        <div className="mt-4 grid gap-3 lg:grid-cols-3">
          {results.map((result) => (
            <article
              key={result.id}
              className="rounded-2xl border border-[#e1e4f8] bg-white p-4"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {result.title ?? "Knowledge document"}
                </p>
                <Badge className="bg-[#f1f2ff] text-[#5964d6] hover:bg-[#f1f2ff]">
                  {Math.round(result.similarity * 100)}%
                </Badge>
              </div>
              <p className="mt-3 line-clamp-5 text-xs leading-5 text-slate-600">
                {result.content}
              </p>
            </article>
          ))}
        </div>
      ) : null}
    </section>
  );
}

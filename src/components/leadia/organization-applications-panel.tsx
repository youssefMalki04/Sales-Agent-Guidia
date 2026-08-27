import { AppWindow, MoreHorizontal, Plus } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import type { ApplicationRecord } from "./organization-data";

export function ApplicationsPanel({
  application,
  onCreate,
  onDelete,
  onDetails,
  onSettings,
  onToggleActive,
}: {
  application: ApplicationRecord | null;
  onCreate: () => void;
  onDelete: () => void;
  onDetails: () => void;
  onSettings: () => void;
  onToggleActive: () => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold tracking-[-.02em] text-[#343849]">
            Workspace applications
          </h2>
          <p className="mt-1 text-xs text-[#858a9a]">
            Public applications connected to this organization.
          </p>
        </div>
        <span className="rounded-full bg-[#f2f3f8] px-3 py-1.5 text-[10px] font-bold text-[#757a8c]">
          {application ? "1" : "0"} / 5 used
        </span>
      </div>

      <div className="overflow-hidden rounded-[20px] border border-[#e4e6ee] bg-white shadow-[0_12px_40px_rgba(44,48,75,.045)]">
        {application ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] text-left text-sm">
              <thead className="border-b border-[#eceef3] bg-[#fafafd] text-[10px] uppercase tracking-[.1em] text-[#8c91a1]">
                <tr>
                  <th className="px-5 py-4 font-semibold">Name</th>
                  <th className="px-5 py-4 font-semibold">Slug</th>
                  <th className="px-5 py-4 font-semibold">Status</th>
                  <th className="px-5 py-4 font-semibold">Created</th>
                  <th className="px-5 py-4 font-semibold">Public URL</th>
                  <th className="px-5 py-4 font-semibold">Allowed domains</th>
                  <th className="px-5 py-4 text-right font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[#eeeeef] last:border-0 hover:bg-[#fcfcfe]">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <AppWindow className="size-4" />
                      </span>
                      <span className="font-semibold text-[#3b3f50]">
                        {application.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.slug}
                  </td>
                  <td className="px-5 py-4">
                    <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 text-[10px] font-bold uppercase text-emerald-700 hover:bg-emerald-50">
                      {application.active ? "Active" : "Disabled"}
                    </Badge>
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.createdAt}
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.publicUrl}
                  </td>
                  <td className="px-5 py-4 text-[#777782]">
                    {application.allowedDomains}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="icon"
                          variant="outline"
                          className="rounded-xl border-[#e1e3eb]"
                        >
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-44">
                        <DropdownMenuItem onClick={onDetails}>
                          View details
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onSettings}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={onToggleActive}>
                          Disable
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={onDelete}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex min-h-72 flex-col items-center justify-center px-6 py-12 text-center">
            <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#eef0ff] to-[#f5efff] text-[#6570d5]">
              <AppWindow className="size-6" />
            </span>
            <h3 className="mt-5 text-sm font-bold text-[#3b3f4f]">
              No application yet
            </h3>
            <p className="mt-2 max-w-sm text-xs leading-5 text-[#858a9a]">
              Create your first application to connect a website and start
              configuring the AI experience.
            </p>
            <Button
              className="mt-5 rounded-xl bg-[#5964d6] text-white shadow-sm hover:bg-[#4f5acb]"
              onClick={onCreate}
            >
              <Plus className="size-4" />
              New application
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

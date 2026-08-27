import type { FormEvent } from "react";
import { Mail, X } from "lucide-react";

export function InviteDialog({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  const input =
    "h-11 w-full rounded-xl border border-[#dfe2eb] px-3 text-sm outline-none focus:border-[#8991df] focus:ring-3 focus:ring-[#5964d6]/10";
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md rounded-[22px] border border-[#e3e5ed] bg-white p-6 shadow-2xl"
      >
        <div className="flex justify-between">
          <div>
            <span className="mb-3 flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Mail className="size-4" />
            </span>
            <h2 className="text-xl font-bold tracking-[-.025em] text-[#343849]">
              Invite team member
            </h2>
            <p className="mt-1 text-sm text-[#7d7d86]">
              Add a member and assign their workspace role.
            </p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close">
            <X className="size-5" />
          </button>
        </div>
        <label className="mt-6 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Full name
          </span>
          <input required name="name" className={input} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Email address
          </span>
          <input required type="email" name="email" className={input} />
        </label>
        <label className="mt-4 block">
          <span className="mb-2 block text-xs font-bold uppercase text-[#7d7d86]">
            Role
          </span>
          <select name="role" className={input}>
            <option value="sales">Sales</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </label>
        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-[#e0e2ea] px-4 text-sm font-semibold text-[#686d7e]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#5964d6] px-4 text-sm font-semibold text-white hover:bg-[#4f5acb]"
          >
            <Mail className="size-4" />
            Send invitation
          </button>
        </div>
      </form>
    </div>
  );
}

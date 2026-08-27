export function Counter({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-xl border border-[#e6e7eb] bg-[#fbfbfc] p-3 text-sm text-[#4d4f59]">
      <div className="text-2xl font-semibold text-[#17171a]">{value}</div>
      <div>{label}</div>
    </div>
  );
}

export function Toast({ message }: { message: string }) {
  return (
    <div className="fixed bottom-5 right-5 z-[60] rounded-full bg-[#17171a] px-4 py-2 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  );
}

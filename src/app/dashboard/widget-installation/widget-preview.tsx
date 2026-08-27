import { MessageCircle, Monitor, Smartphone } from "lucide-react";
import type { Device, Position } from "./widget-types";
import { DeviceButton } from "./widget-ui";

type WidgetPreviewProps = {
  name: string;
  welcome: string;
  color: string;
  position: Position;
  device: Device;
  onDeviceChange: (device: Device) => void;
};

export function WidgetPreview({
  name,
  welcome,
  color,
  position,
  device,
  onDeviceChange,
}: WidgetPreviewProps) {
  return (
    <div className="bg-gradient-to-br from-[#f8f9ff] to-[#f1f2ff] p-5 sm:p-7">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Live preview</h2>
          <p className="mt-1 text-xs text-slate-500">Customer website</p>
        </div>
        <div className="flex rounded-xl border border-[#e1e4f8] bg-white p-1 shadow-sm">
          <DeviceButton
            active={device === "desktop"}
            label="Desktop"
            onClick={() => onDeviceChange("desktop")}
            icon={<Monitor className="size-4" />}
          />
          <DeviceButton
            active={device === "mobile"}
            label="Mobile"
            onClick={() => onDeviceChange("mobile")}
            icon={<Smartphone className="size-4" />}
          />
        </div>
      </div>

      <div
        className={`relative mx-auto min-h-[470px] overflow-hidden rounded-2xl border border-[#e1e4f8] bg-white shadow-[0_14px_35px_rgba(15,23,42,0.08)] transition-all ${
          device === "mobile" ? "max-w-[330px]" : "max-w-none"
        }`}
      >
        <div className="flex h-14 items-center gap-2 border-b px-5">
          <span className="size-3 rounded-full bg-[#ff6b67]" />
          <span className="size-3 rounded-full bg-[#f4bd4f]" />
          <span className="size-3 rounded-full bg-[#62c554]" />
          <div className="ml-3 h-7 flex-1 rounded-md bg-[#f1f1f3]" />
        </div>
        <div className="space-y-4 p-6">
          <div className="h-7 w-2/3 rounded bg-[#e9e9ed]" />
          <div className="h-3 w-full rounded bg-[#f0f0f2]" />
          <div className="h-3 w-4/5 rounded bg-[#f0f0f2]" />
          <div className="grid grid-cols-3 gap-3 pt-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-24 rounded-lg bg-[#f4f4f6]" />
            ))}
          </div>
        </div>
        <div
          className={`absolute bottom-5 ${
            position === "bottom-right" ? "right-5" : "left-5"
          }`}
        >
          <div className="mb-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
            <div
              className="flex items-center gap-3 px-4 py-3 text-white"
              style={{ backgroundColor: color }}
            >
              <span className="flex size-8 items-center justify-center rounded-full bg-white/20">
                <MessageCircle className="size-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">{name}</p>
                <p className="text-[11px] text-white/75">Online</p>
              </div>
            </div>
            <div className="p-3">
              <p className="rounded-xl bg-slate-100 p-3 text-xs leading-5 text-slate-600">
                {welcome}
              </p>
            </div>
          </div>
          <button
            type="button"
            aria-label="Open widget preview"
            className="ml-auto flex size-13 items-center justify-center rounded-full text-white shadow-lg"
            style={{ backgroundColor: color }}
          >
            <MessageCircle className="size-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

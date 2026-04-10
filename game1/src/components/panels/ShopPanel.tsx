"use client";

export function ShopPanel() {
  return (
    <div className="p-4 space-y-3 max-h-64 overflow-y-auto">
      <h3 className="text-sm font-bold text-gray-400 uppercase">Shop</h3>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">Remove Ads — $2.99</div>
        <div className="text-xs mt-1">Coming soon</div>
      </div>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">Premium Pass — $4.99/mo</div>
        <div className="text-xs mt-1">2x earnings + exclusive content. Coming soon</div>
      </div>

      <div className="p-3 rounded-lg border border-gray-700 bg-gray-800/50 text-gray-400">
        <div className="font-medium">Boost Pack — $0.99</div>
        <div className="text-xs mt-1">Instant subscribers. Coming soon</div>
      </div>

      <p className="text-xs text-gray-500 text-center pt-2">
        Payment integration will be added when the game reaches traction.
      </p>
    </div>
  );
}

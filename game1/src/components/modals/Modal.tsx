"use client";

interface Props {
  children: React.ReactNode;
  onClose: () => void;
}

export function Modal({ children, onClose }: Props) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
    >
      <div
        className="bg-gray-800 rounded-2xl border border-gray-600 p-6 max-w-sm w-full shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

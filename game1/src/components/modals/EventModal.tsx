"use client";

import { ActiveEvent } from "@/game/useGame";
import { useState, useEffect } from "react";

interface Props {
  activeEvent: ActiveEvent;
}

export function EventModal({ activeEvent }: Props) {
  const { event } = activeEvent;
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    const update = () => setRemaining(Math.max(0, Math.floor((activeEvent.expiresAt - Date.now()) / 1000)));
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [activeEvent.expiresAt]);

  if (remaining <= 0) return null;

  const isNegative = event.effect === "subscriber_loss";

  return (
    <div
      className={`
        mx-4 px-4 py-2 rounded-lg text-sm font-medium text-center
        ${isNegative ? "bg-red-900/60 text-red-300" : "bg-green-900/60 text-green-300"}
      `}
    >
      {event.emoji} {event.title}
      {event.durationSeconds > 0 && (
        <span className="ml-2 opacity-70">({Math.floor(remaining / 60)}:{(remaining % 60).toString().padStart(2, "0")})</span>
      )}
    </div>
  );
}

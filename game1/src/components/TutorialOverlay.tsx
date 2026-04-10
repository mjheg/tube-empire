"use client";

import { TutorialStep } from "@/game/tutorial";
import { t, TextKey } from "@/game/i18n";

interface Props {
  step: TutorialStep;
  onDismiss: () => void;
}

export function TutorialOverlay({ step, onDismiss }: Props) {
  const message = t(`tutorial.${step.id}` as TextKey);

  if (step.waitFor === "click" && step.target === "click-button") {
    return (
      <div className="absolute inset-0 z-40 pointer-events-none">
        <div className="absolute bottom-44 left-0 right-0 flex justify-center pointer-events-none">
          <div className="bg-yellow-500 text-gray-900 px-4 py-3 rounded-xl text-sm font-bold text-center shadow-lg animate-bounce-slow whitespace-pre-line max-w-xs">
            {message}
            <div className="text-2xl mt-1">&#x1F447;</div>
          </div>
        </div>
      </div>
    );
  }

  const positionClass =
    step.position === "top"
      ? "items-start pt-20"
      : step.position === "bottom"
        ? "items-end pb-32"
        : "items-center";

  return (
    <div
      className={`fixed inset-0 z-50 flex justify-center bg-black/60 px-6 ${positionClass}`}
      onClick={step.waitFor === "dismiss" ? onDismiss : undefined}
    >
      <div
        className="bg-gray-800 border-2 border-yellow-500 rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-base whitespace-pre-line leading-relaxed mb-4">
          {message}
        </p>
        {step.waitFor === "dismiss" && (
          <button
            onClick={onDismiss}
            className="px-6 py-2 bg-yellow-500 text-gray-900 rounded-lg font-bold active:bg-yellow-600 transition-colors"
          >
            {t("modal.gotIt")}
          </button>
        )}
      </div>
    </div>
  );
}

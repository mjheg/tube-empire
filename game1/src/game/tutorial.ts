export interface TutorialStep {
  id: number;
  target: string; // CSS selector hint for highlighting
  message: string;
  position: "top" | "center" | "bottom";
  waitFor: "click" | "dismiss" | "auto";
}

export const TUTORIAL_STEPS: TutorialStep[] = [
  {
    id: 0,
    target: "welcome",
    message: "Welcome to YouTuber Tycoon! 🎬\nYou're starting a YouTube channel from zero.\nLet's become famous!",
    position: "center",
    waitFor: "dismiss",
  },
  {
    id: 1,
    target: "click-button",
    message: "👆 Tap this button to upload your first video!\nTap it as fast as you can!",
    position: "top",
    waitFor: "click",
  },
  {
    id: 2,
    target: "stats",
    message: "🎉 Great! See your views going up?\nEvery 1,000 views = 1 new subscriber!",
    position: "bottom",
    waitFor: "dismiss",
  },
  {
    id: 3,
    target: "click-button",
    message: "Keep tapping! Get to 100 subscribers\nto start earning money! 💰",
    position: "top",
    waitFor: "click",
  },
  {
    id: 4,
    target: "bottom-nav",
    message: "📱 Use these tabs to spend your money!\nUpgrade your camera, hire editors,\nand unlock new video categories.",
    position: "top",
    waitFor: "dismiss",
  },
  {
    id: 5,
    target: "trending",
    message: "🔥 Watch for TRENDING topics!\nMatch your category to trending\nfor 2x views!",
    position: "bottom",
    waitFor: "dismiss",
  },
  {
    id: 6,
    target: "done",
    message: "You're ready! 🚀\nKeep uploading, upgrading, and growing!\nEven when you close the app,\nyou'll keep earning views!",
    position: "center",
    waitFor: "dismiss",
  },
];

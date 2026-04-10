export type Lang = "ko" | "en";

const TEXTS = {
  // Start screen
  "start.title": { en: "YouTuber Tycoon", ko: "유튜버 타이쿤" },
  "start.subtitle": { en: "Start from zero. Build a media empire.", ko: "구독자 0명에서 미디어 제국까지." },
  "start.flow": { en: "Upload → Grow → Profit", ko: "업로드 → 성장 → 수익" },
  "start.nameLabel": { en: "Name your channel", ko: "채널 이름을 정해주세요" },
  "start.namePlaceholder": { en: "e.g. MyAwesomeChannel", ko: "예: 나의멋진채널" },
  "start.button": { en: "Start Creating!", ko: "시작하기!" },

  // Stats
  "stats.subs": { en: "subs", ko: "구독자" },
  "stats.views": { en: "views", ko: "조회수" },
  "stats.trending": { en: "Trending", ko: "트렌딩" },

  // Click button
  "click.upload": { en: "Upload Video!", ko: "영상 올리기!" },
  "click.uploading": { en: "Uploading", ko: "업로드 중" },

  // Milestone bar
  "milestone.next": { en: "Next", ko: "다음" },

  // Bottom nav
  "nav.equipment": { en: "Equipment", ko: "장비" },
  "nav.team": { en: "Team", ko: "팀" },
  "nav.channel": { en: "Channel", ko: "채널" },
  "nav.trophies": { en: "Trophies", ko: "업적" },
  "nav.shop": { en: "Shop", ko: "상점" },

  // Equipment panel
  "panel.camera": { en: "Camera", ko: "카메라" },
  "panel.studio": { en: "Studio", ko: "스튜디오" },
  "panel.owned": { en: "Owned", ko: "보유중" },

  // Team panel
  "panel.teamMembers": { en: "Team Members", ko: "팀 멤버" },
  "panel.hired": { en: "Hired", ko: "고용됨" },

  // Channel panel
  "panel.categories": { en: "Video Categories", ko: "영상 카테고리" },
  "panel.active": { en: "ACTIVE", ko: "활성" },

  // Shop
  "shop.title": { en: "Shop", ko: "상점" },
  "shop.comingSoon": { en: "Coming soon", ko: "준비중" },
  "shop.removeAds": { en: "Remove Ads", ko: "광고 제거" },
  "shop.premiumPass": { en: "Premium Pass", ko: "프리미엄 패스" },
  "shop.premiumDesc": { en: "2x earnings + exclusive content. Coming soon", ko: "수익 2배 + 특별 콘텐츠. 준비중" },
  "shop.boostPack": { en: "Boost Pack", ko: "부스트 팩" },
  "shop.boostDesc": { en: "Instant subscribers. Coming soon", ko: "즉시 구독자 획득. 준비중" },
  "shop.footer": { en: "Payment integration will be added when the game reaches traction.", ko: "결제 기능은 게임이 성장하면 추가됩니다." },

  // Achievements
  "achievements.title": { en: "Achievements", ko: "업적" },
  "achievements.locked": { en: "Keep playing to unlock", ko: "계속 플레이해서 해금하세요" },

  // Modals
  "modal.welcomeBack": { en: "Welcome Back!", ko: "돌아오셨군요!" },
  "modal.whileAway": { en: "While you were away", ko: "부재 중" },
  "modal.collect": { en: "Collect!", ko: "수령!" },
  "modal.awesome": { en: "Awesome!", ko: "대박!" },
  "modal.nice": { en: "Nice!", ko: "좋아요!" },
  "modal.gotIt": { en: "Got it!", ko: "알겠어요!" },
  "modal.achievementUnlocked": { en: "Achievement Unlocked!", ko: "업적 달성!" },
  "modal.dailyReward": { en: "Daily Reward!", ko: "일일 보상!" },
  "modal.dayStreak": { en: "day streak", ko: "일 연속" },
  "modal.claim": { en: "Claim!", ko: "받기!" },
  "modal.prestige": { en: "New Channel (Prestige)?", ko: "새 채널로 환생?" },
  "modal.prestigeDesc": { en: "Start over with permanent bonuses. All progress will be reset, but you will grow much faster.", ko: "영구 보너스를 받고 처음부터 시작합니다. 모든 진행이 초기화되지만 훨씬 빠르게 성장합니다." },
  "modal.notYet": { en: "Not Yet", ko: "아직" },
  "modal.prestigeBtn": { en: "Prestige!", ko: "환생!" },

  // Settings
  "settings.title": { en: "Settings", ko: "설정" },
  "settings.channel": { en: "Channel", ko: "채널" },
  "settings.prestige": { en: "Prestige", ko: "환생" },
  "settings.totalClicks": { en: "Total Clicks", ko: "총 클릭수" },
  "settings.playTime": { en: "Play Time", ko: "플레이 시간" },
  "settings.share": { en: "Share Progress", ko: "진행 상황 공유" },
  "settings.newChannel": { en: "New Channel (Prestige)", ko: "새 채널 (환생)" },
  "settings.reset": { en: "Reset All Data", ko: "데이터 초기화" },
  "settings.resetConfirm": { en: "Are you sure? This will delete ALL your progress!", ko: "정말요? 모든 진행이 삭제됩니다!" },
  "settings.close": { en: "Close", ko: "닫기" },

  // Share
  "share.text": { en: 'My channel "{name}" just hit {subs} subscribers in YouTuber Tycoon! Can you beat me?', ko: '유튜버 타이쿤에서 "{name}" 채널 구독자 {subs}명 달성! 나를 이길 수 있어?' },
  "share.copied": { en: "Copied to clipboard!", ko: "클립보드에 복사됨!" },

  // Tutorial
  "tutorial.0": { en: "Welcome to YouTuber Tycoon!\nYou're starting a YouTube channel from zero.\nLet's become famous!", ko: "유튜버 타이쿤에 오신 걸 환영합니다!\n구독자 0명에서 시작합니다.\n유명해져 봅시다!" },
  "tutorial.1": { en: "Tap this button to upload your first video!\nTap it as fast as you can!", ko: "이 버튼을 눌러 첫 영상을 올리세요!\n빠르게 연타하세요!" },
  "tutorial.2": { en: "Great! See your views going up?\nEvery 100 views = 1 new subscriber!", ko: "잘했어요! 조회수가 올라가죠?\n조회수 100 = 구독자 1명!" },
  "tutorial.3": { en: "Keep tapping! Get to 100 subscribers\nto start earning money!", ko: "계속 누르세요! 구독자 100명이 되면\n돈을 벌기 시작해요!" },
  "tutorial.4": { en: "Use these tabs to spend your money!\nUpgrade your camera, hire editors,\nand unlock new video categories.", ko: "이 탭들로 돈을 쓸 수 있어요!\n카메라 업그레이드, 편집자 고용,\n새 카테고리를 해금하세요." },
  "tutorial.5": { en: "Watch for TRENDING topics!\nMatch your category to trending\nfor 2x views!", ko: "트렌딩 주제를 확인하세요!\n카테고리를 트렌딩에 맞추면\n조회수 2배!" },
  "tutorial.6": { en: "You're ready!\nKeep uploading, upgrading, and growing!\nEven when you close the app,\nyou'll keep earning views!", ko: "준비 완료!\n영상 올리고, 업그레이드하고, 성장하세요!\n앱을 닫아도\n조회수가 계속 쌓여요!" },

  // Comments (keeping English since they're "YouTube comments")
  "comments.waiting": { en: "Waiting for comments...", ko: "댓글을 기다리는 중..." },
} as const;

export type TextKey = keyof typeof TEXTS;

let currentLang: Lang = "en";

export function setLang(lang: Lang) {
  currentLang = lang;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem("yt-tycoon-lang", lang);
  }
}

export function getLang(): Lang {
  return currentLang;
}

export function loadLang(): Lang | null {
  if (typeof localStorage === "undefined") return null;
  const saved = localStorage.getItem("yt-tycoon-lang");
  if (saved === "ko" || saved === "en") {
    currentLang = saved;
    return saved;
  }
  return null;
}

export function t(key: TextKey, params?: Record<string, string>): string {
  const entry = TEXTS[key];
  let text: string = entry[currentLang] ?? entry.en;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      text = text.replace(`{${k}}`, v);
    }
  }
  return text;
}

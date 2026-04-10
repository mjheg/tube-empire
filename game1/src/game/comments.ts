import { getLang } from "./i18n";

interface CommentPool {
  maxSubscribers: number;
  en: string[];
  ko: string[];
}

const COMMENT_POOLS: CommentPool[] = [
  {
    maxSubscribers: 100,
    en: [
      "First comment!",
      "Nice video",
      "Keep it up!",
      "Subscribed!",
      "Great content",
      "How do you edit?",
      "Love this",
      "More please!",
      "Found this channel randomly",
      "Underrated creator",
    ],
    ko: [
      "첫 댓글!",
      "영상 좋아요",
      "화이팅!",
      "구독했어요!",
      "컨텐츠 좋다",
      "편집 어떻게 해요?",
      "좋아요 눌렀어요",
      "더 올려주세요!",
      "우연히 발견했는데 대박",
      "저평가 채널이다",
    ],
  },
  {
    maxSubscribers: 10_000,
    en: [
      "This channel is growing fast",
      "Been here since 100 subs!",
      "The quality is insane",
      "Notification squad!",
      "Who's watching in 2026?",
      "Better than TV honestly",
      "Daily viewer here",
      "Your editing got so much better",
      "Collab with someone!",
      "lol this is so funny",
      "subscribed!",
      "I shared this with everyone",
    ],
    ko: [
      "이 채널 성장 빠르다",
      "구독자 100명 때부터 봤는데!",
      "퀄리티 미쳤다",
      "알림 설정 완료!",
      "2026년에 보는 사람?",
      "솔직히 TV보다 나음",
      "매일 보러 옵니다",
      "편집 실력 진짜 늘었다",
      "콜라보 해주세요!",
      "ㅋㅋㅋ 진짜 웃기네",
      "구독 박았습니다",
      "주변에 다 공유했어요",
    ],
  },
  {
    maxSubscribers: 1_000_000,
    en: [
      "LEGEND",
      "You deserve 10M subs",
      "Watching this for the 5th time",
      "This is peak content",
      "The algorithm brought me here",
      "Bro fell off (jk still goated)",
      "Make this a series PLEASE",
      "I literally can't stop watching",
      "Your old videos were better tbh",
      "Drop the merch already",
      "Video quality is insane",
      "Real",
    ],
    ko: [
      "레전드",
      "1000만 구독자 가즈아",
      "이거 5번째 보는 중",
      "이게 진짜 컨텐츠지",
      "알고리즘 타고 왔어요",
      "요즘 좀 떨어진듯 (ㅈㄱㄴ 아직 갓)",
      "시리즈로 만들어주세요 제발",
      "못 멈추겠다 진짜",
      "옛날 영상이 더 좋았는데",
      "굿즈 언제 나와요",
      "영상 퀄리티 미쳤다",
      "리얼",
    ],
  },
  {
    maxSubscribers: Infinity,
    en: [
      "WE LOVE YOU",
      "10M LET'S GOOO",
      "Been here since day one",
      "Greatest creator of all time",
      "This deserves an award",
      "You changed my life honestly",
      "The GOAT",
      "History is being made",
      "I'm crying rn",
      "GOAT GOAT GOAT",
      "Legend of YouTube",
      "King of YouTube",
    ],
    ko: [
      "사랑합니다!!",
      "1000만 가자!!",
      "1일차부터 봤는데 ㅠㅠ",
      "역대 최고 크리에이터",
      "이건 상 받아야 됨",
      "솔직히 인생 바뀌었어요",
      "갓 중의 갓",
      "역사가 만들어지고 있다",
      "울고 있어 지금",
      "전설이다 진짜",
      "유튜브의 전설",
      "유튜브 킹 ㅋㅋ",
    ],
  },
];

const HATER_COMMENTS = {
  en: [
    "Overrated...",
    "Mid content",
    "I don't get the hype",
    "Unsubscribed",
    "Clickbait...",
    "You sold out",
    "Boring",
    "Not funny",
  ],
  ko: [
    "과대평가...",
    "그냥 그런데",
    "뭐가 좋은건지 모르겠음",
    "구독 취소함",
    "어그로 ㅡㅡ",
    "변했다 진짜",
    "지루해",
    "웃기지도 않음",
  ],
};

export function generateComment(subscribers: number): string {
  const lang = getLang();

  // 10% hater, 15% foreign language (opposite of current lang)
  if (Math.random() < 0.1) {
    const haters = HATER_COMMENTS[lang];
    return haters[Math.floor(Math.random() * haters.length)];
  }

  const pool = COMMENT_POOLS.find((p) => subscribers < p.maxSubscribers) ?? COMMENT_POOLS[COMMENT_POOLS.length - 1];

  // 15% chance to show comment in the other language
  const useLang = Math.random() < 0.15 ? (lang === "ko" ? "en" : "ko") : lang;
  const comments = pool[useLang];
  return comments[Math.floor(Math.random() * comments.length)];
}

export function getCommentInterval(subscribers: number): number {
  if (subscribers < 100) return 5000;
  if (subscribers < 1_000) return 3000;
  if (subscribers < 10_000) return 2000;
  if (subscribers < 100_000) return 1000;
  if (subscribers < 1_000_000) return 500;
  return 200;
}

interface CommentPool {
  maxSubscribers: number;
  comments: string[];
}

const COMMENT_POOLS: CommentPool[] = [
  {
    maxSubscribers: 100,
    comments: [
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
  },
  {
    maxSubscribers: 10_000,
    comments: [
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
  },
  {
    maxSubscribers: 1_000_000,
    comments: [
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
  },
  {
    maxSubscribers: Infinity,
    comments: [
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
  },
];

const HATER_COMMENTS = [
  "Overrated...",
  "Mid content",
  "I don't get the hype",
  "Unsubscribed",
  "Clickbait...",
  "You sold out",
  "Boring",
  "Not funny",
];

export function generateComment(subscribers: number): string {
  if (Math.random() < 0.1) {
    return HATER_COMMENTS[Math.floor(Math.random() * HATER_COMMENTS.length)];
  }

  const pool = COMMENT_POOLS.find((p) => subscribers < p.maxSubscribers) ?? COMMENT_POOLS[COMMENT_POOLS.length - 1];
  return pool.comments[Math.floor(Math.random() * pool.comments.length)];
}

export function getCommentInterval(subscribers: number): number {
  if (subscribers < 100) return 5000;
  if (subscribers < 1_000) return 3000;
  if (subscribers < 10_000) return 2000;
  if (subscribers < 100_000) return 1000;
  if (subscribers < 1_000_000) return 500;
  return 200;
}

const TITLES_BY_CATEGORY: Record<number, string[]> = {
  0: [ // Vlog
    "A Day in My Life",
    "Room Tour 2026",
    "What I Eat in a Day",
    "Morning Routine",
    "Shopping Haul",
    "Moving to a New Place",
    "Weekend Vlog",
    "Get Ready With Me",
    "My Honest Review",
    "Things I Wish I Knew",
  ],
  1: [ // Gaming
    "This Game is INSANE",
    "I Can't Stop Playing This",
    "Speedrun World Record?!",
    "First Time Playing...",
    "The Hardest Boss Ever",
    "I Broke the Game",
    "Pro vs Noob Challenge",
    "This Update Changes Everything",
    "Gaming Setup Tour",
    "Rage Quit Compilation",
  ],
  2: [ // Mukbang
    "Giant Pizza Challenge",
    "Trying Street Food",
    "Spicy Noodle Challenge",
    "Eating Everything on the Menu",
    "Cooking for the First Time",
    "24 Hour Food Challenge",
    "Rating Fast Food",
    "Homemade vs Restaurant",
    "Extreme Spicy Wings",
    "Midnight Snack Mukbang",
  ],
  3: [ // Shorts
    "Wait for it...",
    "POV: You're famous",
    "This took 0.5 seconds",
    "Life hack you NEED",
    "Nobody expected this",
    "The ending though",
    "How is this real",
    "Tell me without telling me",
    "Only real ones know",
    "Main character moment",
  ],
  4: [ // Music
    "I wrote a song in 24 hours",
    "Singing in public reaction",
    "Cover that went VIRAL",
    "Making a beat from scratch",
    "Street performance gone wrong",
    "My first original song",
    "Remix that broke the internet",
    "Vocal coach reacts",
    "One take challenge",
    "Unreleased track preview",
  ],
  5: [ // Education
    "You're Doing It Wrong",
    "Everything Explained in 10 Min",
    "The Science Behind...",
    "Why Nobody Talks About This",
    "Study Tips That Actually Work",
    "Mind-Blowing Facts",
    "How to Learn Anything Fast",
    "The Truth About...",
    "Things School Didn't Teach You",
    "Explaining Like You're 5",
  ],
};

let videoNumber = 1;

export function generateVideoTitle(categoryId: number): string {
  const titles = TITLES_BY_CATEGORY[categoryId] ?? TITLES_BY_CATEGORY[0];
  const title = titles[Math.floor(Math.random() * titles.length)];
  const num = videoNumber++;
  return `#${num} ${title}`;
}

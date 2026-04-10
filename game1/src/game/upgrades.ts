export interface UpgradeDef {
  id: string;
  name: string;
  description: string;
  cost: number;
  effect: string;
}

export const EQUIPMENT: UpgradeDef[] = [
  { id: "equip-0", name: "Phone Camera", description: "Basic phone recording", cost: 0, effect: "1x views per click" },
  { id: "equip-1", name: "Webcam", description: "Better quality uploads", cost: 500, effect: "3x views per click" },
  { id: "equip-2", name: "DSLR", description: "Professional video quality", cost: 50_000, effect: "10x views per click" },
  { id: "equip-3", name: "Cinema Camera", description: "Hollywood-tier production", cost: 5_000_000, effect: "50x views per click" },
];

export const EQUIPMENT_MULTIPLIERS = [1, 3, 10, 50];

export const SPACES: UpgradeDef[] = [
  { id: "space-0", name: "My Room", description: "Filming in your bedroom", cost: 0, effect: "Starting space" },
  { id: "space-1", name: "Small Studio", description: "A proper desk setup", cost: 2_000, effect: "+50% all views" },
  { id: "space-2", name: "Office", description: "A real workspace", cost: 200_000, effect: "+150% all views" },
  { id: "space-3", name: "Big Studio", description: "Full production facility", cost: 20_000_000, effect: "+400% all views" },
];

export const SPACE_MULTIPLIERS = [1, 1.5, 2.5, 5];

export interface TeamMemberDef {
  id: "editor" | "thumbnail" | "manager" | "pd";
  name: string;
  description: string;
  cost: number;
  vps: number;
  unlockSubscribers: number;
}

export const TEAM: TeamMemberDef[] = [
  { id: "editor", name: "Editor", description: "Auto-edits your videos", cost: 10_000, vps: 5, unlockSubscribers: 100_000 },
  { id: "thumbnail", name: "Thumbnail Designer", description: "Click-worthy thumbnails", cost: 100_000, vps: 20, unlockSubscribers: 100_000 },
  { id: "manager", name: "Manager", description: "Handles brand deals", cost: 1_000_000, vps: 100, unlockSubscribers: 1_000_000 },
  { id: "pd", name: "PD", description: "Full content pipeline", cost: 10_000_000, vps: 500, unlockSubscribers: 1_000_000 },
];

export type TopicId = string;
export type StudentId = string;
export type GroupId = string;

export interface Topic {
    id: TopicId;
    title: string;
    color: string; // Hex code or Tailwind class helper
    materialUrl?: string;
    materialDescription?: string;
}

export interface Student {
    id: StudentId;
    name: string;
    assignedTopicId?: TopicId;
}

export type GroupType = 'HOME' | 'EXPERT';

export interface Group {
    id: GroupId;
    type: GroupType;
    topicId?: TopicId; // Only for Expert groups
    studentIds: StudentId[];
    name?: string; // "Stammgruppe 1" or "Expertengruppe A"
}

export type AppPhase = 'SETUP' | 'HOME_GROUPS' | 'EXPERT_GROUPS' | 'TEACHING';

// Color palette options for topics
export const TOPIC_COLORS = [
    '#ef4444', // red-500
    '#f97316', // orange-500
    '#eab308', // yellow-500
    '#22c55e', // green-500
    '#06b6d4', // cyan-500
    '#3b82f6', // blue-500
    '#a855f7', // purple-500
    '#ec4899', // pink-500
];

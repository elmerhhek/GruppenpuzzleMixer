import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { type AppPhase, type Group, type Student, type Topic, type TopicId, type StudentId, TOPIC_COLORS } from '../types';

interface JigsawStore {
    mainTopic: string;
    topics: Topic[];
    students: Student[];
    groups: Group[];
    homeGroupsSnapshot: Group[];
    currentPhase: AppPhase;
    timerDuration: number;
    teachingDuration: number;

    setMainTopic: (topic: string) => void;
    setTimerDuration: (seconds: number) => void;
    setTeachingDuration: (seconds: number) => void;
    addTopic: (title: string) => void;
    updateTopic: (id: TopicId, updates: Partial<Topic>) => void;
    removeTopic: (id: TopicId) => void;

    addStudent: (name: string) => void;
    removeStudent: (id: StudentId) => void;
    importStudents: (names: string[]) => void;

    generateGroups: () => void;
    setPhase: (phase: AppPhase) => void;
    reset: () => void;
}

export const useJigsawStore = create<JigsawStore>((set, get) => ({
    mainTopic: '',
    topics: [],
    students: [],
    groups: [],
    homeGroupsSnapshot: [],
    currentPhase: 'SETUP',
    timerDuration: 900, // 15 minutes default
    teachingDuration: 600, // 10 minutes default

    setMainTopic: (topic) => set({ mainTopic: topic }),
    setTimerDuration: (duration) => set({ timerDuration: duration }),
    setTeachingDuration: (duration) => set({ teachingDuration: duration }),

    addTopic: (title) => set((state) => {
        const colorIndex = state.topics.length % TOPIC_COLORS.length;
        const newTopic: Topic = {
            id: uuidv4(),
            title,
            color: TOPIC_COLORS[colorIndex],
        };
        return { topics: [...state.topics, newTopic] };
    }),

    updateTopic: (id, updates) => set((state) => ({
        topics: state.topics.map(t => t.id === id ? { ...t, ...updates } : t)
    })),

    removeTopic: (id) => set((state) => ({
        topics: state.topics.filter(t => t.id !== id),
        // Also remove assignment from students if they had this topic? 
        // For now simple removal.
    })),

    addStudent: (name) => set((state) => ({
        students: [...state.students, { id: uuidv4(), name }]
    })),

    removeStudent: (id) => set((state) => ({
        students: state.students.filter(s => s.id !== id)
    })),

    importStudents: (names) => set((state) => {
        const newStudents = names.map(name => ({ id: uuidv4(), name }));
        return { students: [...state.students, ...newStudents] };
    }),

    generateGroups: () => {
        const { students, topics } = get();
        if (topics.length === 0 || students.length === 0) return;

        // 1. Assign Expert Topics to Students (try to balance numbers)
        // Simple round-robin assignment for now to ensure implementation
        // We shuffle students first to make it random
        const shuffledStudents = [...students].sort(() => Math.random() - 0.5);
        const studentsWithTopics = shuffledStudents.map((student, index) => {
            const topicIndex = index % topics.length;
            return { ...student, assignedTopicId: topics[topicIndex].id };
        });

        // 2. Create Home Groups
        // Better Algorithm:
        // We want full groups of size N (N = topics.length).
        // If we have remainders, we merge them into existing groups rather than creating a small leftover group.
        // Formula: numGroups = Math.floor(students.length / topics.length).
        // If result is 0 (students < topics), we default to 1 group.

        let numHomeGroups = Math.floor(students.length / topics.length);
        if (numHomeGroups < 1) numHomeGroups = 1;

        // Create empty groups
        const homeGroups: Group[] = Array.from({ length: numHomeGroups }, (_, i) => ({
            id: uuidv4(),
            type: 'HOME',
            name: `Stammgruppe ${i + 1}`,
            studentIds: []
        }));

        // Distribute students into home groups to maximize topic diversity
        // We can group by assigned topic effectively
        const studentsByTopic: Record<string, Student[]> = {};
        topics.forEach(t => studentsByTopic[t.id] = []);
        studentsWithTopics.forEach(s => {
            if (s.assignedTopicId) studentsByTopic[s.assignedTopicId].push(s);
        });

        // Fill groups: We want each group to have [A, B, C, D] ideally.
        // So we iterate through groups, and for each group, we pick one from each topic bucket.

        // We will loop as long as we have students to distribute
        // Strategy: iterate through topic buckets and deal 1 card to current group

        // Create topic keys list
        const topicIds = topics.map(t => t.id);

        // While there might be students left...
        // Actually, simpler:
        // Iterate groups 0..N
        // For each group, loop through topics 0..M
        // Pop student from topic bucket -> Group

        for (let g = 0; g < numHomeGroups; g++) {
            topicIds.forEach(tId => {
                const student = studentsByTopic[tId].pop();
                if (student) {
                    homeGroups[g].studentIds.push(student.id);
                }
            });
        }

        // Handle any remainders (excess students in buckets)
        // Just distribute them round robin to groups that have space or just valid groups
        topicIds.forEach(tId => {
            while (studentsByTopic[tId].length > 0) {
                const student = studentsByTopic[tId].pop();
                if (student) {
                    // Find group with least members? Or just next group
                    // Simple round robin from 0
                    const targetGroup = homeGroups.reduce((prev, curr) => prev.studentIds.length <= curr.studentIds.length ? prev : curr);
                    targetGroup.studentIds.push(student.id);
                }
            }
        });

        set({
            students: studentsWithTopics,
            groups: homeGroups,
            homeGroupsSnapshot: homeGroups,
            currentPhase: 'HOME_GROUPS'
        });
    },

    setPhase: (phase) => {
        const { students, topics, currentPhase } = get();

        // If switching TO Expert Groups, we need to regroup
        if (phase === 'EXPERT_GROUPS' && currentPhase !== 'EXPERT_GROUPS') {
            const expertGroups: Group[] = topics.map(topic => ({
                id: uuidv4(),
                type: 'EXPERT',
                topicId: topic.id,
                name: `Expertengruppe: ${topic.title}`,
                studentIds: students.filter(s => s.assignedTopicId === topic.id).map(s => s.id)
            }));
            set({ groups: expertGroups, currentPhase: phase });
            return;
        }

        // If switching FROM Expert Groups back to HOME (Teaching Phase)
        if (phase === 'TEACHING' && currentPhase === 'EXPERT_GROUPS') {
            const { homeGroupsSnapshot } = get();
            if (homeGroupsSnapshot.length > 0) {
                set({ groups: homeGroupsSnapshot, currentPhase: phase });
                return;
            }
        }

        set({ currentPhase: phase });
    },

    reset: () => set({
        mainTopic: '',
        topics: [],
        students: [],
        groups: [],
        currentPhase: 'SETUP'
    })

}));

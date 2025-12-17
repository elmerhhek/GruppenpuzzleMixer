import React from 'react';
import { useJigsawStore } from '../store/useJigsawStore';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { type Topic, type Student } from '../types';

export const HomeGroupView: React.FC = () => {
    const { groups, students, topics, setPhase } = useJigsawStore();

    const homeGroups = groups.filter(g => g.type === 'HOME');

    const getTopic = (topicId?: string) => topics.find(t => t.id === topicId);
    const getStudent = (studentId: string) => students.find(s => s.id === studentId);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Phase 1: Stammgruppen</h2>
                    <p className="text-slate-500">
                        Jeder Schüler hat ein Expertenthema erhalten.
                    </p>
                </div>
                <Button
                    size="lg"
                    onClick={() => setPhase('EXPERT_GROUPS')}
                    className="gap-2 shadow-xl shadow-indigo-200"
                >
                    <Play className="w-5 h-5 fill-current" />
                    In Expertengruppen wechseln
                </Button>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                {homeGroups.map((group) => (
                    <motion.div key={group.id} variants={item}>
                        <Card className="h-full border-t-4 border-t-indigo-500 overflow-hidden">
                            <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                <CardTitle>{group.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-3">
                                {group.studentIds.map(studentId => {
                                    const student = getStudent(studentId);
                                    if (!student) return null;
                                    const topic = getTopic(student.assignedTopicId);

                                    return (
                                        <div key={student.id} className="flex items-center justify-between group">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-3 h-3 rounded-full shadow-sm ring-2 ring-white"
                                                    style={{ backgroundColor: topic?.color || '#cbd5e1' }}
                                                    title={topic?.title || 'No Topic'}
                                                />
                                                <span className="font-medium text-slate-700">{student.name}</span>
                                            </div>
                                            {topic && (
                                                <span
                                                    className="text-xs px-2 py-0.5 rounded-full bg-slate-100 text-slate-500 truncate max-w-[100px]"
                                                    title={topic.title}
                                                >
                                                    {topic.title}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

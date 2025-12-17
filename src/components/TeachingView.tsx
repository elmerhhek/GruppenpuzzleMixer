import React from 'react';
import { useJigsawStore } from '../store/useJigsawStore';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
import { motion } from 'framer-motion';
import { CheckCircle2, RotateCcw } from 'lucide-react';
import { Timer } from './Timer';

export const TeachingView: React.FC = () => {
    const { groups, students, topics, reset, teachingDuration } = useJigsawStore();

    // In Teaching Phase, 'groups' should be restored to HOME groups (snapshot)
    const homeGroups = groups.filter(g => g.type === 'HOME');

    const getTopic = (topicId?: string) => topics.find(t => t.id === topicId);
    const getStudent = (studentId: string) => students.find(s => s.id === studentId);

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const item = {
        hidden: { y: 20, opacity: 0 },
        show: { y: 0, opacity: 1 }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-emerald-50 border border-emerald-100 p-6 rounded-2xl">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-emerald-900">Phase 3: Vermittlung</h2>
                    <p className="text-emerald-700">
                        Zurück in Stammgruppen! Jetzt lehren die Experten ihr Thema den anderen.
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <Timer durationSeconds={teachingDuration} />
                    <Button
                        size="lg"
                        variant="outline"
                        onClick={() => {
                            if (window.confirm('Wollen Sie wirklich das Puzzle beenden und neu starten?')) reset();
                        }}
                        className="gap-2 border-emerald-200 text-emerald-700 hover:bg-emerald-100"
                    >
                        <RotateCcw className="w-5 h-5" />
                        Neu Starten
                    </Button>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                {homeGroups.map((group) => (
                    <motion.div key={group.id} variants={item}>
                        <Card className="h-full border-t-4 border-t-emerald-500 overflow-hidden shadow-lg shadow-emerald-50">
                            <CardHeader className="bg-white border-b border-slate-100 pb-4">
                                <CardTitle className="text-emerald-900">{group.name}</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4 space-y-4">
                                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Experten-Runde</p>
                                {group.studentIds.map(studentId => {
                                    const student = getStudent(studentId);
                                    if (!student) return null;
                                    const topic = getTopic(student.assignedTopicId);

                                    return (
                                        <div key={student.id} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white shadow-sm font-bold text-sm"
                                                    style={{ backgroundColor: topic?.color || '#cbd5e1' }}
                                                >
                                                    {topic?.title.substring(0, 1).toUpperCase() || '?'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-medium text-slate-700">{student.name}</span>
                                                    <span className="text-[10px] text-slate-400 uppercase">{topic?.title} Experte</span>
                                                </div>
                                            </div>
                                            <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                                        </div>
                                    );
                                })}
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>
        </div >
    );
};

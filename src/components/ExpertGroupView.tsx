import React from 'react';
import { useJigsawStore } from '../store/useJigsawStore';
import { Button, Card, CardHeader, CardTitle, CardContent } from './ui';
import { motion } from 'framer-motion';
import { ArrowRight, FileText } from 'lucide-react';
// import { type Topic, type Student } from '../types'; // Not used directly in Props
import { Timer } from './Timer';

export const ExpertGroupView: React.FC = () => {
    const { groups, students, topics, setPhase, timerDuration } = useJigsawStore();

    const expertGroups = groups.filter(g => g.type === 'EXPERT');

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
        hidden: { scale: 0.9, opacity: 0 },
        show: { scale: 1, opacity: 1 }
    };

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-indigo-900 text-white p-6 rounded-2xl shadow-xl">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Phase 2: Experten-Gruppen</h2>
                    <p className="text-indigo-200">
                        Erarbeitung der Themen in spezialisierten Gruppen.
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <Timer durationSeconds={timerDuration} />
                    <Button
                        size="lg"
                        variant="secondary"
                        onClick={() => setPhase('TEACHING')}
                        className="gap-2 bg-white text-indigo-900 hover:bg-indigo-50"
                    >
                        Zurück zu Stammgruppen
                        <ArrowRight className="w-5 h-5" />
                    </Button>
                </div>
            </div>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
                {expertGroups.map((group) => {
                    const topic = getTopic(group.topicId);
                    if (!topic) return null;

                    return (
                        <motion.div key={group.id} variants={item}>
                            <Card
                                className="h-full overflow-hidden border-t-8"
                                style={{ borderColor: topic.color }}
                            >
                                <CardHeader className="bg-slate-50 border-b border-slate-100 pb-4">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-lg">{topic.title}</CardTitle>
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: topic.color }}
                                        />
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-4 space-y-4">
                                    {/* Material Section Mockup */}
                                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm">
                                        <div className="flex items-center gap-2 font-medium text-slate-700 mb-1">
                                            <FileText className="w-4 h-4" />
                                            Material
                                        </div>
                                        {topic.materialUrl ? (
                                            <a href={topic.materialUrl} target="_blank" rel="noreferrer" className="text-indigo-600 underline">
                                                Link öffnen
                                            </a>
                                        ) : (
                                            <p className="text-slate-400 italic">Kein Material hinterlegt.</p>
                                        )}
                                    </div>

                                    {/* Students List */}
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Experten</p>
                                        {group.studentIds.map(studentId => {
                                            const student = getStudent(studentId);
                                            if (!student) return null;

                                            return (
                                                <div key={student.id} className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                                        {student.name.substring(0, 2)}
                                                    </div>
                                                    <span className="font-medium text-slate-700">{student.name}</span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    );
                })}
            </motion.div>
        </div>
    );
};

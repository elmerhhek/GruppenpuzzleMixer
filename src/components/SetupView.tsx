import React, { useState } from 'react';
import { useJigsawStore } from '../store/useJigsawStore';
import { Button, Input, Card, CardHeader, CardTitle, CardContent } from './ui';
import { Plus, Trash2, Users, BookOpen, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SetupView: React.FC = () => {
    const {
        mainTopic, setMainTopic,
        topics, addTopic, removeTopic, updateTopic,
        students, addStudent, removeStudent, importStudents,
        timerDuration, setTimerDuration,
        teachingDuration, setTeachingDuration,
        generateGroups
    } = useJigsawStore();

    const [newTopicTitle, setNewTopicTitle] = useState('');
    const [studentInput, setStudentInput] = useState('');
    const [expandedTopic, setExpandedTopic] = useState<string | null>(null);

    const handleAddTopic = (e: React.FormEvent) => {
        e.preventDefault();
        if (newTopicTitle.trim()) {
            addTopic(newTopicTitle.trim());
            setNewTopicTitle('');
        }
    };

    const handleAddStudent = (e: React.FormEvent) => {
        e.preventDefault();
        if (studentInput.trim()) {
            // Check if input contains newlines or commas for bulk import
            if (studentInput.includes(',') || studentInput.includes('\n')) {
                const names = studentInput.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
                importStudents(names);
            } else {
                addStudent(studentInput.trim());
            }
            setStudentInput('');
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
                    Gruppenpuzzle Mixer
                </h1>
                <p className="text-lg text-slate-600">
                    Planen Sie Ihre Unterrichtseinheit: Thema, Expertenbereiche und Teilnehmer.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* LEFT COLUMN: Topics */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-indigo-600" />
                            Thema & Expertengebiete
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Hauptthema</label>
                            <Input
                                placeholder="z.B. Die Französische Revolution"
                                value={mainTopic}
                                onChange={(e) => setMainTopic(e.target.value)}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Expertenthemen ({topics.length})</label>
                            <form onSubmit={handleAddTopic} className="flex gap-2">
                                <Input
                                    placeholder="Neues Unterthema hinzufügen..."
                                    value={newTopicTitle}
                                    onChange={(e) => setNewTopicTitle(e.target.value)}
                                />
                                <Button type="submit" size="sm" variant="secondary">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </form>

                            <div className="space-y-2 mt-4 max-h-[300px] overflow-y-auto pr-2">
                                <AnimatePresence initial={false}>
                                    {topics.map((topic) => (
                                        <motion.div
                                            key={topic.id}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="rounded-lg border border-slate-100 bg-slate-50 shadow-sm overflow-hidden"
                                            style={{ borderLeft: `4px solid ${topic.color}` }}
                                        >
                                            <div
                                                className="flex items-center justify-between p-3 cursor-pointer hover:bg-slate-100 transition-colors"
                                                onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                                            >
                                                <span className="font-medium">{topic.title}</span>
                                                <div className="flex items-center gap-2">
                                                    {topic.materialUrl && <BookOpen className="w-4 h-4 text-indigo-400" />}
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); removeTopic(topic.id); }}
                                                        className="text-slate-400 hover:text-red-500 transition-colors p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Expanded Details for Material */}
                                            {expandedTopic === topic.id && (
                                                <div className="p-3 pt-0 space-y-2 bg-white border-t border-slate-100">
                                                    <div className="text-xs text-slate-500 font-semibold uppercase mt-2">Material / Ressourcen</div>
                                                    <Input
                                                        placeholder="Link zum Material (URL)..."
                                                        className="h-8 text-xs"
                                                        value={topic.materialUrl || ''}
                                                        onChange={(e) => updateTopic(topic.id, { materialUrl: e.target.value })}
                                                    />
                                                    <Input
                                                        placeholder="Kurze Beschreibung..."
                                                        className="h-8 text-xs"
                                                        value={topic.materialDescription || ''}
                                                        onChange={(e) => updateTopic(topic.id, { materialDescription: e.target.value })}
                                                    />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                                {topics.length === 0 && (
                                    <p className="text-sm text-slate-400 text-center py-4">Noch keine Themen definiert.</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2 pt-4 border-t border-slate-100">
                            <label className="text-sm font-medium">Timer (Minuten)</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={Math.floor(timerDuration / 60)}
                                    onChange={(e) => setTimerDuration(parseInt(e.target.value) * 60)}
                                    className="w-24"
                                />
                                <span className="text-sm text-slate-500">für die Expertenphase</span>
                            </div>
                        </div>

                        <div className="space-y-2 pt-2">
                            <label className="text-sm font-medium">Vermittlungsphase (Minuten)</label>
                            <div className="flex items-center gap-2">
                                <Input
                                    type="number"
                                    min="1"
                                    max="120"
                                    value={Math.floor(teachingDuration / 60)}
                                    onChange={(e) => setTeachingDuration(parseInt(e.target.value) * 60)}
                                    className="w-24"
                                />
                                <span className="text-sm text-slate-500">für die Stammgruppen</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* RIGHT COLUMN: Students */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-indigo-600" />
                            Teilnehmer ({students.length})
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Schüler hinzufügen</label>
                            <form onSubmit={handleAddStudent} className="flex gap-2">
                                <Input
                                    placeholder="Name(n) eingeben..."
                                    value={studentInput}
                                    onChange={(e) => setStudentInput(e.target.value)}
                                />
                                <Button type="submit" size="sm" variant="secondary">
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </form>
                            <p className="text-xs text-slate-500">
                                Tipp: Mehrere Namen mit Komma trennen für Masseg-Import.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2 max-h-[400px] overflow-y-auto content-start">
                            <AnimatePresence>
                                {students.map((student) => (
                                    <motion.div
                                        key={student.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0.5, opacity: 0 }}
                                        className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-sm font-medium text-slate-700 border border-slate-200"
                                    >
                                        {student.name}
                                        <button
                                            onClick={() => removeStudent(student.id)}
                                            className="ml-1 text-slate-400 hover:text-red-500"
                                        >
                                            &times;
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            {students.length === 0 && (
                                <div className="w-full text-center py-8 text-slate-400 italic">
                                    Die Klasse ist noch leer.
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-center pt-8">
                <Button
                    size="lg"
                    onClick={generateGroups}
                    disabled={topics.length < 2 || students.length < 4}
                    className="w-full md:w-auto min-w-[300px] text-lg gap-2"
                >
                    Gruppen bilden & Starten
                    <ArrowRight className="w-5 h-5" />
                </Button>
            </div>
            {(topics.length < 2 || students.length < 4) && (
                <p className="text-center text-sm text-amber-600">
                    Mindestens 2 Themen und 4 Schüler erforderlich.
                </p>
            )}
        </div>
    );
};

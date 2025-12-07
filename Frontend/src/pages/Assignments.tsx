import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Loader2, Brain, Code, FileText, CheckCircle, ExternalLink } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Assignments = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [assignment, setAssignment] = useState(null);
    const [topic, setTopic] = useState('');
    const [difficulty, setDifficulty] = useState('Intermediate');
    const [type, setType] = useState('quiz');
    const [userAnswers, setUserAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);

    // Generate Assignment
    const handleGenerate = async () => {
        if (!topic.trim()) {
            toast({ title: "Topic required", description: "Please enter a topic for the assignment", variant: "destructive" });
            return;
        }

        setLoading(true);
        setAssignment(null);
        setShowResults(false);
        setUserAnswers({});

        try {
            // Direct API call to backend route we created
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:3001/api/assignments/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ type, topic, difficulty })
            });

            const data = await response.json();

            if (data.success) {
                setAssignment(data.data);
                toast({ title: "Assignment Generated!", description: `Ready to solve your ${type}.` });
            } else {
                throw new Error(data.error || "Failed to generate");
            }
        } catch (error) {
            toast({ title: "Error", description: error.message, variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    // Quiz Handling
    const handleOptionSelect = (qIndex, option) => {
        setUserAnswers(prev => ({ ...prev, [qIndex]: option }));
    };

    const calculateScore = () => {
        if (!assignment || !assignment.questions) return 0;
        let score = 0;
        assignment.questions.forEach((q, idx) => {
            // Simple check: user answer mostly equals correct answer string
            // AI might return "Option A" or just "A", so robust checking needed in real app
            // For now, assume AI returns full text match or we just match option text
            if (userAnswers[idx] === q.answer || q.answer.includes(userAnswers[idx])) {
                score++;
            }
        });
        return score;
    };

    return (
        <Layout>
            <div className="space-y-8 animate-fade-in max-w-4xl mx-auto">
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold gradient-text flex items-center justify-center gap-3">
                        <Brain className="w-10 h-10" /> AI Assignments
                    </h1>
                    <p className="text-muted-foreground">
                        Generate personalized quizzes and coding problems to test your knowledge.
                    </p>
                </div>

                {/* Generator Controls */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Assignment</CardTitle>
                        <CardDescription>Configure the AI to generate a task for you.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Tabs value={type} onValueChange={setType}>
                                    <TabsList className="w-full">
                                        <TabsTrigger value="quiz" className="flex-1"><FileText className="w-4 h-4 mr-2" /> Quiz</TabsTrigger>
                                        <TabsTrigger value="coding" className="flex-1"><Code className="w-4 h-4 mr-2" /> Coding</TabsTrigger>
                                    </TabsList>
                                </Tabs>
                            </div>
                            <div className="space-y-2">
                                <Label>Difficulty</Label>
                                <Select value={difficulty} onValueChange={setDifficulty}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Beginner">Beginner</SelectItem>
                                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                                        <SelectItem value="Advanced">Advanced</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Topic</Label>
                                <Input
                                    placeholder="e.g. React Hooks, Dynamic Programming..."
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleGenerate()}
                                />
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-gradient-primary hover:opacity-90" onClick={handleGenerate} disabled={loading}>
                            {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Generating...</> : 'Generate Assignment'}
                        </Button>
                    </CardFooter>
                </Card>

                {/* Assignment Display */}
                {assignment && type === 'quiz' && (
                    <Card className="animate-in fade-in slide-in-from-bottom-4">
                        <CardHeader>
                            <CardTitle className="flex justify-between items-center">
                                {assignment.title}
                                {showResults && (
                                    <Badge variant={calculateScore() >= 3 ? "default" : "destructive"}>
                                        Score: {calculateScore()}/{assignment.questions.length}
                                    </Badge>
                                )}
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {assignment.questions.map((q, idx) => (
                                <div key={idx} className="space-y-3 p-4 rounded-lg border bg-card/50">
                                    <h3 className="font-semibold text-lg">{idx + 1}. {q.question}</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options.map((opt, optIdx) => (
                                            <Button
                                                key={optIdx}
                                                variant={userAnswers[idx] === opt ? "default" : "outline"}
                                                className={`justify-start h-auto py-3 text-left ${showResults && opt === q.answer ? "border-green-500 bg-green-500/10 text-green-500 hover:bg-green-500/20" : ""
                                                    } ${showResults && userAnswers[idx] === opt && opt !== q.answer ? "border-red-500 bg-red-500/10 text-red-500" : ""
                                                    }`}
                                                onClick={() => !showResults && handleOptionSelect(idx, opt)}
                                                disabled={showResults}
                                            >
                                                {opt}
                                            </Button>
                                        ))}
                                    </div>
                                    {showResults && (
                                        <div className="text-sm text-muted-foreground mt-2">
                                            Correct Answer: <span className="text-primary font-medium">{q.answer}</span>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </CardContent>
                        <CardFooter>
                            {!showResults ? (
                                <Button className="w-full" onClick={() => setShowResults(true)}>Submit Answers</Button>
                            ) : (
                                <Button className="w-full variant-outline" onClick={handleGenerate}>Try Another</Button>
                            )}
                        </CardFooter>
                    </Card>
                )}

                {assignment && type === 'coding' && (
                    <Card className="animate-in fade-in slide-in-from-bottom-4">
                        <CardHeader>
                            <CardTitle>{assignment.title}</CardTitle>
                            <CardDescription>{assignment.description}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div>
                                <h3 className="font-semibold mb-2">Examples:</h3>
                                {assignment.examples.map((ex, idx) => (
                                    <div key={idx} className="bg-muted/50 p-3 rounded-md mb-2 text-sm font-mono">
                                        <div>Input: {ex.input}</div>
                                        <div>Output: {ex.output}</div>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <h3 className="font-semibold mb-2">Starter Code:</h3>
                                <div className="rounded-md overflow-hidden">
                                    {/* <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers>
                                        {assignment.initialCode}
                                    </SyntaxHighlighter> */}
                                    <pre className="p-4 bg-muted overflow-x-auto text-sm">{assignment.initialCode}</pre>
                                </div>
                            </div>

                            {showResults && (
                                <div className="animate-in fade-in">
                                    <h3 className="font-semibold mb-2 text-green-400">Solution:</h3>
                                    <div className="rounded-md overflow-hidden border border-green-500/30">
                                        {/* <SyntaxHighlighter language="javascript" style={vscDarkPlus} showLineNumbers>
                                            {assignment.solution}
                                        </SyntaxHighlighter> */}
                                        <pre className="p-4 bg-muted overflow-x-auto text-sm">{assignment.solution}</pre>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full" variant={showResults ? "outline" : "default"} onClick={() => setShowResults(!showResults)}>
                                {showResults ? "Hide Solution" : "Show Solution"}
                            </Button>
                        </CardFooter>
                    </Card>
                )}
            </div>
        </Layout>
    );
};

export default Assignments;

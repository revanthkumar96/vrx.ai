import React, { useState } from 'react';
import { Layout } from "@/components/Layout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import CareerCompanionChatBoard from "@/components/CareerCompanionChatBoard";
import {
  Brain,
  MessageCircle,
  Lightbulb,
  Briefcase,
  Send,
  Sparkles,
  Crown,
  X
} from "lucide-react";

const CareerCompanion = () => {
  const [showPremiumPopup, setShowPremiumPopup] = useState(false);

  const suggestedQuestions = [
    "How to prepare for a system design interview?",
    "Review my recent coding problem steps",
    "What projects should I build for my portfolio?",
    "Mock interview for a junior dev role"
  ];

  const handleConnectMentor = (mentorName: string) => {
    setShowPremiumPopup(true);
  };

  const PremiumPopup = () => (
    <div className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ${showPremiumPopup ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className={`bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md mx-4 transform transition-all duration-300 ${showPremiumPopup ? 'scale-100' : 'scale-95'}`}>
        <div className="text-center space-y-6">
          {/* Close button */}
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowPremiumPopup(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Premium icon */}
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
            <Crown className="w-10 h-10 text-white" />
          </div>

          {/* Title and message */}
          <div className="space-y-3">
            <h3 className="text-2xl font-bold gradient-text">Premium Mentorship</h3>
            <p className="text-muted-foreground">
              Upgrade to Premium for direct access to industry experts and personalized mock interviews.
            </p>
          </div>

          {/* Premium benefits */}
          <div className="text-left space-y-2 bg-gradient-to-br from-primary/10 to-primary/5 p-4 rounded-xl">
            <h4 className="font-semibold text-primary mb-2">Premium Benefits:</h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>1-on-1 sessions with Senior Engineers</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Unlimited Resume Reviews</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Personalized Career Roadmap</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-green-500">✓</span>
                <span>Exclusive Interview Question Bank</span>
              </li>
            </ul>
          </div>

          {/* Action buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowPremiumPopup(false)}
              className="flex-1"
            >
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-gradient-primary hover:opacity-90"
              onClick={() => {
                setShowPremiumPopup(false);
                console.log('Redirecting to premium upgrade...');
              }}
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <Briefcase className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">AI Career Companion</h1>
              <p className="text-muted-foreground">Your expert guide for technical career growth and interview success</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Chat Interface */}
          <div className="lg:col-span-3">
            <CareerCompanionChatBoard />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Confidence Tracker */}
            <DashboardCard title="Confidence Level" variant="default">
              <div className="space-y-4">
                <div className="text-center">
                  <div className="text-3xl mb-2">�</div>
                  <div className="text-sm text-muted-foreground">Interview Readiness</div>
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {['🌱', '🏃', '🧗', '⛰️', '�'].map((emoji, i) => (
                    <button
                      key={i}
                      className="p-2 rounded-lg hover:bg-primary/10 transition-colors"
                      title={["Beginner", "Learning", "Improving", "Confident", "Ready"][i]}
                    >
                      <span className="text-xl">{emoji}</span>
                    </button>
                  ))}
                </div>
              </div>
            </DashboardCard>

            {/* Quick Tips */}
            <DashboardCard title="Daily Career Tip" variant="default">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  <span className="font-medium">STAR Method</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Answer behavioral questions using Situation, Task, Action, and Result. Keep stories under 2 minutes.
                </p>
                <Button variant="outline" size="sm" className="w-full border-primary/30">
                  Practice Now
                </Button>
              </div>
            </DashboardCard>

            {/* Recent Sessions */}
            <DashboardCard title="Recent Topics" variant="default">
              <div className="space-y-3">
                {[
                  { date: "Today", topic: "Resume Review", duration: "15m" },
                  { date: "Yesterday", topic: "DSA: Trees", duration: "25m" },
                  { date: "2 days ago", topic: "System Design", duration: "20m" }
                ].map((session, i) => (
                  <div key={i} className="flex justify-between items-center p-2 rounded-lg hover:bg-primary/5">
                    <div>
                      <div className="text-sm font-medium">{session.topic}</div>
                      <div className="text-xs text-muted-foreground">{session.date}</div>
                    </div>
                    <div className="text-xs text-primary">{session.duration}</div>
                  </div>
                ))}
              </div>
            </DashboardCard>
          </div>
        </div>

        {/* Recommended Mentors */}
        <DashboardCard title="👨‍💻 Recommended Career Mentors" variant="default" size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

            <div className="p-6 glass rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">JD</span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-primary">John Doe</h3>
                  <p className="text-sm text-muted-foreground">Senior Staff Engineer</p>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">System Design</Badge>
                    <Badge variant="secondary" className="text-xs">Backend</Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Experience:</strong> 15+ years</p>
                    <p><strong>Specialization:</strong> Large-scale distributed systems</p>
                    <p><strong>Best for:</strong> Senior level system design interviews</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-xs text-muted-foreground">(4.9/5)</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-primary hover:opacity-90 text-sm"
                  onClick={() => handleConnectMentor('John Doe')}
                >
                  Book Session
                </Button>
              </div>
            </div>

            <div className="p-6 glass rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-teal-400 to-cyan-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">AS</span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-primary">Alice Smith</h3>
                  <p className="text-sm text-muted-foreground">Engineering Manager</p>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">Management</Badge>
                    <Badge variant="secondary" className="text-xs">Behavioral</Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Experience:</strong> 12+ years</p>
                    <p><strong>Specialization:</strong> Leadership and behavioral interviews</p>
                    <p><strong>Best for:</strong> EM/Staff+ behavioral rounds</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-xs text-muted-foreground">(4.8/5)</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-primary hover:opacity-90 text-sm"
                  onClick={() => handleConnectMentor('Alice Smith')}
                >
                  Book Session
                </Button>
              </div>
            </div>

            <div className="p-6 glass rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-rose-400 to-pink-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">RJ</span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-primary">Raj Johnson</h3>
                  <p className="text-sm text-muted-foreground">Frontend Architect</p>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">Frontend</Badge>
                    <Badge variant="secondary" className="text-xs">React</Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Experience:</strong> 10+ years</p>
                    <p><strong>Specialization:</strong> Modern web performance and architecture</p>
                    <p><strong>Best for:</strong> Frontend domain expert interviews</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-xs text-muted-foreground">(4.9/5)</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-primary hover:opacity-90 text-sm"
                  onClick={() => handleConnectMentor('Raj Johnson')}
                >
                  Book Session
                </Button>
              </div>
            </div>

            <div className="p-6 glass rounded-xl border border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-lg">
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">MK</span>
                </div>

                <div>
                  <h3 className="font-bold text-lg text-primary">Mike Kim</h3>
                  <p className="text-sm text-muted-foreground">Ex-FAANG Recruiter</p>
                </div>

                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary" className="text-xs">Negotiation</Badge>
                    <Badge variant="secondary" className="text-xs">Resume</Badge>
                  </div>

                  <div className="text-sm space-y-1">
                    <p><strong>Experience:</strong> 8+ years</p>
                    <p><strong>Specialization:</strong> Salary negotiation and resume optimization</p>
                    <p><strong>Best for:</strong> Getting past ATS and maximizing offers</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    <span className="text-yellow-400">★★★★★</span>
                    <span className="text-xs text-muted-foreground">(4.7/5)</span>
                  </div>
                </div>

                <Button
                  className="w-full bg-gradient-primary hover:opacity-90 text-sm"
                  onClick={() => handleConnectMentor('Mike Kim')}
                >
                  Book Session
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              All mentors are vetted industry professionals from top tech companies.
            </p>
            <Button variant="outline" className="border-primary/30 hover:bg-primary/10">
              View All Mentors
            </Button>
          </div>
        </DashboardCard>

        <PremiumPopup />
      </div>
    </Layout>
  );
};

export default CareerCompanion;
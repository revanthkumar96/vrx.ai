import React, { useState, useEffect } from 'react';
import { Layout } from "@/components/Layout";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { ContributionTracker } from "@/components/dashboard/ContributionTracker";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ApiClient } from '@/lib/api';

const apiClient = new ApiClient();
import {
  Target,
  Trophy,
  TrendingUp,
  Clock,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Map,
  Calendar as CalendarIcon
} from "lucide-react";
import { Card, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const DayTracker = () => {
  const { toast } = useToast();
  const [monthlyGoals, setMonthlyGoals] = useState({
    daily_study_minutes: 0,
    leetcode_problems: 0,
    codechef_problems: 0,
    codeforces_problems: 0,
    contest_participation: 0,
    career_milestones: 0
  });
  const [monthlyProgress, setMonthlyProgress] = useState(null);
  const [dailyActivities, setDailyActivities] = useState([]);
  const [isGoalDialogOpen, setIsGoalDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());

  const [activeRoadmaps, setActiveRoadmaps] = useState<any[]>([]);
  const [selectedRoadmapForEdit, setSelectedRoadmapForEdit] = useState<any>(null);
  const [roadmapEditForm, setRoadmapEditForm] = useState({ start_date: '', end_date: '' });

  // Fetch data on component mount
  useEffect(() => {
    fetchActivityData();
    fetchRoadmaps();
  }, []);

  useEffect(() => {
    if (selectedRoadmapForEdit) {
      setRoadmapEditForm({
        start_date: selectedRoadmapForEdit.start_date ? new Date(selectedRoadmapForEdit.start_date).toISOString().split('T')[0] : '',
        end_date: selectedRoadmapForEdit.end_date ? new Date(selectedRoadmapForEdit.end_date).toISOString().split('T')[0] : ''
      });
    }
  }, [selectedRoadmapForEdit]);

  const fetchRoadmaps = async () => {
    try {
      const response = await apiClient.getUserCareerPaths();
      if (response.status === 'success') {
        setActiveRoadmaps(response.data?.careerPaths || []);
      }
    } catch (e) {
      console.error("Failed to fetch roadmaps", e);
    }
  };

  const handleSaveRoadmapDates = async () => {
    if (!selectedRoadmapForEdit) return;
    try {
      await apiClient.updateRoadmapDates(selectedRoadmapForEdit.id, roadmapEditForm);
      toast({ title: "Updated", description: "Roadmap dates updated successfully" });
      fetchRoadmaps();
      setSelectedRoadmapForEdit(null);
    } catch (e) {
      toast({ title: "Error", description: "Failed to update dates", variant: 'destructive' });
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days: (Date | null)[] = Array(firstDay).fill(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const calendarDays = generateCalendarDays();

  const navigateMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  const getRoadmapsForDate = (date: Date) => {
    return activeRoadmaps.filter(rm => {
      if (!rm.start_date) return false;
      const start = new Date(rm.start_date);
      start.setHours(0, 0, 0, 0);
      const end = rm.end_date ? new Date(rm.end_date) : new Date(start);
      // Default duration assumption if no end date? Let's verify requirement.
      // "When a user starts a roadmap, it should display...". Let's show it on start date or span if end date exists.
      // If no end date, maybe show it just on start date or for a default week?
      if (!rm.end_date) end.setDate(end.getDate() + 30); // Default 1 month visualization if no target

      end.setHours(23, 59, 59, 999);

      return date >= start && date <= end;
    });
  };


  const fetchActivityData = async () => {
    try {
      setLoading(true);

      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      // Fetch monthly goals
      const goalsResponse = await apiClient.getMonthlyGoals(currentYear, currentMonth);
      if (goalsResponse.status === 'success' && goalsResponse.data) {
        setMonthlyGoals(goalsResponse.data as typeof monthlyGoals);
      }

      // Fetch monthly progress
      const progressResponse = await apiClient.getMonthlyProgress(currentYear, currentMonth);
      if (progressResponse.status === 'success') {
        setMonthlyProgress(progressResponse.data);
      }

      // Fetch monthly activity range
      const activitiesResponse = await apiClient.getMonthlyActivityRange(currentYear, currentMonth);
      if (activitiesResponse.status === 'success' && activitiesResponse.data) {
        setDailyActivities(activitiesResponse.data as any[]);
      }

    } catch (error) {
      console.error('Error fetching activity data:', error);
      console.error('Failed to load activity data');
    } finally {
      setLoading(false);
    }
  };

  const handleSetGoals = async (goalData) => {
    try {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth() + 1;

      const response = await apiClient.setMonthlyGoals({
        ...goalData,
        month: currentMonth,
        year: currentYear
      });

      if (response.status === 'success' && response.data) {
        setMonthlyGoals(response.data as typeof monthlyGoals);
        setIsGoalDialogOpen(false);
        console.log('Monthly goals updated successfully!');
        fetchActivityData(); // Refresh data
      }
    } catch (error) {
      console.error('Error setting goals:', error);
      console.error('Failed to update goals');
    }
  };

  const handleSyncFromStats = async () => {
    try {
      const response = await apiClient.syncActivityFromStats();
      if (response.status === 'success') {
        console.log('Activity synced from coding stats!');
        fetchActivityData(); // Refresh data
      }
    } catch (error) {
      console.error('Error syncing stats:', error);
      console.error('Failed to sync activity');
    }
  };

  // Generate calendar data from daily activities
  const generateCalendarData = () => {
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
    const calendar = [];

    for (let i = 1; i <= daysInMonth; i++) {
      const dayActivity = dailyActivities.find(activity => {
        const activityDate = new Date(activity.activity_date);
        return activityDate.getDate() === i;
      });

      const hasActivity = dayActivity && (
        dayActivity.study_minutes > 0 ||
        dayActivity.leetcode_solved > 0 ||
        dayActivity.codechef_solved > 0 ||
        dayActivity.codeforces_solved > 0 ||
        dayActivity.contests_participated > 0 ||
        dayActivity.career_milestones_completed > 0
      );

      const totalActivity = dayActivity ? (
        dayActivity.study_minutes +
        dayActivity.leetcode_solved * 30 +
        dayActivity.codechef_solved * 30 +
        dayActivity.codeforces_solved * 30 +
        dayActivity.contests_participated * 120 +
        dayActivity.career_milestones_completed * 60
      ) : 0;

      const intensity = hasActivity ? Math.min(4, Math.floor(totalActivity / 60) + 1) : 0;

      calendar.push({
        day: i,
        hasActivity,
        intensity,
        studyTime: dayActivity ? Math.floor(dayActivity.study_minutes / 60) : 0,
        activity: dayActivity
      });
    }
    return calendar;
  };

  const calendarData = generateCalendarData();
  const totalStudyDays = calendarData.filter(day => day.hasActivity).length;
  const currentStreak = monthlyProgress?.current_streak || 0;

  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 0: return "bg-muted/30 hover:bg-muted/50";
      case 1: return "bg-primary/30 hover:bg-primary/40";
      case 2: return "bg-primary/60 hover:bg-primary/70";
      case 3: return "bg-primary/80 hover:bg-primary/90";
      case 4: return "bg-primary hover:bg-primary/90";
      default: return "bg-muted/30";
    }
  };

  // Dynamic goal data from backend
  const goals = [
    {
      name: "Daily Study",
      target: monthlyGoals.daily_study_minutes || 0,
      current: monthlyProgress?.total_study_minutes || 0,
      unit: "minutes",
      progress: monthlyProgress?.study_progress_percent || 0,
      key: 'daily_study_minutes'
    },
    {
      name: "LeetCode Problems",
      target: monthlyGoals.leetcode_problems || 0,
      current: monthlyProgress?.total_leetcode_solved || 0,
      unit: "problems",
      progress: monthlyProgress?.leetcode_progress_percent || 0,
      key: 'leetcode_problems'
    },
    {
      name: "CodeChef Problems",
      target: monthlyGoals.codechef_problems || 0,
      current: monthlyProgress?.total_codechef_solved || 0,
      unit: "problems",
      progress: monthlyProgress?.codechef_progress_percent || 0,
      key: 'codechef_problems'
    },
    {
      name: "Codeforces Problems",
      target: monthlyGoals.codeforces_problems || 0,
      current: monthlyProgress?.total_codeforces_solved || 0,
      unit: "problems",
      progress: monthlyProgress?.codeforces_progress_percent || 0,
      key: 'codeforces_problems'
    },
    {
      name: "Contest Participation",
      target: monthlyGoals.contest_participation || 0,
      current: monthlyProgress?.total_contests_participated || 0,
      unit: "contests",
      progress: monthlyProgress?.contest_progress_percent || 0,
      key: 'contest_participation'
    },
    {
      name: "Career Milestones",
      target: monthlyGoals.career_milestones || 0,
      current: monthlyProgress?.total_career_milestones || 0,
      unit: "milestones",
      progress: monthlyProgress?.career_progress_percent || 0,
      key: 'career_milestones'
    }
  ];

  const GoalSettingDialog = () => {
    const [goalForm, setGoalForm] = useState(monthlyGoals);

    const handleSubmit = (e) => {
      e.preventDefault();
      handleSetGoals(goalForm);
    };

    return (
      <Dialog open={isGoalDialogOpen} onOpenChange={setIsGoalDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Set Monthly Goals</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="daily_study_minutes">Daily Study (minutes/day)</Label>
              <Input
                id="daily_study_minutes"
                type="number"
                min="0"
                value={goalForm.daily_study_minutes}
                onChange={(e) => setGoalForm({ ...goalForm, daily_study_minutes: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="leetcode_problems">LeetCode Problems</Label>
              <Input
                id="leetcode_problems"
                type="number"
                min="0"
                value={goalForm.leetcode_problems}
                onChange={(e) => setGoalForm({ ...goalForm, leetcode_problems: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codechef_problems">CodeChef Problems</Label>
              <Input
                id="codechef_problems"
                type="number"
                min="0"
                value={goalForm.codechef_problems}
                onChange={(e) => setGoalForm({ ...goalForm, codechef_problems: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codeforces_problems">Codeforces Problems</Label>
              <Input
                id="codeforces_problems"
                type="number"
                min="0"
                value={goalForm.codeforces_problems}
                onChange={(e) => setGoalForm({ ...goalForm, codeforces_problems: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contest_participation">Contest Participation</Label>
              <Input
                id="contest_participation"
                type="number"
                min="0"
                value={goalForm.contest_participation}
                onChange={(e) => setGoalForm({ ...goalForm, contest_participation: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="career_milestones">Career Milestones</Label>
              <Input
                id="career_milestones"
                type="number"
                min="0"
                value={goalForm.career_milestones}
                onChange={(e) => setGoalForm({ ...goalForm, career_milestones: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsGoalDialogOpen(false)} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 bg-gradient-primary hover:opacity-90">
                Save Goals
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold gradient-text">Day Tracker</h1>
              <p className="text-muted-foreground">Track your daily progress and maintain consistency</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <DashboardCard title="Current Streak" className="text-center">
            <div className="space-y-3">
              <TrendingUp className="w-8 h-8 mx-auto text-orange-400" />
              <div className="text-3xl font-bold gradient-text">{monthlyProgress?.current_streak || 0}</div>
              <div className="text-sm text-muted-foreground">days strong</div>
            </div>
          </DashboardCard>

          <DashboardCard title="This Month" className="text-center">
            <div className="space-y-3">
              <Trophy className="w-8 h-8 mx-auto text-green-400" />
              <div className="text-3xl font-bold text-green-400">{dailyActivities.filter(day => day.problems_solved > 0).length}</div>
              <div className="text-sm text-muted-foreground">active days</div>
            </div>
          </DashboardCard>

          <DashboardCard title="Total Study Time" className="text-center">
            <div className="space-y-3">
              <Clock className="w-8 h-8 mx-auto text-blue-400" />
              <div className="text-3xl font-bold text-blue-400">
                {monthlyProgress ? Math.floor((monthlyProgress.total_study_minutes || 0) / 60) : 0}h
              </div>
              <div className="text-sm text-muted-foreground">this month</div>
            </div>
          </DashboardCard>

          <DashboardCard title="Problems Solved" className="text-center">
            <div className="space-y-3">
              <Trophy className="w-8 h-8 mx-auto text-yellow-400" />
              <div className="text-3xl font-bold text-yellow-400">
                {monthlyProgress ? (
                  (monthlyProgress.total_leetcode_solved || 0) +
                  (monthlyProgress.total_codechef_solved || 0) +
                  (monthlyProgress.total_codeforces_solved || 0)
                ) : 0}
              </div>
              <div className="text-sm text-muted-foreground">this month</div>
            </div>
          </DashboardCard>
        </div>

        {/* Calendar & Roadmaps Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
                <CalendarIcon className="w-6 h-6" /> Learning Calendar
              </h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth(-1)}>Previous</Button>
                <span className="font-medium min-w-[120px] text-center">
                  {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </span>
                <Button variant="outline" size="sm" onClick={() => navigateMonth(1)}>Next</Button>
              </div>
            </div>

            <Card className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4 text-center text-sm font-medium text-muted-foreground">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, i) => {
                  const isToday = date && new Date().toDateString() === date.toDateString();
                  const dayRoadmaps = date ? getRoadmapsForDate(date) : [];
                  const dayActivity = date ? dailyActivities.find(a => new Date(a.activity_date).toDateString() === date.toDateString()) : null;

                  return (
                    <div key={i} className={`min-h-[80px] p-1 border rounded-md relative ${!date ? 'bg-transparent border-transparent' : 'bg-card/50'}`}>
                      {date && (
                        <>
                          <div className={`text-xs text-right mb-1 ${isToday ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                            {date.getDate()}
                          </div>

                          {/* Activity Dot */}
                          {dayActivity && dayActivity.study_minutes > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 absolute top-2 left-2" title={`${dayActivity.study_minutes}m study`} />
                          )}

                          {/* Roadmap Bars */}
                          <div className="space-y-1">
                            {dayRoadmaps.map((rm, idx) => (
                              <div
                                key={idx}
                                onClick={() => setSelectedRoadmapForEdit(rm)}
                                className="text-[10px] px-1 py-0.5 rounded cursor-pointer truncate bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 transition-colors border border-blue-500/30"
                                title={`${rm.roadmap_name} (Click to edit)`}
                              >
                                {rm.roadmap_name}
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Active Roadmaps List */}
            <Card className="p-6">
              <CardTitle className="mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" /> Active Roadmaps
              </CardTitle>
              <div className="space-y-4">
                {activeRoadmaps.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No active roadmaps. Start one from the Roadmaps page!</p>
                ) : (
                  activeRoadmaps.map(rm => (
                    <div key={rm.id} className="p-3 rounded-lg border bg-card/50 flex flex-col gap-2">
                      <div className="font-semibold">{rm.roadmap_name}</div>
                      <div className="text-xs text-muted-foreground grid grid-cols-2 gap-2">
                        <div>Start: {rm.start_date ? new Date(rm.start_date).toLocaleDateString() : 'Not set'}</div>
                        <div>Target: {rm.end_date ? new Date(rm.end_date).toLocaleDateString() : 'None'}</div>
                      </div>
                      <div className="w-full bg-secondary/50 h-1.5 rounded-full mt-1">
                        <div
                          className="bg-primary h-full rounded-full transition-all duration-500"
                          style={{ width: `${rm.progress || 0}%` }}
                        />
                      </div>
                      <Button variant="ghost" size="sm" className="w-full text-xs h-6 mt-1" onClick={() => setSelectedRoadmapForEdit(rm)}>
                        <Edit className="w-3 h-3 mr-1" /> Edit Dates
                      </Button>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Roadmap Edit Dialog */}
        <Dialog open={!!selectedRoadmapForEdit} onOpenChange={(open) => !open && setSelectedRoadmapForEdit(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Roadmap Schedule</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={roadmapEditForm.start_date}
                  onChange={e => setRoadmapEditForm({ ...roadmapEditForm, start_date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Target Completion Date</Label>
                <Input
                  type="date"
                  value={roadmapEditForm.end_date}
                  onChange={e => setRoadmapEditForm({ ...roadmapEditForm, end_date: e.target.value })}
                />
              </div>
              <Button className="w-full" onClick={handleSaveRoadmapDates}>
                Save Schedule
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Goal Tracker */}
        <DashboardCard title="🎯 Monthly Goal Tracker" size="lg">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {goals.map((goal) => (
              <div key={goal.name} className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="font-medium">{goal.name}</span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{goal.current} {goal.unit}</span>
                    <span className="text-muted-foreground">{goal.target} {goal.unit}</span>
                  </div>
                  <Progress value={goal.progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {goal.progress}% complete
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold gradient-text">
                    {goal.target > 0 ? Math.round((goal.current / goal.target) * 100) : 0}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex space-x-4">
            <Button variant="outline" className="flex-1">
              <BarChart3 className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button className="flex-1 bg-gradient-primary hover:opacity-90" onClick={() => setIsGoalDialogOpen(true)}>
              <Target className="w-4 h-4 mr-2" />
              Set New Goals
            </Button>
          </div>
        </DashboardCard>

        <GoalSettingDialog />
      </div>
    </Layout>
  );
};

export default DayTracker;
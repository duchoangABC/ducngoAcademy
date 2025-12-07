

export interface UserProfile {
  name: string;
  id: string;
  avatarUrl: string;
  streak: number;
  points: number;
  jobTitle?: string;
  hasTakenEntryTest?: boolean; // New field
}

export interface Course {
  id: string;
  title: string;
  progress: number;
  totalParticipants: string;
  daysLeft: number;
  totalLessons: number;
  completedLessons: number;
}

export interface Badge {
  id: number;
  name: string;
  date: string;
  icon: any; // Using any for component reference in mock
  color: string;
  bg: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

// --- CMS Backend Types ---

export interface Question {
  id: string;
  text: string;
  type: 'MCQ' | 'Essay' | 'Code' | 'TrueFalse';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}

export interface AdaptiveNode {
  id: number;
  title: string;
  type: 'lesson' | 'quiz' | 'remedial' | 'project';
  next: number[];
  condition?: string; // e.g. "score < 50"
}

export interface DashboardStats {
  activeUsers: number;
  completions: number;
  adaptiveTriggers: number;
  engagement: string;
  chartData: { name: string; active: number; completion: number }[];
}

export interface DetailedAnalysis {
  cognitiveStyle: 'Analytical' | 'Creative' | 'Practical' | 'Social';
  learningVelocity: 'Fast' | 'Steady' | 'Variable';
  consistencyScore: number; // 0-100
  keyInsight: string; // Scientific observation
  gapAnalysis: string; // Specific missing knowledge
  actionPlan: {
    immediate: string;
    longTerm: string;
  };
}

export interface LearnerProfile {
  id: number;
  name: string;
  email: string;
  course: string;
  progress: number;
  avgScore: number;
  adaptiveScore: 'High' | 'Medium' | 'Low';
  avatar: string;
  radarData: { subject: string; A: number; fullMark: number }[];
  
  // New structured analysis
  analysis: DetailedAnalysis;
  
  // Legacy fields (optional compatibility)
  strengths?: string;
  weakness?: string;
  recommendation?: string;
  
  isAssigned: boolean;
}

export interface ContentItem {
  id: string;
  title: string;
  type: 'video' | 'article' | 'document';
  status: 'published' | 'draft' | 'archived';
  category: string;
  author: string;
  lastModified: string;
  duration?: string; // For videos
  views?: number;
}
export interface CompetencyLevel {
    level: number;
    name: string;
    description: string;
}

export interface CompetencySubject {
    id: string;
    name: string;
    description: string;
    levels: CompetencyLevel[];
}

export interface CompetencyMapping {
    questionTag: string; // e.g., "Math"
    subjectId: string;   // e.g., "competency_math"
    weight: number;      // 0.0 to 1.0 contribution
}

export interface CompetencyFramework {
    id: string;
    name: string; // e.g., "AI Engineer Entry Level"
    type: 'Entry' | 'Target';
    subjects: CompetencySubject[]; // List of subjects included in this framework
}

export interface AIConfig {
    model: string;
    temperature: number;
    systemInstruction: string;
    isActive: boolean;
}

export interface ChatSessionLog {
    id: string;
    userName: string;
    startTime: string;
    messageCount: number;
    sentiment: 'Positive' | 'Neutral' | 'Negative';
    topics: string[];
}

export interface KnowledgeBaseItem {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'txt' | 'url';
    size: string;
    uploadDate: string;
    status: 'trained' | 'processing' | 'error';
    tags: {
        subject: string;
        level: string; 
    };
}

// --- Entry Test Types ---
export interface EntryTestSession {
    currentQuestionIndex: number;
    answers: Record<string, string>; // questionId -> answer
    score: number;
    status: 'in-progress' | 'completed';
}

export interface GapAnalysis {
    subject: string;
    currentScore: number;
    targetScore: number;
    gap: number; // target - current
    recommendation: string;
}

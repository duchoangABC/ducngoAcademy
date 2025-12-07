

import { Question, AdaptiveNode, DashboardStats, LearnerProfile, ContentItem, CompetencyFramework, CompetencyMapping, AIConfig, ChatSessionLog, KnowledgeBaseItem, GapAnalysis } from '../types';

// Initial Seed Data
const DEFAULT_QUESTIONS: Question[] = [
  { id: '1', text: "AI Mùa đông (AI Winter) xảy ra vào thập kỷ nào?", type: "MCQ", difficulty: "Easy", tags: ["Lịch sử", "AI Cơ bản"] },
  { id: '2', text: "Hàm Loss function nào phù hợp cho bài toán phân loại nhị phân?", type: "MCQ", difficulty: "Hard", tags: ["Math", "Deep Learning"] },
  { id: '3', text: "Giải thích khái niệm Overfitting trong 50 từ.", type: "Essay", difficulty: "Medium", tags: ["Concept"] },
  { id: '4', text: "Code Python để load dataset từ CSV.", type: "Code", difficulty: "Medium", tags: ["Python", "Practical"] },
  { id: '5', text: "Perceptron là gì?", type: "MCQ", difficulty: "Easy", tags: ["Neural Networks", "AI Cơ bản"] },
  { id: '6', text: "Sự khác biệt giữa Supervised và Unsupervised Learning?", type: "Essay", difficulty: "Medium", tags: ["Concept"] },
];

const DEFAULT_NODES: AdaptiveNode[] = [
  { id: 1, title: 'Bài 1: Nhập môn AI', type: 'lesson', next: [2] },
  { id: 2, title: 'Quiz 1: Kiến thức nền', type: 'quiz', next: [3, 4] },
  { id: 3, title: 'Bài 2: Deep Learning (Nâng cao)', type: 'lesson', next: [5] },
  { id: 4, title: 'Bài 1.5: Ôn tập cơ bản (Remedial)', type: 'remedial', next: [2], condition: "Score < 50%" },
  { id: 5, title: 'Final Project', type: 'project', next: [] },
];

const DEFAULT_LEARNERS: LearnerProfile[] = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "an.nguyen@example.com",
    course: "AI Fundamentals",
    progress: 85,
    avgScore: 9.2,
    adaptiveScore: "High",
    avatar: "https://i.pravatar.cc/150?u=1",
    radarData: [
      { subject: 'Coding', A: 140, fullMark: 150 },
      { subject: 'Logic', A: 130, fullMark: 150 },
      { subject: 'Design', A: 110, fullMark: 150 },
      { subject: 'Comms', A: 100, fullMark: 150 },
      { subject: 'AI', A: 145, fullMark: 150 },
      { subject: 'Math', A: 135, fullMark: 150 },
    ],
    analysis: {
        cognitiveStyle: 'Analytical',
        learningVelocity: 'Fast',
        consistencyScore: 92,
        keyInsight: "Tư duy giải thuật vượt trội (Algorithmic Thinking). Học viên có xu hướng tiếp cận vấn đề từ nguyên lý (First-principles) hơn là ghi nhớ máy móc.",
        gapAnalysis: "Khả năng diễn đạt ý tưởng kỹ thuật cho đối tượng phi kỹ thuật còn yếu. Có sự chênh lệch lớn giữa 'Input' (Hiểu) và 'Output' (Truyền đạt).",
        actionPlan: {
            immediate: "Thực hành phương pháp 'Feynman Technique': Yêu cầu giải thích lại khái niệm Loss Function bằng ngôn ngữ đời thường trong 2 phút.",
            longTerm: "Tham gia dự án nhóm với vai trò Technical Lead để buộc phải giao tiếp và điều phối, thay vì chỉ code độc lập."
        }
    },
    isAssigned: false
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "binh.tran@example.com",
    course: "AI Fundamentals",
    progress: 62,
    avgScore: 7.5,
    adaptiveScore: "Medium",
    avatar: "https://i.pravatar.cc/150?u=5",
    radarData: [
      { subject: 'Coding', A: 120, fullMark: 150 },
      { subject: 'Logic', A: 98, fullMark: 150 },
      { subject: 'Design', A: 86, fullMark: 150 },
      { subject: 'Comms', A: 140, fullMark: 150 },
      { subject: 'AI', A: 85, fullMark: 150 },
      { subject: 'Math', A: 65, fullMark: 150 },
    ],
    analysis: {
        cognitiveStyle: 'Social',
        learningVelocity: 'Steady',
        consistencyScore: 78,
        keyInsight: "Trí thông minh ngôn ngữ và tương tác xã hội cao. Học viên học tốt nhất qua thảo luận (Peer Learning) hơn là đọc tài liệu tĩnh.",
        gapAnalysis: "Tư duy trừu tượng toán học (Abstract Formalism) gặp rào cản. Thường xuyên mắc lỗi ở các bài toán Ma trận và Đạo hàm do thiếu trực quan hóa.",
        actionPlan: {
            immediate: "Chuyển đổi phương pháp học Toán: Sử dụng công cụ trực quan (như Desmos, GeoGebra) thay vì công thức thuần túy.",
            longTerm: "Xây dựng lộ trình 'Top-down': Học cách ứng dụng Model trước, sau đó mới đào sâu vào toán học bên dưới khi đã thấy kết quả thực tế."
        }
    },
    isAssigned: false
  },
  {
    id: 3,
    name: "Lê Hoàng Cường",
    email: "cuong.le@example.com",
    course: "AI Fundamentals",
    progress: 40,
    avgScore: 6.8,
    adaptiveScore: "Low",
    avatar: "https://i.pravatar.cc/150?u=3",
    radarData: [
      { subject: 'Coding', A: 80, fullMark: 150 },
      { subject: 'Logic', A: 90, fullMark: 150 },
      { subject: 'Design', A: 120, fullMark: 150 },
      { subject: 'Comms', A: 90, fullMark: 150 },
      { subject: 'AI', A: 60, fullMark: 150 },
      { subject: 'Math', A: 70, fullMark: 150 },
    ],
    analysis: {
        cognitiveStyle: 'Creative',
        learningVelocity: 'Variable',
        consistencyScore: 45,
        keyInsight: "Thiên hướng học tập trực quan (Visual Learner). Chỉ số Focus thấp, dễ bị xao nhãng bởi các chi tiết kỹ thuật khô khan.",
        gapAnalysis: "Thiếu nền tảng cấu trúc dữ liệu. Việc học đang bị phân mảnh (Fragmented Knowledge), hiểu bề mặt nhưng không kết nối được các khái niệm.",
        actionPlan: {
            immediate: "Áp dụng phương pháp 'Micro-learning': Chia nhỏ bài giảng thành các video 3-5 phút. Kèm theo Gamification để duy trì hứng thú.",
            longTerm: "Chuyển hướng sang Generative AI & Art. Sử dụng thế mạnh Design để tiếp cận AI từ góc độ ứng dụng sáng tạo."
        }
    },
    isAssigned: true
  },
  {
    id: 4,
    name: "Phạm Minh Dung",
    email: "dung.pham@example.com",
    course: "AI Fundamentals",
    progress: 92,
    avgScore: 9.5,
    adaptiveScore: "High",
    avatar: "https://i.pravatar.cc/150?u=9",
    radarData: [
      { subject: 'Coding', A: 145, fullMark: 150 },
      { subject: 'Logic', A: 140, fullMark: 150 },
      { subject: 'Design', A: 130, fullMark: 150 },
      { subject: 'Comms', A: 125, fullMark: 150 },
      { subject: 'AI', A: 150, fullMark: 150 },
      { subject: 'Math', A: 148, fullMark: 150 },
    ],
    analysis: {
        cognitiveStyle: 'Practical',
        learningVelocity: 'Fast',
        consistencyScore: 98,
        keyInsight: "Hồ sơ năng lực toàn diện (Holistic Profile). Có khả năng tự điều chỉnh (Self-regulation) cực cao trong quá trình học.",
        gapAnalysis: "Chưa gặp thách thức đủ lớn. Dữ liệu cho thấy học viên đang ở vùng an toàn (Comfort Zone), tốc độ hoàn thành bài tập quá nhanh so với mức chuẩn.",
        actionPlan: {
            immediate: "Kích hoạt chế độ 'Advanced Track': Bỏ qua các bài giảng lý thuyết cơ bản, giao bài toán thực tế của doanh nghiệp.",
            longTerm: "Định hướng trở thành Mentor hoặc Teaching Assistant để rèn luyện kỹ năng lãnh đạo."
        }
    },
    isAssigned: false
  },
  {
    id: 5,
    name: "Vũ Tuấn Tú",
    email: "tu.vu@example.com",
    course: "AI Fundamentals",
    progress: 75,
    avgScore: 7.8,
    adaptiveScore: "Medium",
    avatar: "https://i.pravatar.cc/150?u=12",
    radarData: [
      { subject: 'Coding', A: 110, fullMark: 150 },
      { subject: 'Logic', A: 100, fullMark: 150 },
      { subject: 'Design', A: 90, fullMark: 150 },
      { subject: 'Comms', A: 110, fullMark: 150 },
      { subject: 'AI', A: 95, fullMark: 150 },
      { subject: 'Math', A: 90, fullMark: 150 },
    ],
    analysis: {
        cognitiveStyle: 'Practical',
        learningVelocity: 'Steady',
        consistencyScore: 85,
        keyInsight: "Cần cù bù thông minh (Gritty Learner). Tốc độ xử lý thông tin trung bình nhưng độ bền bỉ cao.",
        gapAnalysis: "Hiệu suất làm bài giảm sút khi gặp áp lực thời gian (Time-constraint anxiety). Có xu hướng over-thinking ở các câu hỏi đơn giản.",
        actionPlan: {
            immediate: "Luyện tập 'Timed Mock Tests' với độ khó tăng dần để quen áp lực. Dạy kỹ thuật loại trừ đáp án nhanh.",
            longTerm: "Tập trung vào các dự án dài hạn (Capstone Projects) nơi sự kiên trì phát huy tác dụng hơn là tốc độ phản xạ."
        }
    },
    isAssigned: false
  },
];

const DEFAULT_CONTENT: ContentItem[] = [
  { id: '1', title: 'Giới thiệu về Trí tuệ nhân tạo', type: 'video', status: 'published', category: 'AI Basics', author: 'Admin', lastModified: '2024-03-10', duration: '10:35', views: 1200 },
  { id: '2', title: 'Tài liệu hướng dẫn Python Setup', type: 'document', status: 'published', category: 'Programming', author: 'Admin', lastModified: '2024-03-11', views: 850 },
  { id: '3', title: 'Lịch sử phát triển AI', type: 'article', status: 'draft', category: 'History', author: 'Editor A', lastModified: '2024-03-12' },
  { id: '4', title: 'Deep Learning vs Machine Learning', type: 'video', status: 'published', category: 'Deep Learning', author: 'Admin', lastModified: '2024-03-15', duration: '15:20', views: 2300 },
  { id: '5', title: 'Bài tập thực hành số 1', type: 'document', status: 'archived', category: 'Exercises', author: 'Admin', lastModified: '2024-02-20', views: 500 },
];

const DEFAULT_FRAMEWORKS: CompetencyFramework[] = [
  {
    id: "fw_digital_ai_01",
    name: "Khung năng lực Công nghệ số & AI",
    type: "Target",
    subjects: [
      {
        id: "subj_ai_fund",
        name: "Kiến thức nền tảng AI",
        description: "Hiểu biết về các khái niệm, lịch sử và phân loại trí tuệ nhân tạo.",
        levels: [
          { level: 1, name: "Nhận biết", description: "Nhận diện được các thuật ngữ AI cơ bản." },
          { level: 2, name: "Hiểu biết", description: "Phân biệt được AI hẹp, AI tổng quát và các loại hình học máy." },
          { level: 3, name: "Vận dụng", description: "Giải thích được cơ chế hoạt động của các mô hình AI phổ biến." },
          { level: 4, name: "Phân tích", description: "Đánh giá được tiềm năng và giới hạn của công nghệ AI hiện tại." },
          { level: 5, name: "Đánh giá", description: "Có tư duy chiến lược về lộ trình phát triển công nghệ." }
        ]
      },
      {
        id: "subj_prompt",
        name: "Prompt Engineering",
        description: "Kỹ năng ra lệnh và tối ưu hóa tương tác với các mô hình ngôn ngữ lớn (LLMs).",
        levels: [
          { level: 1, name: "Cơ bản", description: "Viết được câu lệnh đơn giản để lấy thông tin." },
          { level: 2, name: "Tối ưu context", description: "Biết cung cấp bối cảnh và vai trò cho AI." },
          { level: 3, name: "Kỹ thuật nâng cao", description: "Áp dụng Chain-of-Thought, Few-shot prompting." },
          { level: 4, name: "Tinh chỉnh", description: "Phân tích và sửa lỗi prompt để đạt kết quả chính xác." },
          { level: 5, name: "Hệ thống hóa", description: "Xây dựng thư viện prompt mẫu cho doanh nghiệp." }
        ]
      },
      {
        id: "subj_content",
        name: "Sáng tạo nội dung số",
        description: "Ứng dụng AI để tạo văn bản, hình ảnh, video và các tài liệu số.",
        levels: [
          { level: 1, name: "Hỗ trợ viết", description: "Dùng AI để soạn thảo email, văn bản ngắn." },
          { level: 2, name: "Tạo hình ảnh", description: "Sử dụng công cụ Text-to-Image cơ bản." },
          { level: 3, name: "Đa phương tiện", description: "Kết hợp văn bản, hình ảnh và âm thanh AI tạo ra." },
          { level: 4, name: "Tự động hóa", description: "Xây dựng quy trình sản xuất nội dung tự động." },
          { level: 5, name: "Sáng tạo nghệ thuật", description: "Tạo ra các tác phẩm số phức tạp có giá trị thẩm mỹ cao." }
        ]
      },
      {
        id: "subj_ethics",
        name: "Đạo đức & Pháp luật AI",
        description: "Nhận thức về an toàn, quyền riêng tư và trách nhiệm khi sử dụng AI.",
        levels: [
          { level: 1, name: "Nhận diện rủi ro", description: "Biết về các rủi ro lừa đảo, tin giả (Deepfake)." },
          { level: 2, name: "Quyền riêng tư", description: "Hiểu cách bảo vệ dữ liệu cá nhân khi dùng AI." },
          { level: 3, name: "Bản quyền", description: "Hiểu về vấn đề sở hữu trí tuệ trong nội dung AI." },
          { level: 4, name: "Tuân thủ", description: "Áp dụng đúng các quy định pháp luật hiện hành." },
          { level: 5, name: "Xây dựng chính sách", description: "Đề xuất quy tắc ứng xử đạo đức cho tổ chức." }
        ]
      },
      {
        id: "subj_data",
        name: "Phân tích dữ liệu số",
        description: "Kỹ năng thu thập, xử lý và ra quyết định dựa trên dữ liệu.",
        levels: [
          { level: 1, name: "Đọc hiểu", description: "Hiểu các biểu đồ báo cáo cơ bản." },
          { level: 2, name: "Thu thập", description: "Biết cách tìm kiếm và tổng hợp dữ liệu từ nhiều nguồn." },
          { level: 3, name: "Xử lý", description: "Sử dụng công cụ để làm sạch và tổ chức dữ liệu." },
          { level: 4, name: "Trực quan hóa", description: "Tạo dashboard báo cáo dữ liệu sinh động." },
          { level: 5, name: "Dự báo", description: "Sử dụng mô hình dự báo để ra quyết định chiến lược." }
        ]
      }
    ]
  }
];

const DEFAULT_AI_CONFIG: AIConfig = {
    model: 'gemini-3-pro-preview',
    temperature: 0.7,
    systemInstruction: "Bạn là My, trợ lý AI hỗ trợ học tập tại VTC Education. Hãy trả lời ngắn gọn, thân thiện và hữu ích. Tập trung vào việc giải thích các khái niệm phức tạp một cách đơn giản.",
    isActive: true
};
const DEFAULT_CHAT_LOGS: ChatSessionLog[] = [
    { id: '1', userName: 'Nguyễn Văn An', startTime: '2024-03-20 10:30', messageCount: 12, sentiment: 'Positive', topics: ['Python', 'Error Handling'] },
    { id: '2', userName: 'Trần Thị Bình', startTime: '2024-03-20 11:15', messageCount: 5, sentiment: 'Neutral', topics: ['Schedule', 'Course Info'] },
    { id: '3', userName: 'Lê Hoàng Cường', startTime: '2024-03-19 15:45', messageCount: 24, sentiment: 'Positive', topics: ['Deep Learning', 'Project Help'] },
    { id: '4', userName: 'Guest User', startTime: '2024-03-19 09:00', messageCount: 2, sentiment: 'Negative', topics: ['Login Issue'] },
];

const DEFAULT_KNOWLEDGE: KnowledgeBaseItem[] = [
    { id: '1', name: 'AI_Core_Principles.pdf', type: 'pdf', size: '2.4 MB', uploadDate: '2024-03-15', status: 'trained', tags: { subject: 'AI Fundamentals', level: 'Level 1' } },
    { id: '2', name: 'Python_Advanced_Patterns.pdf', type: 'pdf', size: '1.1 MB', uploadDate: '2024-03-18', status: 'processing', tags: { subject: 'Coding', level: 'Level 3' } },
    { id: '3', name: 'VTC_Code_Conduct.docx', type: 'doc', size: '0.5 MB', uploadDate: '2024-03-19', status: 'trained', tags: { subject: 'Ethics', level: 'All' } },
];

const STORAGE_KEYS = {
  QUESTIONS: 'cms_questions',
  NODES: 'cms_nodes',
  LEARNERS: 'cms_learners',
  CONTENT: 'cms_content',
  FRAMEWORKS: 'cms_frameworks',
  AI_CONFIG: 'cms_ai_config',
  CHAT_LOGS: 'cms_chat_logs',
  KNOWLEDGE: 'cms_knowledge',
  GAP_ANALYSIS: 'cms_gap_analysis'
};

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const CMSService = {
  // --- Assessment Engine ---
  
  getQuestions: async (): Promise<Question[]> => {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEYS.QUESTIONS);
    if (stored) return JSON.parse(stored);
    
    // Seed if empty
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(DEFAULT_QUESTIONS));
    return DEFAULT_QUESTIONS;
  },

  addQuestion: async (question: Omit<Question, 'id'>): Promise<Question> => {
    await delay(300);
    const questions = await CMSService.getQuestions();
    const newQuestion = { ...question, id: Date.now().toString() };
    const updated = [newQuestion, ...questions];
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
    return newQuestion;
  },

  updateQuestion: async (updatedQuestion: Question): Promise<Question> => {
    await delay(300);
    const questions = await CMSService.getQuestions();
    const index = questions.findIndex(q => q.id === updatedQuestion.id);
    if (index !== -1) {
        questions[index] = updatedQuestion;
        localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(questions));
    }
    return updatedQuestion;
  },

  deleteQuestion: async (id: string): Promise<boolean> => {
    await delay(200);
    const questions = await CMSService.getQuestions();
    const updated = questions.filter(q => q.id !== id);
    localStorage.setItem(STORAGE_KEYS.QUESTIONS, JSON.stringify(updated));
    return true;
  },

  generateTestPreview: async (config: { total: number; distribution: { easy: number; medium: number; hard: number } }) => {
    // Logic to select questions based on distribution (Mocked logic)
    await delay(600);
    const all = await CMSService.getQuestions();
    // Return a random subset for demo
    // In a real app, this would filter by difficulty percentages
    return all.sort(() => 0.5 - Math.random()).slice(0, Math.min(all.length, config.total));
  },

  // --- Adaptive Course Builder ---

  getWorkflow: async (): Promise<AdaptiveNode[]> => {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEYS.NODES);
    if (stored) return JSON.parse(stored);
    
    localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(DEFAULT_NODES));
    return DEFAULT_NODES;
  },

  saveWorkflow: async (nodes: AdaptiveNode[]): Promise<boolean> => {
    await delay(500);
    localStorage.setItem(STORAGE_KEYS.NODES, JSON.stringify(nodes));
    return true;
  },

  // --- Learner Analytics (LXP) ---
  
  getLearners: async (): Promise<LearnerProfile[]> => {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEYS.LEARNERS);
    if (stored) return JSON.parse(stored);
    
    localStorage.setItem(STORAGE_KEYS.LEARNERS, JSON.stringify(DEFAULT_LEARNERS));
    return DEFAULT_LEARNERS;
  },

  updateLearner: async (learner: LearnerProfile): Promise<boolean> => {
    await delay(200);
    const learners = await CMSService.getLearners();
    const index = learners.findIndex(l => l.id === learner.id);
    if (index !== -1) {
      learners[index] = learner;
      localStorage.setItem(STORAGE_KEYS.LEARNERS, JSON.stringify(learners));
      return true;
    }
    return false;
  },

  // --- Content Management ---

  getContent: async (): Promise<ContentItem[]> => {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEYS.CONTENT);
    if (stored) return JSON.parse(stored);
    
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(DEFAULT_CONTENT));
    return DEFAULT_CONTENT;
  },

  addContent: async (content: Omit<ContentItem, 'id' | 'lastModified' | 'views'>): Promise<ContentItem> => {
    await delay(400);
    const items = await CMSService.getContent();
    const newItem: ContentItem = { 
        ...content, 
        id: Date.now().toString(), 
        lastModified: new Date().toISOString().split('T')[0],
        views: 0 
    };
    const updated = [newItem, ...items];
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
    return newItem;
  },

  updateContent: async (updatedContent: ContentItem): Promise<ContentItem> => {
    await delay(300);
    const items = await CMSService.getContent();
    const index = items.findIndex(c => c.id === updatedContent.id);
    if (index !== -1) {
        items[index] = { ...updatedContent, lastModified: new Date().toISOString().split('T')[0] };
        localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(items));
    }
    return updatedContent;
  },

  deleteContent: async (id: string): Promise<boolean> => {
    await delay(200);
    const items = await CMSService.getContent();
    const updated = items.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CONTENT, JSON.stringify(updated));
    return true;
  },

  // --- Competency Framework ---
  getFrameworks: async (): Promise<CompetencyFramework[]> => {
    await delay(300);
    const stored = localStorage.getItem(STORAGE_KEYS.FRAMEWORKS);
    return stored ? JSON.parse(stored) : DEFAULT_FRAMEWORKS;
  },

  saveFramework: async (framework: CompetencyFramework): Promise<CompetencyFramework> => {
      await delay(300);
      const list = await CMSService.getFrameworks();
      const idx = list.findIndex(f => f.id === framework.id);
      let updated;
      if (idx !== -1) {
          list[idx] = framework;
          updated = list;
      } else {
          updated = [...list, framework];
      }
      localStorage.setItem(STORAGE_KEYS.FRAMEWORKS, JSON.stringify(updated));
      return framework;
  },

  deleteFramework: async (id: string): Promise<boolean> => {
      const list = await CMSService.getFrameworks();
      const updated = list.filter(f => f.id !== id);
      localStorage.setItem(STORAGE_KEYS.FRAMEWORKS, JSON.stringify(updated));
      return true;
  },

  // --- Mentor AI Management ---
  getAIConfig: async (): Promise<AIConfig> => {
      await delay(200);
      const stored = localStorage.getItem(STORAGE_KEYS.AI_CONFIG);
      return stored ? JSON.parse(stored) : DEFAULT_AI_CONFIG;
  },

  saveAIConfig: async (config: AIConfig): Promise<boolean> => {
      await delay(300);
      localStorage.setItem(STORAGE_KEYS.AI_CONFIG, JSON.stringify(config));
      return true;
  },

  getChatLogs: async (): Promise<ChatSessionLog[]> => {
      await delay(400);
      const stored = localStorage.getItem(STORAGE_KEYS.CHAT_LOGS);
      return stored ? JSON.parse(stored) : DEFAULT_CHAT_LOGS;
  },

  getKnowledgeBase: async (): Promise<KnowledgeBaseItem[]> => {
      await delay(300);
      const stored = localStorage.getItem(STORAGE_KEYS.KNOWLEDGE);
      return stored ? JSON.parse(stored) : DEFAULT_KNOWLEDGE;
  },

  addKnowledgeItem: async (item: Omit<KnowledgeBaseItem, 'id' | 'uploadDate' | 'status'>): Promise<KnowledgeBaseItem> => {
      await delay(500);
      const list = await CMSService.getKnowledgeBase();
      const newItem: KnowledgeBaseItem = {
          ...item,
          id: Date.now().toString(),
          uploadDate: new Date().toISOString().split('T')[0],
          status: 'processing'
      };
      // Simulate processing time - Shortened to 2 seconds for demo
      setTimeout(() => {
          newItem.status = 'trained';
          const currentList = JSON.parse(localStorage.getItem(STORAGE_KEYS.KNOWLEDGE) || '[]');
          const idx = currentList.findIndex((i: KnowledgeBaseItem) => i.id === newItem.id);
          if (idx !== -1) {
              currentList[idx].status = 'trained';
              localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(currentList));
          }
      }, 2000);

      const updated = [...list, newItem];
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(updated));
      return newItem;
  },

  deleteKnowledgeItem: async (id: string): Promise<boolean> => {
      await delay(200);
      const list = await CMSService.getKnowledgeBase();
      const updated = list.filter(i => i.id !== id);
      localStorage.setItem(STORAGE_KEYS.KNOWLEDGE, JSON.stringify(updated));
      return true;
  },

  // --- Entry Test & Gap Analysis ---
  
  generateEntryTest: async (): Promise<Question[]> => {
      // Get random 5 questions from QBank for demo
      await delay(500);
      return DEFAULT_QUESTIONS.slice(0, 5);
  },

  submitEntryTest: async (score: number): Promise<GapAnalysis[]> => {
      await delay(800);
      // Simulate Gap Analysis calculation based on score
      // Score 0-5 (number of correct answers)
      
      const gaps: GapAnalysis[] = [
          { subject: 'AI Fundamentals', currentScore: score > 3 ? 80 : 40, targetScore: 100, gap: score > 3 ? 20 : 60, recommendation: 'Cần ôn tập kiến thức cơ bản về AI.' },
          { subject: 'Python Coding', currentScore: score > 2 ? 70 : 30, targetScore: 90, gap: score > 2 ? 20 : 60, recommendation: 'Luyện tập thêm bài tập cấu trúc dữ liệu.' },
          { subject: 'Math for AI', currentScore: score > 4 ? 85 : 50, targetScore: 95, gap: score > 4 ? 10 : 45, recommendation: 'Củng cố kiến thức Đại số tuyến tính.' },
      ];
      
      localStorage.setItem(STORAGE_KEYS.GAP_ANALYSIS, JSON.stringify(gaps));
      return gaps;
  },

  getGapAnalysis: async (): Promise<GapAnalysis[]> => {
      const stored = localStorage.getItem(STORAGE_KEYS.GAP_ANALYSIS);
      return stored ? JSON.parse(stored) : [];
  },

  // --- Dashboard Analytics ---

  getStats: async (): Promise<DashboardStats> => {
    await delay(400);
    // In a real app, this would aggregate data from the user DB
    return {
      activeUsers: 12345,
      completions: 8124,
      adaptiveTriggers: 1432,
      engagement: '45m',
      chartData: [
        { name: 'Mon', active: 4000, completion: 2400 },
        { name: 'Tue', active: 3000, completion: 1398 },
        { name: 'Wed', active: 2000, completion: 9800 },
        { name: 'Thu', active: 2780, completion: 3908 },
        { name: 'Fri', active: 1890, completion: 4800 },
        { name: 'Sat', active: 2390, completion: 3800 },
        { name: 'Sun', active: 3490, completion: 4300 },
      ]
    };
  }
};

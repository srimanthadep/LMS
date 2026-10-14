import {
  Course,
  Batch,
  LiveClassSession,
  LectureRecording,
  StudentDoubt,
  TestSubmission,
  SupportTicket,
  PaymentTransaction,
  CertificateRecord,
  AuditLogEntry,
} from "@/types/lms";

export const MOCK_COURSES: Course[] = [
  {
    id: "course-ai-eng",
    title: "Full-Stack AI & LLM Systems Engineering",
    slug: "full-stack-ai-engineering",
    description: "Architect and deploy production LLM applications, RAG pipelines, fine-tuned models, and scalable GPU backends.",
    category: "LLM Engineering",
    level: "Advanced",
    modulesCount: 12,
    totalHours: 84,
    rating: 4.9,
    enrolledStudentsCount: 340,
    thumbnail: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    priceRupees: 64999,
    status: "active",
  },
  {
    id: "course-agents",
    title: "Autonomous Multi-Agent Architectures",
    slug: "autonomous-multi-agent-architectures",
    description: "Design coordinating agent swarms with memory, tool routing, human-in-the-loop oversight, and resilient recovery.",
    category: "Agentic Systems",
    level: "Intermediate",
    modulesCount: 8,
    totalHours: 56,
    rating: 4.85,
    enrolledStudentsCount: 220,
    thumbnail: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&auto=format&fit=crop&q=80",
    priceRupees: 49999,
    status: "active",
  },
  {
    id: "course-genai-vision",
    title: "Diffusion Models & Generative Vision",
    slug: "diffusion-models-vision",
    description: "Deep dive into latent diffusion, ControlNet conditioning, LoRA adapters, and real-time visual neural synthesis.",
    category: "Computer Vision",
    level: "Advanced",
    modulesCount: 10,
    totalHours: 70,
    rating: 4.92,
    enrolledStudentsCount: 180,
    thumbnail: "https://images.unsplash.com/photo-1633493106115-fa431f4713e7?w=800&auto=format&fit=crop&q=80",
    priceRupees: 54999,
    status: "active",
  },
  {
    id: "course-mlops",
    title: "Production MLOps & Vector Infrastructure",
    slug: "production-mlops-vector-infra",
    description: "Containerization, Kubernetes GPU scheduling, Milvus/Qdrant vector indexes, and continuous evaluation frameworks.",
    category: "MLOps",
    level: "Intermediate",
    modulesCount: 8,
    totalHours: 48,
    rating: 4.78,
    enrolledStudentsCount: 150,
    thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    priceRupees: 44999,
    status: "active",
  },
];

export const MOCK_BATCHES: Batch[] = [
  {
    id: "batch-c7-live",
    courseId: "course-ai-eng",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    name: "Cohort 7 (Live Synchronous + Replays)",
    cohortCode: "AI-ENG-C7",
    startDate: "01 Sep 2026",
    endDate: "31 Dec 2026",
    teacherId: "usr-teacher-1",
    teacherName: "Prof. Rajesh Verma",
    maxSeats: 120,
    enrolledCount: 112,
    status: "active",
    entitlement: {
      accessType: "live_and_replay",
      replayReleaseDelayHours: 0,
      accessExpiryDate: "31 Dec 2026",
      allowLiveChat: true,
      allowDoubts: true,
      allowAiTutor: true,
      allowCertificates: true,
    },
  },
  {
    id: "batch-c8-replay",
    courseId: "course-ai-eng",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    name: "Cohort 8 (Self-Paced Replay-Only Access)",
    cohortCode: "AI-ENG-C8-RO",
    startDate: "15 Sep 2026",
    endDate: "31 Mar 2027",
    teacherId: "usr-teacher-1",
    teacherName: "Prof. Rajesh Verma",
    maxSeats: 250,
    enrolledCount: 185,
    status: "active",
    entitlement: {
      accessType: "replay_only",
      replayReleaseDelayHours: 24, // 24-hour delay release
      accessExpiryDate: "31 Mar 2027",
      allowLiveChat: false,
      allowDoubts: true,
      allowAiTutor: true,
      allowCertificates: true,
    },
  },
  {
    id: "batch-agents-c3",
    courseId: "course-agents",
    courseTitle: "Autonomous Multi-Agent Architectures",
    name: "Agentic Systems Bootcamp (Weekend Cohort)",
    cohortCode: "AGT-WKND-C3",
    startDate: "10 Oct 2026",
    endDate: "15 Jan 2027",
    teacherId: "usr-teacher-1",
    teacherName: "Prof. Rajesh Verma",
    maxSeats: 80,
    enrolledCount: 78,
    status: "active",
    entitlement: {
      accessType: "live_and_replay",
      replayReleaseDelayHours: 0,
      accessExpiryDate: "15 Jan 2027",
      allowLiveChat: true,
      allowDoubts: true,
      allowAiTutor: true,
      allowCertificates: true,
    },
  },
];

export const MOCK_LIVE_CLASSES: LiveClassSession[] = [
  {
    id: "class-agentic-101",
    batchId: "batch-agents-c3",
    batchName: "Agentic Systems Bootcamp",
    courseTitle: "Autonomous Multi-Agent Architectures",
    title: "Session 4: Multi-Agent Consensus & Hierarchical Supervision",
    description: "Designing supervisor agents, reflection loops, and resilient state machines in LangGraph.",
    instructorId: "usr-teacher-1",
    instructorName: "Prof. Rajesh Verma",
    scheduledAt: "Today, 06:30 PM IST",
    durationMinutes: 90,
    status: "live",
    viewerCount: 72,
    activeTopic: "Hierarchical Supervisor Node Execution",
    confusionCount: 3,
    handRaisesCount: 2,
  },
  {
    id: "class-rag-scale",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live + Replay)",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    title: "Session 9: Hybrid Search, Reranking & Lost-in-the-Middle Mitigation",
    description: "Combining BM25 keyword search with dense HNSW vectors, Cohere rerankers, and contextual compression.",
    instructorId: "usr-teacher-1",
    instructorName: "Prof. Rajesh Verma",
    scheduledAt: "Tomorrow, 08:00 PM IST",
    durationMinutes: 90,
    status: "scheduled",
    viewerCount: 0,
  },
  {
    id: "class-diffusion-math",
    batchId: "batch-c7-live",
    batchName: "Cohort 7 (Live + Replay)",
    courseTitle: "Diffusion Models & Generative Vision",
    title: "Session 12: Noise Schedulers & Classifier-Free Guidance (CFG)",
    description: "Mathematical derivation of DDPM variance schedules and conditioning vectors.",
    instructorId: "usr-teacher-1",
    instructorName: "Prof. Rajesh Verma",
    scheduledAt: "16 Oct 2026, 07:00 PM IST",
    durationMinutes: 120,
    status: "scheduled",
    viewerCount: 0,
  },
];

export const MOCK_RECORDINGS: LectureRecording[] = [
  {
    id: "rep-rag-8",
    classId: "class-prev-8",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    title: "Lecture 8: Vector Databases, Chunking Strategies & Embedding Alignment",
    durationFormatted: "01:28:45",
    publishedAt: "Yesterday, 09:30 PM",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    pdfNotesUrl: "/assets/notes-lecture-8.pdf",
    dppAttachmentUrl: "/assets/dpp-practice-8.pdf",
    status: "published",
    aiSummary: "In this comprehensive lecture, Prof. Verma introduced embedding chunking heuristics (recursive character splitting vs. semantic windowing), vector indexing structures (HNSW vs IVF-PQ), cosine similarity metric nuances, and mitigation of embedding drift in production.",
    keyConcepts: [
      "Recursive Character Chunking (500 tokens with 50-token overlap)",
      "Hierarchical Navigable Small World (HNSW) graph indexing",
      "Cosine Similarity vs Inner Product normalization",
      "Embedding drift monitoring with Kolmogorov-Smirnov test",
    ],
    chapters: [
      {
        id: "ch-1",
        timestampSeconds: 0,
        timestampFormatted: "00:00:00",
        title: "Introduction & Context of Semantic Retrieval",
        summary: "Overview of limitations with standard lexical search and motivation for dense vector representations.",
        keyKeywords: ["Overview", "Vector Space", "Recall"],
      },
      {
        id: "ch-2",
        timestampSeconds: 525,
        timestampFormatted: "00:08:45",
        title: "Chunking Heuristics: Fixed vs Semantic Boundaries",
        summary: "Why fixed character chunking breaks mid-sentence and how semantic boundary tokenization preserves intent.",
        keyKeywords: ["Tokenization", "Chunk Size", "Overlap"],
      },
      {
        id: "ch-3",
        timestampSeconds: 1458,
        timestampFormatted: "00:24:18",
        title: "HNSW Graph Construction & Recall-Latency Tradeoffs",
        summary: "Mathematical mechanics of multi-layer skip-list graphs in high-dimensional vector spaces.",
        keyKeywords: ["HNSW", "efSearch", "Index Time"],
      },
      {
        id: "ch-4",
        timestampSeconds: 2790,
        timestampFormatted: "00:46:30",
        title: "Mitigating Lost-in-the-Middle with Context Reranking",
        summary: "How cross-encoders reorder candidate vectors before injecting them into the LLM context prompt.",
        keyKeywords: ["Reranking", "Cross-Encoder", "Context Window"],
      },
      {
        id: "ch-5",
        timestampSeconds: 4330,
        timestampFormatted: "01:12:10",
        title: "Live Q&A: Inverted File Index vs Graph Indexes",
        summary: "Student doubts answered on memory footprint tradeoffs between Milvus, Qdrant, and pgvector.",
        keyKeywords: ["pgvector", "Memory Consumption", "SLA"],
      },
    ],
    transcript: [
      {
        id: "tr-1",
        timestampSeconds: 15,
        timestampFormatted: "00:00:15",
        speaker: "Prof. Verma",
        text: "Good evening everyone. Welcome to session eight. Today we tackle the core bottleneck in real-world LLM systems: vector retrieval precision.",
      },
      {
        id: "tr-2",
        timestampSeconds: 540,
        timestampFormatted: "00:09:00",
        speaker: "Prof. Verma",
        text: "When you blindly chunk documents at 500 characters, sentences get split across two vectors. The embeddings become diluted. Always chunk along natural paragraph breaks with a 10% overlap.",
      },
      {
        id: "tr-3",
        timestampSeconds: 1465,
        timestampFormatted: "00:24:25",
        speaker: "Prof. Verma",
        text: "Notice that HNSW creates hierarchical layers like an express subway system. Upper layers have sparse long-distance leaps, while the bottom layer has dense local clusters.",
      },
      {
        id: "tr-4",
        timestampSeconds: 2800,
        timestampFormatted: "00:46:40",
        speaker: "Prof. Verma",
        text: "If you feed 20 retrieved chunks directly to Claude or GPT-4, the model attends heavily to the start and end of the prompt. This is the documented lost-in-the-middle phenomenon.",
      },
      {
        id: "tr-5",
        timestampSeconds: 4345,
        timestampFormatted: "01:12:25",
        speaker: "Student Query",
        text: "Sir, when should we use IVF-PQ instead of HNSW in a memory-constrained production environment?",
      },
      {
        id: "tr-6",
        timestampSeconds: 4360,
        timestampFormatted: "01:12:40",
        speaker: "Prof. Verma",
        text: "Great question! When your vectors exceed RAM limits, Product Quantization (PQ) compresses 1536-dim floats down to 8-bit centroids, reducing memory by up to 80% at a slight cost in recall.",
      },
    ],
  },
  {
    id: "rep-langgraph-7",
    classId: "class-prev-7",
    courseTitle: "Autonomous Multi-Agent Architectures",
    title: "Lecture 3: LangGraph State Graphs & Human-in-the-Loop Interrupts",
    durationFormatted: "01:15:30",
    publishedAt: "3 days ago",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    status: "published",
    aiSummary: "Exploration of cyclic execution graphs, thread-based checkpoint memory, and interrupt patterns allowing human review before executing sensitive external API tools.",
    keyConcepts: [
      "StateGraph message history reducers",
      "Checkpointer persistence with SQLite & Postgres",
      "Human-in-the-loop breakpoint execution",
    ],
    chapters: [
      {
        id: "ch-lg-1",
        timestampSeconds: 0,
        timestampFormatted: "00:00:00",
        title: "From Linear DAGs to Stateful Cyclic Graphs",
        summary: "Why real-world agent collaboration requires cycles rather than acyclic pipelines.",
        keyKeywords: ["Cyclic Graphs", "LangGraph"],
      },
      {
        id: "ch-lg-2",
        timestampSeconds: 1200,
        timestampFormatted: "00:20:00",
        title: "Configuring Dynamic Breakpoints for Approval",
        summary: "Implementing interrupts before high-cost tool calls or irreversible database writes.",
        keyKeywords: ["Interrupts", "Approvals"],
      },
    ],
    transcript: [
      {
        id: "tr-lg-1",
        timestampSeconds: 10,
        timestampFormatted: "00:00:10",
        speaker: "Prof. Verma",
        text: "Welcome back. Today we transition from naive chain execution to stateful cyclic agent graphs.",
      },
    ],
  },
];

export const MOCK_DOUBTS: StudentDoubt[] = [
  {
    id: "doubt-1",
    studentId: "usr-student-1",
    studentName: "Arjun Mehta",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    classTitle: "Lecture 8: Vector Databases & Chunking",
    timestampSeconds: 1458,
    timestampFormatted: "00:24:18",
    question: "How does the efSearch parameter in HNSW affect latency versus recall during high concurrency?",
    status: "ai_answered",
    aiAnswer: "Based on Lecture 8 @ 00:24:18: HNSW's `efSearch` controls the size of the dynamic candidate list evaluated during query exploration. A higher `efSearch` explores deeper branches in the graph, increasing recall at the expense of query latency. In production, an `efSearch` of 64-128 typically achieves 98%+ recall with under 15ms latency.",
    createdAt: "2 hours ago",
  },
  {
    id: "doubt-2",
    studentId: "usr-student-2",
    studentName: "Pooja Hegde",
    courseTitle: "Autonomous Multi-Agent Architectures",
    batchName: "Agentic Systems Bootcamp",
    classTitle: "Lecture 3: LangGraph State Graphs",
    timestampSeconds: 1200,
    timestampFormatted: "00:20:00",
    question: "Can an interrupt in LangGraph persist across server restarts if the client disconnects?",
    status: "teacher_replied",
    teacherReply: "Yes Pooja! Because LangGraph relies on the thread checkpointer (e.g. Postgres or Redis Saver), the complete state snapshot is persisted in the DB. When the client reconnects, you simply resume the thread ID with the human approval payload.",
    createdAt: "Yesterday",
  },
  {
    id: "doubt-3",
    studentId: "usr-student-3",
    studentName: "Rohan Nair",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    classTitle: "Lecture 8: Vector Databases & Chunking",
    timestampSeconds: 2790,
    timestampFormatted: "00:46:30",
    question: "Is Cohere Rerank v3 faster than a locally hosted BGE-Reranker-Large?",
    status: "open",
    createdAt: "30 mins ago",
  },
];

export const MOCK_SUBMISSIONS: TestSubmission[] = [
  {
    id: "sub-1",
    testId: "test-rag-eval",
    testTitle: "Milestone 2: Hybrid RAG System with Cohere Rerank",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    studentId: "usr-student-1",
    studentName: "Candidate #4810 (Blind Graded)",
    submittedAt: "12 Oct 2026, 04:30 PM",
    status: "graded",
    objectiveScore: 40,
    objectiveMaxScore: 40,
    codeSubmission: `import os
from langchain_community.vectorstores import Qdrant
from langchain_cohere import CohereRerank
from langchain.retrievers import ContextualCompressionRetriever

def build_hybrid_pipeline(embeddings, client):
    vector_retriever = Qdrant(
        client=client,
        collection_name="enterprise_docs",
        embeddings=embeddings
    ).as_retriever(search_kwargs={"k": 25})
    
    compressor = CohereRerank(model="rerank-english-v3.0", top_n=5)
    return ContextualCompressionRetriever(
        base_compressor=compressor,
        base_retriever=vector_retriever
    )`,
    descriptiveAnswers: [
      {
        question: "Explain your rationale for choosing top_n=5 after reranking 25 initial candidates.",
        answer: "Initial vector search casts a wide net with high recall (k=25). The cross-encoder then reranks by full contextual similarity. Limiting context to top 5 eliminates noisy background passages and prevents lost-in-the-middle degradation.",
      },
    ],
    rubricScores: [
      { id: "r1", criteria: "Vector Pipeline Architecture", maxScore: 20, score: 19, rationale: "Excellent clean implementation using Qdrant client." },
      { id: "r2", criteria: "Reranker Integration & Optimization", maxScore: 20, score: 18, rationale: "Proper compression wrapper with appropriate top_n constraints." },
      { id: "r3", criteria: "Lost-in-the-middle Mitigation Logic", maxScore: 10, score: 10, rationale: "Thorough conceptual understanding displayed." },
      { id: "r4", criteria: "Code Quality & Error Handling", maxScore: 10, score: 8, rationale: "Missing try/except block around Cohere API network timeouts." },
    ],
    aiSuggestedScore: 94,
    aiRationale: "High degree of alignment with reference solution. Passes 100% of synthetic test cases. Minor deduction for absence of exponential backoff retry wrapper on remote API call.",
    evaluatorFeedback: "Outstanding submission! Your separation of dense retrieval from the compression layer is production-grade. To improve further, wrap remote Cohere API calls in a tenacity retry decorator to handle transient rate limits.",
    totalScore: 95,
    maxScore: 100,
  },
  {
    id: "sub-2",
    testId: "test-agent-graph",
    testTitle: "Capstone 1: Multi-Agent Research Assistant with Human Oversight",
    courseTitle: "Autonomous Multi-Agent Architectures",
    batchName: "Agentic Systems Bootcamp",
    studentId: "usr-student-4",
    studentName: "Candidate #8219 (Blind Graded)",
    submittedAt: "13 Oct 2026, 09:15 PM",
    status: "pending",
    objectiveScore: 35,
    objectiveMaxScore: 40,
    codeSubmission: `# Supervisor Agent Node
from langgraph.graph import StateGraph, END

def supervisor_node(state):
    # Routing decision based on latest message
    return {"next": "researcher"}`,
    rubricScores: [
      { id: "r1", criteria: "Graph Topology & Node Design", maxScore: 25, score: 20, rationale: "Needs validation on terminal nodes" },
      { id: "r2", criteria: "Human Interrupt Implementation", maxScore: 25, score: 18, rationale: "Interrupt occurs before tool call" },
    ],
    aiSuggestedScore: 82,
    aiRationale: "Functional routing graph, but lacks fallback condition if researcher node returns malformed schema.",
    evaluatorFeedback: "",
    totalScore: 0,
    maxScore: 100,
  },
];

export const MOCK_TICKETS: SupportTicket[] = [
  {
    id: "tkt-1082",
    ticketNumber: "TKT-1082",
    studentId: "usr-student-1",
    studentName: "Arjun Mehta",
    studentEmail: "arjun.m@learner.ai",
    studentBatch: "Cohort 7 (Live + Replay)",
    category: "batch_change",
    priority: "medium",
    status: "open",
    assignedAgent: "Nikhil Joshi",
    subject: "Requesting move from Weekday Evening to Weekend Intensive cohort",
    createdAt: "Today, 09:30 AM",
    messages: [
      {
        id: "msg-1",
        sender: "Arjun Mehta",
        role: "student",
        message: "Hello Support Team, due to new office timings I am unable to attend the 8 PM weekday live lectures. Can I please be moved to the Weekend Cohort?",
        timestamp: "09:30 AM",
      },
      {
        id: "msg-2",
        sender: "Nikhil Joshi",
        role: "agent",
        message: "Hi Arjun, I have verified your attendance and course progress (78% completion). I am proposing a batch shift to Agentic Systems Weekend Cohort for Admin review. Your historical progress will be fully preserved.",
        timestamp: "10:15 AM",
      },
    ],
    proposedAction: {
      type: "batch_move",
      targetBatchName: "Agentic Systems Bootcamp (Weekend Cohort)",
      status: "proposed",
    },
  },
  {
    id: "tkt-1083",
    ticketNumber: "TKT-1083",
    studentId: "usr-student-5",
    studentName: "Simran Kaur",
    studentEmail: "simran.k@example.com",
    studentBatch: "Cohort 8 (Replay Only)",
    category: "extension",
    priority: "high",
    status: "pending",
    assignedAgent: "Nikhil Joshi",
    subject: "Medical pause: Requesting 30-day access validity extension",
    createdAt: "Yesterday, 02:40 PM",
    messages: [
      {
        id: "msg-3",
        sender: "Simran Kaur",
        role: "student",
        message: "I was hospitalized last week with dengue. Could my access expiry date be extended by 30 days so I can finish the milestones?",
        timestamp: "Yesterday, 02:40 PM",
      },
    ],
    proposedAction: {
      type: "validity_extension",
      extensionDays: 30,
      status: "proposed",
    },
  },
];

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    id: "txn-901",
    orderId: "order_Qz89104",
    paymentId: "pay_Kla98012",
    studentName: "Arjun Mehta",
    studentEmail: "arjun.m@learner.ai",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    amountRupees: 64999,
    status: "captured",
    method: "UPI (Google Pay)",
    date: "28 Aug 2026, 02:15 PM",
    invoiceNumber: "INV-2026-0891",
  },
  {
    id: "txn-902",
    orderId: "order_Qz89105",
    paymentId: "pay_Kla98013",
    studentName: "Pooja Hegde",
    studentEmail: "pooja.h@example.com",
    courseTitle: "Autonomous Multi-Agent Architectures",
    batchName: "Agentic Systems Bootcamp",
    amountRupees: 49999,
    status: "captured",
    method: "Razorpay NetBanking",
    date: "05 Oct 2026, 11:45 AM",
    invoiceNumber: "INV-2026-0924",
  },
  {
    id: "txn-903",
    orderId: "order_Qz89106",
    paymentId: "pay_Kla98014",
    studentName: "Devendra Patel",
    studentEmail: "dev.patel@tech.in",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 8 (Replay Only)",
    amountRupees: 39999,
    status: "captured",
    method: "Credit Card",
    date: "10 Oct 2026, 06:20 PM",
    invoiceNumber: "INV-2026-0955",
  },
];

export const MOCK_CERTIFICATES: CertificateRecord[] = [
  {
    id: "cert-2026-1",
    certificateNumber: "APEX-AI-2026-891",
    studentName: "Arjun Mehta",
    studentId: "usr-student-1",
    courseTitle: "Full-Stack AI & LLM Systems Engineering",
    batchName: "Cohort 7 (Live + Replay)",
    issueDate: "12 Oct 2026",
    verificationCode: "VF-9812-AI",
    gradeAwarded: "Distinction (95%)",
    pdfUrl: "/assets/cert-sample.pdf",
  },
];

export const MOCK_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: "log-1",
    actorName: "Dr. Vikram Sethi",
    actorRole: "Super Admin",
    action: "Updated OpenAI API Provider Endpoint",
    targetResource: "System Integrations",
    details: "Switched default LLM inference model to gpt-4o-2026-08-06 with 128k context.",
    ipAddress: "103.24.120.4",
    timestamp: "Today, 08:30 AM",
    status: "success",
  },
  {
    id: "log-2",
    actorName: "Ananya Iyer",
    actorRole: "Admin",
    action: "Approved Batch Move for Arjun Mehta",
    targetResource: "Batch: Agentic Systems Weekend",
    details: "Student moved from Cohort 7 Weekday to Weekend Bootcamp per ticket TKT-1082.",
    ipAddress: "49.207.210.15",
    timestamp: "Today, 10:20 AM",
    status: "success",
  },
  {
    id: "log-3",
    actorName: "System Security Sentinel",
    actorRole: "Automated",
    action: "Blocked Multiple Failed 2FA Attempts",
    targetResource: "usr-teacher-9",
    details: "5 consecutive invalid TOTP attempts detected from unknown IP.",
    ipAddress: "185.220.101.5",
    timestamp: "Yesterday, 11:45 PM",
    status: "warning",
  },
];

// Service with simulated updates
class MockDataService {
  getCourses() { return [...MOCK_COURSES]; }
  getBatches() { return [...MOCK_BATCHES]; }
  getLiveClasses() { return [...MOCK_LIVE_CLASSES]; }
  getRecordings() { return [...MOCK_RECORDINGS]; }
  getDoubts() { return [...MOCK_DOUBTS]; }
  getSubmissions() { return [...MOCK_SUBMISSIONS]; }
  getTickets() { return [...MOCK_TICKETS]; }
  getTransactions() { return [...MOCK_TRANSACTIONS]; }
  getCertificates() { return [...MOCK_CERTIFICATES]; }
  getAuditLogs() { return [...MOCK_AUDIT_LOGS]; }

  addDoubt(doubt: Omit<StudentDoubt, "id" | "createdAt">): StudentDoubt {
    const newDoubt: StudentDoubt = {
      ...doubt,
      id: `doubt-${Date.now()}`,
      createdAt: "Just now",
    };
    MOCK_DOUBTS.unshift(newDoubt);
    return newDoubt;
  }

  saveDraftGrade(submissionId: string, rubricScores: any[], feedback: string): boolean {
    const sub = MOCK_SUBMISSIONS.find((s) => s.id === submissionId);
    if (sub) {
      sub.rubricScores = rubricScores;
      sub.evaluatorFeedback = feedback;
      sub.status = "draft";
      return true;
    }
    return false;
  }

  submitGrade(submissionId: string, rubricScores: any[], feedback: string): boolean {
    const sub = MOCK_SUBMISSIONS.find((s) => s.id === submissionId);
    if (sub) {
      sub.rubricScores = rubricScores;
      sub.evaluatorFeedback = feedback;
      const total = rubricScores.reduce((acc, curr) => acc + (curr.score || 0), sub.objectiveScore);
      sub.totalScore = total;
      sub.status = "graded";
      return true;
    }
    return false;
  }

  updateTicketStatus(ticketId: string, status: "open" | "pending" | "resolved"): boolean {
    const ticket = MOCK_TICKETS.find((t) => t.id === ticketId);
    if (ticket) {
      ticket.status = status;
      return true;
    }
    return false;
  }
}

export const mockDataService = new MockDataService();

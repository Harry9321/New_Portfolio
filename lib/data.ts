export const profile = {
  name: "Hariom Sahu",
  role: "Software Engineer",
  tagline: "Backend Systems & AI Applications",
  location: "Mumbai, India",
  email: "hariomsahu.dev@gmail.com",
  phone: "+91 93216 71965",
  linkedin: "https://linkedin.com/in/hariom-dev",
  github: "https://github.com/hariom-dev",
  x: "https://x.com/hariom_dev",
  resumeUrl: "#",
  bio: "I design and ship high-throughput distributed systems and production-grade GenAI applications for India's largest financial exchange — turning fragile monoliths into resilient, observable pipelines.",
  available: true,
};

export const techStack = [
  "Python",
  "Java",
  "TypeScript",
  "Node.js",
  "FastAPI",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Kafka",
  "Celery",
  "Docker",
  "AWS",
  "Nginx",
  "SQLAlchemy",
  "Vercel",
  "CI/CD",
];

export const stats = [
  { label: "Years Architecting Production Systems", value: 1.5, suffix: "+" },
  { label: "Users Served by Shipped APIs", value: 100, suffix: "M+" },
  { label: "Validation Latency Cut via Redesign", value: 92.5, suffix: "%" },
  { label: "RAG Pipeline Latency Reduction", value: 40, suffix: "%" },
];

export const philosophy = [
  {
    title: "Design for the failure mode",
    description:
      "Every system I ship assumes traffic spikes, partial outages, and bad input will happen — guardrails and observability are not an afterthought.",
  },
  {
    title: "Measure, then optimize",
    description:
      "Query plans, latency percentiles, and profiler output decide the redesign — not intuition. 92.5% and 50% latency wins came from data, not guesses.",
  },
  {
    title: "Ship systems people can trust",
    description:
      "From JWT-gated API gateways to LLM guardrails in a regulated financial environment, reliability and safety are first-class requirements.",
  },
];

export type ExperienceEntry = {
  id: string;
  type: "work" | "education";
  role: string;
  org: string;
  location: string;
  start: string;
  end: string;
  summary: string;
  achievements: string[];
  tech: string[];
};

export const experience: ExperienceEntry[] = [
  {
    id: "mcx-swe",
    type: "work",
    role: "Software Engineer",
    org: "Multi Commodity Exchange",
    location: "Mumbai, India",
    start: "Jun 2025",
    end: "Present",
    summary:
      "Architecting and shipping production REST APIs and distributed data pipelines for client lifecycle management serving 100M+ users on India's largest fintech platform.",
    achievements: [
      "Re-architected a legacy monolith into a distributed Python / Celery / Redis pipeline, cutting file validation time from 40 to 3 minutes — a 92.5% reduction.",
      "Built a real-time Kafka ETL pipeline and anomaly-detection engine powering multi-channel alerts on suspicious trading behavior.",
      "Reduced API search latency by 50% through SQL query optimization, schema redesign, B-Tree indexing, and SQLAlchemy ORM refactoring.",
      "Designed a custom Nginx API Gateway with JWT authentication and rate-limiting to safeguard downstream services from traffic spikes.",
      "Provisioned and hardened UAT / Pre-Prod environments — Redis, Nginx reverse proxies, and end-to-end logging & observability frameworks.",
      "Built internal automation tools and scheduled desktop applications adopted company-wide, eliminating manual operational workflows.",
    ],
    tech: ["Python", "Celery", "Redis", "Kafka", "PostgreSQL", "Nginx", "AWS"],
  },
  {
    id: "education",
    type: "education",
    role: "B.E., Computer Engineering — CGPA 8.7/10",
    org: "A. P. Shah Institute of Technology, University of Mumbai",
    location: "Mumbai, India",
    start: "Jun 2021",
    end: "May 2025",
    summary:
      "Graduated with a strong foundation in systems, data structures, and distributed computing — complemented by cloud and ML certifications.",
    achievements: [
      "AWS Academy Cloud Foundations (2022)",
      "AWS Academy ML & Cloud Foundations (2023)",
      "Cisco Networking Essentials (2023)",
    ],
    tech: ["Data Structures", "Algorithms", "Databases", "Networks"],
  },
];

export type Project = {
  id: string;
  title: string;
  category: string;
  description: string;
  breakdown: string[];
  tech: string[];
  image: string;
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    id: "csq-ai-engine",
    title: "CSQ AI Engine",
    category: "Enterprise GenAI & Multimodal RAG Platform",
    description:
      "A production RAG-based chat and agentic application built for a regulated financial environment, from retrieval architecture to multimodal input handling.",
    breakdown: [
      "Engineered a 5-way parallel RAG pipeline with top-K candidate aggregation and neural reranking, cutting end-to-end latency by 40%.",
      "Implemented guardrails, monitoring, and observability so LLM outputs stay safe and reliable under compliance constraints.",
      "Fine-tuned response quality via prompt and retrieval optimization, plus front-end performance profiling of the chat interface.",
    ],
    tech: ["Python", "RAG", "Vector Search", "LLM Guardrails", "FastAPI"],
    image:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "kafka-anomaly-engine",
    title: "Real-Time Anomaly Detection Engine",
    category: "Streaming ETL & Fraud Signals",
    description:
      "A Kafka-powered ETL pipeline that watches live trading activity and fires multi-channel alerts the moment behavior looks suspicious.",
    breakdown: [
      "Designed topic partitioning and consumer groups for sustained high-throughput ingestion of trading events.",
      "Built anomaly-scoring logic that flags irregular patterns and routes alerts across multiple notification channels.",
      "Tuned for low end-to-end latency so alerts stay actionable in a live market.",
    ],
    tech: ["Kafka", "Python", "Event-Driven Architecture", "Redis"],
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "distributed-validation-pipeline",
    title: "Distributed File Validation Pipeline",
    category: "Systems Redesign & Performance",
    description:
      "A ground-up re-architecture of a legacy monolithic validation job into a horizontally scalable, parallel processing system.",
    breakdown: [
      "Replaced sequential monolith processing with a Celery / Redis task-queue architecture that parallelizes validation work.",
      "Cut file validation time from 40 minutes to 3 minutes — a 92.5% reduction — with no loss in data integrity.",
      "Instrumented the pipeline end-to-end so failures surface immediately instead of silently stalling batch jobs.",
    ],
    tech: ["Celery", "Redis", "Python", "PostgreSQL"],
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
  {
    id: "nginx-api-gateway",
    title: "Custom Nginx API Gateway",
    category: "Security & Traffic Resilience",
    description:
      "A hardened gateway layer sitting in front of downstream services, built to survive traffic spikes and keep unauthenticated traffic out.",
    breakdown: [
      "Implemented JWT-based authentication at the edge so downstream services never see unauthenticated requests.",
      "Configured rate-limiting and reverse-proxy rules to absorb bursty traffic without degrading service.",
      "Paired the gateway with end-to-end logging and observability for fast incident triage.",
    ],
    tech: ["Nginx", "JWT", "AWS", "Observability"],
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1600&auto=format&fit=crop",
    featured: true,
  },
];

export type Article = {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  url: string;
};

export const articles: Article[] = [
  {
    id: "parallel-rag-pipelines",
    title: "Designing a 5-Way Parallel RAG Pipeline for Low Latency",
    excerpt:
      "How top-K aggregation and neural reranking cut end-to-end response latency by 40% in a production agentic system.",
    date: "Aug 2026",
    readTime: "7 min read",
    url: "#",
  },
  {
    id: "monolith-to-celery",
    title: "From 40 Minutes to 3: Re-Architecting a Validation Monolith",
    excerpt:
      "A walkthrough of moving a sequential validation job onto a distributed Celery / Redis task pipeline without losing data integrity.",
    date: "Jun 2026",
    readTime: "6 min read",
    url: "#",
  },
  {
    id: "b-tree-indexing-latency",
    title: "Cutting API Search Latency in Half with Smarter Indexing",
    excerpt:
      "Query plans, schema redesign, and B-Tree indexing strategies that halved search latency on a high-traffic REST API.",
    date: "Mar 2026",
    readTime: "5 min read",
    url: "#",
  },
];

export const socials = [
  { label: "GitHub", href: profile.github, key: "github" as const },
  { label: "LinkedIn", href: profile.linkedin, key: "linkedin" as const },
  { label: "X (Twitter)", href: profile.x, key: "x" as const },
  { label: "Email", href: `mailto:${profile.email}`, key: "email" as const },
];

export const navLinks = [
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Projects", href: "#projects" },
  { label: "Articles", href: "#articles" },
  { label: "Contact", href: "#contact" },
];

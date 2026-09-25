/*
  Projects shown on the site (order here = order on the site).
  "type": "Work" for company projects, "Personal" for solo/side projects.
  Edit the list below. Keep the JSON-style format: quotes around keys and text, commas between items.
  See docs/CONTENT.md for every field.
*/
window.PROJECTS = [
  {
    "id": "csq-ai-engine",
    "title": "CSQ AI Engine",
    "type": "Work",
    "org": "Multi Commodity Exchange",
    "year": "2026",
    "category": "Enterprise GenAI · Multimodal RAG",
    "summary": "A production RAG chat and agentic application for a regulated financial environment, from retrieval architecture to multimodal input handling.",
    "highlights": [
      "5-way parallel retrieval with top-K aggregation and neural reranking.",
      "Guardrails, monitoring and observability to keep LLM output safe under compliance constraints.",
      "Prompt and retrieval tuning plus front-end profiling of the chat interface."
    ],
    "tags": [
      "Python",
      "FastAPI",
      "RAG",
      "Vector search",
      "LLM guardrails"
    ],
    "kpi": {
      "value": "−40%",
      "label": "end-to-end latency"
    },
    "image": "",
    "links": {
      "demo": "",
      "video": "",
      "source": ""
    },
    "confidential": true,
    "featured": true
  },
  {
    "id": "kafka-anomaly-engine",
    "title": "Real-time anomaly detection engine",
    "type": "Work",
    "org": "Multi Commodity Exchange",
    "year": "2025",
    "category": "Streaming ETL · Fraud signals",
    "summary": "A Kafka-powered pipeline that watches live trading activity and alerts the moment behaviour looks suspicious.",
    "highlights": [
      "Topic partitioning and consumer groups for sustained high-throughput ingestion.",
      "Anomaly scoring that flags irregular patterns and routes alerts across channels.",
      "Tuned for low end-to-end latency so alerts stay actionable in a live market."
    ],
    "tags": [
      "Kafka",
      "Python",
      "Redis",
      "Event-driven"
    ],
    "kpi": {
      "value": "Live",
      "label": "market surveillance"
    },
    "image": "",
    "links": {
      "demo": "",
      "video": "",
      "source": ""
    },
    "confidential": true,
    "featured": true
  },
  {
    "id": "distributed-validation-pipeline",
    "title": "Distributed file validation pipeline",
    "type": "Work",
    "org": "Multi Commodity Exchange",
    "year": "2025",
    "category": "Systems redesign · Performance",
    "summary": "A ground-up rebuild of a sequential validation job into a horizontally scalable, parallel system.",
    "highlights": [
      "Celery / Redis task queue replaces the sequential monolith.",
      "No loss in data integrity across the migration.",
      "Instrumented end-to-end so failures surface instead of silently stalling batches."
    ],
    "tags": [
      "Celery",
      "Redis",
      "Python",
      "PostgreSQL"
    ],
    "kpi": {
      "value": "40→3",
      "label": "minutes per run"
    },
    "image": "",
    "links": {
      "demo": "",
      "video": "",
      "source": ""
    },
    "confidential": true,
    "featured": true
  },
  {
    "id": "nginx-api-gateway",
    "title": "Custom Nginx API gateway",
    "type": "Work",
    "org": "Multi Commodity Exchange",
    "year": "2025",
    "category": "Security · Traffic resilience",
    "summary": "A hardened edge layer that keeps unauthenticated traffic out and absorbs bursts before they reach downstream services.",
    "highlights": [
      "JWT authentication at the edge.",
      "Rate limiting and reverse-proxy rules for bursty traffic.",
      "End-to-end logging for fast incident triage."
    ],
    "tags": [
      "Nginx",
      "JWT",
      "AWS",
      "Observability"
    ],
    "kpi": {
      "value": "JWT",
      "label": "auth at the edge"
    },
    "image": "",
    "links": {
      "demo": "",
      "video": "",
      "source": ""
    },
    "confidential": true,
    "featured": true
  }
];

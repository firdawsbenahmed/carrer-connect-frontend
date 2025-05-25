// API Configuration
export const USE_REAL_API = false; // Toggle between real API and dummy data
export const API_BASE_URL = "http://localhost:8000/api"; // Change this to your actual API base URL

export const API_ENDPOINTS = {
  "Onet-dataset": "/analyze/onet",
  "Stack-Overflow": "/analyze/stackoverflow",
  ESCOU: "/analyze/escou",
} as const;

export interface CareerMatch {
  title: string;
  description: string;
  matchScore: number;
  keySkills: string[];
  salary: string;
  growth: string;
  image: string;
}

// Dummy data for each model
export const MODEL_DUMMY_DATA: Record<
  keyof typeof API_ENDPOINTS,
  CareerMatch[]
> = {
  "Onet-dataset": [
    {
      title: "Software Engineer",
      description:
        "Design and develop software solutions for various platforms and needs.",
      matchScore: 96,
      keySkills: ["Java", "Python", "System Design", "Algorithm Development"],
      salary: "$85,000 - $150,000",
      growth: "15% (Much faster than average)",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "DevOps Engineer",
      description:
        "Manage infrastructure and deployment pipelines for software applications.",
      matchScore: 92,
      keySkills: ["Docker", "Kubernetes", "CI/CD", "Cloud Platforms"],
      salary: "$95,000 - $160,000",
      growth: "12% (Faster than average)",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  "Stack-Overflow": [
    {
      title: "Full Stack Developer",
      description: "Build complete web applications from frontend to backend.",
      matchScore: 94,
      keySkills: ["JavaScript", "React", "Node.js", "SQL"],
      salary: "$80,000 - $140,000",
      growth: "13% (Faster than average)",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Cloud Solutions Architect",
      description: "Design and implement cloud infrastructure solutions.",
      matchScore: 88,
      keySkills: ["AWS", "Azure", "Cloud Architecture", "System Design"],
      salary: "$110,000 - $180,000",
      growth: "10% (Faster than average)",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
  ESCOU: [
    {
      title: "Systems Analyst",
      description: "Analyze and optimize IT systems and business processes.",
      matchScore: 90,
      keySkills: [
        "System Analysis",
        "Project Management",
        "Business Process",
        "Technical Documentation",
      ],
      salary: "$75,000 - $130,000",
      growth: "11% (Faster than average)",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      title: "Data Engineer",
      description: "Build and maintain data pipelines and infrastructure.",
      matchScore: 86,
      keySkills: ["SQL", "Python", "ETL", "Big Data"],
      salary: "$90,000 - $160,000",
      growth: "14% (Much faster than average)",
      image: "/placeholder.svg?height=80&width=80",
    },
  ],
} as const;

// AI model configurations
export const AI_MODELS = [
  {
    id: "Onet-dataset",
    name: "Onet Dataset",
    description:
      "Model trained on a rich dataset of U.S. occupations detailing skills, tasks, and work activities for job matching and analysis.",
    icon: "Brain",
    accuracy: "92%",
    speed: "Moderate",
  },
  {
    id: "Stack-Overflow",
    name: "Stack Overflow",
    description:
      "Model trained on a worldwide tech-focused dataset from Stack Overflow surveys linking developer jobs, skills, and preferences for career analysis.",
    icon: "BarChart",
    accuracy: "93%",
    speed: "High",
  },
  {
    id: "ESCOU",
    name: "ESCOU",
    description:
      "Model trained on an European dataset detailing occupations, skills, and qualifications to support job matching and labor mobility across Europe.",
    icon: "Zap",
    accuracy: "94%",
    speed: "Fast",
  },
] as const;

// File upload configurations
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
export const ACCEPTED_FILE_TYPES = {
  "application/pdf": true,
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    true,
} as const;

// Validation configurations
export const MIN_TEXT_LENGTH = 20; // Minimum characters for text description

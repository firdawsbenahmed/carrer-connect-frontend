// API Configuration
export const API_BASE_URL = "https://7n3n1z40-8000.euw.devtunnels.ms/api";

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
  missingSkills: string[];
  salary: string;
  growth: string;
  image: string;
}

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

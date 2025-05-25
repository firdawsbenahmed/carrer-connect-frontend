// Types for CV templates
export type TemplateType =
  | "standard"
  | "academic"
  | "creative"
  | "technical"
  | "executive"
  | "ats-friendly"
  | "linkedin"
  | "europass"
  | "unknown";

export interface TemplateInfo {
  id: TemplateType;
  name: string;
  description: string;
  confidence: number;
  icon: string;
  parsingAccuracy: number;
}

// Template definitions with their characteristics
export const templates: Record<
  TemplateType,
  Omit<TemplateInfo, "confidence">
> = {
  standard: {
    id: "standard",
    name: "Standard Resume",
    description: "Traditional chronological format with clear sections",
    icon: "file-text",
    parsingAccuracy: 85,
  },
  academic: {
    id: "academic",
    name: "Academic CV",
    description: "Detailed format with publications and research experience",
    icon: "graduation-cap",
    parsingAccuracy: 80,
  },
  creative: {
    id: "creative",
    name: "Creative Resume",
    description: "Design-focused format with visual elements",
    icon: "palette",
    parsingAccuracy: 65,
  },
  technical: {
    id: "technical",
    name: "Technical Resume",
    description: "Skills-focused format for technical roles",
    icon: "code",
    parsingAccuracy: 90,
  },
  executive: {
    id: "executive",
    name: "Executive Resume",
    description: "Achievement-focused format for senior positions",
    icon: "briefcase",
    parsingAccuracy: 75,
  },
  "ats-friendly": {
    id: "ats-friendly",
    name: "ATS-Friendly Resume",
    description: "Optimized for applicant tracking systems",
    icon: "check-circle",
    parsingAccuracy: 95,
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn Export",
    description: "Resume exported from LinkedIn profile",
    icon: "linkedin",
    parsingAccuracy: 88,
  },
  europass: {
    id: "europass",
    name: "Europass CV",
    description: "Standardized European CV format",
    icon: "globe",
    parsingAccuracy: 92,
  },
  unknown: {
    id: "unknown",
    name: "Unknown Format",
    description: "Custom or unrecognized format",
    icon: "help-circle",
    parsingAccuracy: 50,
  },
};

// Keywords and patterns that might indicate a specific template
const templateKeywords: Record<Exclude<TemplateType, "unknown">, string[]> = {
  standard: [
    "professional experience",
    "work history",
    "education",
    "skills",
    "references",
  ],
  academic: [
    "publications",
    "research",
    "teaching experience",
    "grants",
    "conferences",
    "phd",
  ],
  creative: [
    "portfolio",
    "projects",
    "design",
    "creative",
    "art",
    "photography",
  ],
  technical: [
    "technical skills",
    "programming languages",
    "technologies",
    "projects",
    "github",
  ],
  executive: [
    "leadership",
    "strategy",
    "executive",
    "board",
    "revenue",
    "growth",
    "c-level",
  ],
  "ats-friendly": [
    "keywords",
    "core competencies",
    "professional summary",
    "achievements",
  ],
  linkedin: [
    "linkedin",
    "generated",
    "exported from linkedin",
    "www.linkedin.com",
  ],
  europass: [
    "europass",
    "european",
    "language passport",
    "mobility",
    "eu format",
  ],
};

// File naming patterns that might indicate a specific template
const templateFilePatterns: Record<
  Exclude<TemplateType, "unknown">,
  RegExp[]
> = {
  standard: [/resume/i, /cv/i],
  academic: [/academic/i, /phd/i, /research/i, /professor/i],
  creative: [/creative/i, /design/i, /portfolio/i],
  technical: [/tech/i, /developer/i, /engineer/i, /programming/i],
  executive: [
    /executive/i,
    /ceo/i,
    /cto/i,
    /cfo/i,
    /director/i,
    /vp/i,
    /manager/i,
  ],
  "ats-friendly": [/ats/i, /applicant/i, /tracking/i],
  linkedin: [/linkedin/i, /li_/i],
  europass: [/europass/i, /eu_cv/i, /european/i],
};

/**
 * Detects the CV template type based on content and filename
 * In a real implementation, this would analyze the actual PDF content
 * Here we're simulating with filename analysis and random factors
 */
export async function detectTemplate(file: File): Promise<TemplateInfo> {
  // Check filename against template patterns first
  let bestMatch: TemplateType = "unknown";
  let highestScore = 0;

  // Read file content as text
  let content = "";
  try {
    content = await file.text();
  } catch (error) {
    console.error("Error reading file content:", error);
    // If we can't read the content, fall back to just filename analysis
  }

  // Check each template's patterns and keywords
  Object.entries(templateFilePatterns).forEach(([templateId, patterns]) => {
    const templateType = templateId as Exclude<TemplateType, "unknown">;
    let score = 0;

    // Score from filename patterns
    patterns.forEach((pattern) => {
      if (pattern.test(file.name)) {
        score += 10; // Add points for each matching pattern
      }
    });

    // Score from content keywords
    if (content) {
      const keywords = templateKeywords[templateType];
      const contentLower = content.toLowerCase();
      keywords.forEach((keyword) => {
        // Look for exact word matches using word boundaries
        const regex = new RegExp(`\\b${keyword.toLowerCase()}\\b`, "g");
        const matches = (contentLower.match(regex) || []).length;
        score += matches * 5; // Add points for each keyword match
      });
    }

    // Check for section headers (commonly indicate CV structure)
    const commonSectionHeaders = [
      "education",
      "experience",
      "skills",
      "employment",
      "projects",
      "certifications",
      "languages",
      "references",
    ];
    commonSectionHeaders.forEach((header) => {
      const regex = new RegExp(`\\b${header}\\b`, "gi");
      if (regex.test(content)) {
        score += 5;
      }
    });

    // Add extra points for strong indicators
    if (/linkedin\.com\/in\//.test(content)) {
      if (templateType === "linkedin") score += 30;
    }
    if (/europass/i.test(content)) {
      if (templateType === "europass") score += 30;
    }
    if (/curriculum\\s+vitae/i.test(content)) {
      if (templateType === "standard") score += 10;
    }

    // If this is the best match so far, update
    if (score > highestScore) {
      highestScore = score;
      bestMatch = templateType;
    }
  });

  // If no good match, return unknown
  if (highestScore < 15) {
    bestMatch = "unknown";
    const confidence = 30 + Math.floor(highestScore);
    return {
      ...templates.unknown,
      confidence,
    };
  }

  // Calculate confidence based on score (50-95%)
  const confidence = Math.min(95, 50 + Math.min(highestScore, 45));

  return {
    ...templates[bestMatch],
    confidence,
  };
}

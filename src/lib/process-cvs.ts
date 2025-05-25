import type {
  DetailedCandidate,
  Experience,
  Education,
} from "../../context/candidates-context";
import { detectTemplate, TemplateInfo } from "./template-detection";

// Counter for ensuring unique IDs
let idCounter = 0;

// Generate a unique ID by combining timestamp with a counter
function generateUniqueId(): number {
  const timestamp = Date.now();
  const uniqueId = timestamp * 1000 + (idCounter % 1000);
  idCounter++;
  return uniqueId;
}

// Extended result type to include template information
export interface ProcessingResult {
  candidates: DetailedCandidate[];
  success: string[];
  failed: string[];
  templateInfo: Record<string, TemplateInfo>;
}

// Calculate years of experience from experience entries
function calculateYearsOfExperience(experience: Experience[]): number {
  let totalYears = 0;
  experience.forEach((exp) => {
    // Try to extract years from duration string
    const match = exp.duration.match(/\d+/);
    if (match) {
      totalYears += parseInt(match[0]);
    }
  });
  return totalYears || 0;
}

// Calculate match score based on various factors
function calculateMatchScore(
  extractedData: {
    name: string;
    position: string;
    company: string;
    skills: string[];
    location: string;
    experience: Experience[];
    education: Education[];
    email?: string;
    phone?: string;
  },
  templateConfidence: number
): number {
  let score = 0;

  // Base score from template confidence
  score += templateConfidence * 0.3; // 30% weight for template confidence

  // Score based on completeness
  const requiredFields = [
    "name",
    "position",
    "skills",
    "experience",
    "education",
  ];
  const completeness =
    requiredFields.reduce((count, field) => {
      const value = extractedData[field as keyof typeof extractedData];
      return (
        count +
        (value && (Array.isArray(value) ? value.length > 0 : true) ? 1 : 0)
      );
    }, 0) / requiredFields.length;

  score += completeness * 30; // 30% weight for completeness

  // Score based on skills
  score += Math.min(extractedData.skills.length * 2, 20); // Up to 20% for skills

  // Score based on experience
  const yearsOfExperience = calculateYearsOfExperience(
    extractedData.experience
  );
  score += Math.min(yearsOfExperience * 2, 20); // Up to 20% for experience

  return Math.round(Math.min(score, 100));
}

// Helper function to find a section in the CV content
function findSection(lines: string[], headers: string[]): string[] {
  let inSection = false;
  const sectionContent: string[] = [];

  for (const line of lines) {
    // Check if this line starts a new section
    const isHeader = headers.some(
      (header) =>
        line.toLowerCase().includes(header.toLowerCase()) && line.length < 50 // Avoid matching headers in regular text
    );

    if (isHeader) {
      inSection = true;
      continue;
    }

    // Check if we're entering a new section (indicated by a line in all caps)
    if (line.match(/^[A-Z\s]{5,}$/)) {
      if (inSection) break;
    }

    if (inSection && line.trim()) {
      sectionContent.push(line);
    }
  }

  return sectionContent;
}

// Helper function to extract skills from a section
function extractSkills(lines: string[]): string[] {
  const skills = new Set<string>();
  const skillPattern = /[\w+#\-.]+(?:\s*[\w+#\-.]+)*/g;

  lines.forEach((line) => {
    const matches = line.match(skillPattern);
    if (matches) {
      matches.forEach((skill) => {
        if (
          skill.length > 2 &&
          !skill.match(/^(and|the|or|in|at|by|to|of)$/i)
        ) {
          skills.add(skill.trim());
        }
      });
    }
  });

  return Array.from(skills);
}

// Function to extract data from CV text based on template type
function extractCVData(content: string) {
  const lines = content.split("\n").map((line) => line.trim());

  // Extract name
  const nameMatch =
    content.match(/name:?\s*([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/i) ||
    content.match(/([A-Z][a-z]+(?:\s+[A-Z][a-z]+)+)/m);
  const name = nameMatch ? nameMatch[1].trim() : "";

  // Extract email
  const emailMatch = content.match(/\b[\w\.-]+@[\w\.-]+\.\w+\b/i);
  const email = emailMatch ? emailMatch[0] : "";

  // Extract phone
  const phoneMatch = content.match(
    /(?:\+\d{1,3}[-\s]?)?\(?\d{3}\)?[-\s]?\d{3}[-\s]?\d{4}/
  );
  const phone = phoneMatch ? phoneMatch[0] : "";

  // Extract skills
  const skillsSection = findSection(lines, [
    "skills",
    "technical skills",
    "competencies",
  ]);
  const skills = extractSkills(skillsSection);

  // Extract experience
  const experienceSection = findSection(lines, [
    "experience",
    "work experience",
    "employment",
  ]);
  const experience = extractExperience(experienceSection);

  // Extract education
  const educationSection = findSection(lines, [
    "education",
    "academic background",
  ]);
  const education = extractEducation(educationSection);

  // Extract or infer position
  const positionMatch = content.match(/(?:position|title|role):?\s*([^\n]+)/i);
  const position = positionMatch
    ? positionMatch[1].trim()
    : experience.length > 0
    ? experience[0].position
    : "";

  // Extract location
  const locationMatch = content.match(
    /(?:location|address|based in):?\s*([^,\n]+(?:,[^,\n]+)?)/i
  );
  const location = locationMatch ? locationMatch[1].trim() : "";

  return {
    name,
    position,
    email,
    phone,
    company: experience.length > 0 ? experience[0].company : "",
    skills,
    location,
    experience,
    education,
  };
}

// Helper function to extract experience information
function extractExperience(lines: string[]): Experience[] {
  const experience: Experience[] = [];
  let currentEntry: Partial<Experience> = {};
  let description: string[] = [];

  for (const line of lines) {
    if (line.match(/^[A-Z][a-zA-Z\s&]+$/)) {
      // Company name pattern
      if (Object.keys(currentEntry).length > 0) {
        currentEntry.description = description.join(" ");
        experience.push(currentEntry as Experience);
        description = [];
      }
      currentEntry = {
        company: line,
        position: "",
        duration: "",
      };
    } else if (currentEntry.company) {
      if (!currentEntry.position) {
        currentEntry.position = line;
      } else if (
        line.match(
          /(?:20\d{2}|19\d{2})(?:\s*[-–—]\s*(?:20\d{2}|19\d{2}|present))?/i
        )
      ) {
        currentEntry.duration = line;
      } else {
        description.push(line);
      }
    }
  }

  if (Object.keys(currentEntry).length > 0) {
    currentEntry.description = description.join(" ");
    experience.push(currentEntry as Experience);
  }

  return experience;
}

// Helper function to extract education information
function extractEducation(lines: string[]): Education[] {
  const education: Education[] = [];
  let currentEntry: Partial<Education> = {};

  for (const line of lines) {
    if (line.match(/(?:university|college|institute|school)/i)) {
      if (Object.keys(currentEntry).length > 0) {
        education.push(currentEntry as Education);
      }
      currentEntry = {
        institution: line,
        degree: "",
        duration: "",
      };
    } else if (currentEntry.institution) {
      if (line.match(/(?:bachelor|master|phd|diploma|degree)/i)) {
        currentEntry.degree = line;
      } else if (
        line.match(
          /(?:20\d{2}|19\d{2})(?:\s*[-–—]\s*(?:20\d{2}|19\d{2}|present))?/i
        )
      ) {
        currentEntry.duration = line;
      }
    }
  }

  if (Object.keys(currentEntry).length > 0) {
    education.push(currentEntry as Education);
  }

  return education;
}

// Process CVs
export async function processCVs(files: File[]): Promise<ProcessingResult> {
  const candidates: DetailedCandidate[] = [];
  const success: string[] = [];
  const failed: string[] = [];
  const templateInfo: Record<string, TemplateInfo> = {};

  // Process each file
  const filePromises = files.map(async (file) => {
    try {
      // Read file content
      const fileContent = await file.text();

      // Detect template type
      const template = await detectTemplate(file);
      templateInfo[file.name] = template;

      // Extract data from the CV content
      const extractedData = extractCVData(fileContent);

      // Calculate match score
      const matchScore = calculateMatchScore(
        extractedData,
        template.confidence
      );

      // Create candidate with unique ID
      const candidate: DetailedCandidate = {
        id: generateUniqueId(),
        name: extractedData.name || nameFromFile(file.name),
        position: extractedData.position || "Not Specified",
        email: extractedData.email || "Not Available",
        phone: extractedData.phone || "Not Available",
        location: extractedData.location || "Not Specified",
        matchScore,
        skills: extractedData.skills || [],
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        yearsOfExperience: calculateYearsOfExperience(extractedData.experience),
        selected: false,
      };

      candidates.push(candidate);
      success.push(file.name);
      return { success: true };
    } catch (error) {
      console.error(`Error processing ${file.name}:`, error);
      failed.push(file.name);
      return { success: false };
    }
  });

  // Wait for all files to be processed
  await Promise.all(filePromises);

  return { candidates, success, failed, templateInfo };
}

// Helper function to extract name from filename
function nameFromFile(fileName: string): string {
  return fileName
    .replace(/\.pdf$/i, "")
    .replace(/[_-]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

"use client";

import { createContext, useContext, useState, type ReactNode } from "react";

// Define the candidate types
export type Experience = {
  company: string;
  position: string;
  duration: string;
  description: string;
};

export type Education = {
  institution: string;
  degree: string;
  duration: string;
};

export type DetailedCandidate = {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  location: string;
  matchScore: number;
  skills: string[];
  extractedSkillsCount?: number;
  requiredSkillsCount?: number;
  missingSkills?: Array<{ name: string; importance: string }>;
  experience?: Experience[];
  education?: Education[];
  yearsOfExperience?: number;
  selected: boolean;
};

export type SimpleCandidate = {
  id: number;
  name: string;
  position: string;
  matchScore: number;
  skills: string[];
  experience: string;
  education: string;
  selected: boolean;
};

// Convert detailed candidates to simple candidates for the ranking page
const convertToSimpleCandidate = (
  candidate: DetailedCandidate
): SimpleCandidate => ({
  id: candidate.id,
  name: candidate.name,
  position: candidate.position,
  matchScore: candidate.matchScore,
  skills: candidate.skills?.slice(0, 4) || [], // Only take first 4 skills for the simple view
  experience: candidate.yearsOfExperience
    ? `${candidate.yearsOfExperience} years`
    : "Not specified",
  education: candidate.education?.[0]?.degree || "Not specified",
  selected: candidate.selected,
});

// Initial data - empty arrays since we only want to show data from the server
const initialDetailedCandidates: DetailedCandidate[] = [];
const initialSimpleCandidates: SimpleCandidate[] = [];

// Define the context type
export type CandidatesContextType = {
  simpleCandidates: SimpleCandidate[];
  detailedCandidates: DetailedCandidate[];
  reportUrl: string | null;
  addCandidates: (candidates: DetailedCandidate[], reportUrl: string) => void;
  toggleCandidateSelection: (id: number) => void;
  getDetailedCandidate: (id: number) => DetailedCandidate | undefined;
};

// Create the context
const CandidatesContext = createContext<CandidatesContextType | undefined>(
  undefined
);

// Provider component
export function CandidatesProvider({ children }: { children: ReactNode }) {
  const [simpleCandidates, setSimpleCandidates] = useState<SimpleCandidate[]>(
    initialSimpleCandidates
  );
  const [detailedCandidates, setDetailedCandidates] = useState<
    DetailedCandidate[]
  >(initialDetailedCandidates);
  const [reportUrl, setReportUrl] = useState<string | null>(null);

  // Add new candidates (this will clear existing ones)
  const addCandidates = (
    candidates: DetailedCandidate[],
    reportUrl: string
  ) => {
    // Clear existing candidates
    setDetailedCandidates([]);
    setSimpleCandidates([]);
    setReportUrl(reportUrl);

    // Add new candidates
    setDetailedCandidates(candidates);
    setSimpleCandidates(candidates.map(convertToSimpleCandidate));
  };

  // Toggle selection for a candidate
  const toggleCandidateSelection = (id: number) => {
    setSimpleCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, selected: !candidate.selected }
          : candidate
      )
    );

    setDetailedCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id
          ? { ...candidate, selected: !candidate.selected }
          : candidate
      )
    );
  };

  // Get a detailed candidate by ID
  const getDetailedCandidate = (id: number) => {
    return detailedCandidates.find((candidate) => candidate.id === id);
  };

  // Count selected candidates
  const selectedCount = simpleCandidates.filter(
    (candidate) => candidate.selected
  ).length;

  const value = {
    simpleCandidates,
    detailedCandidates,
    reportUrl,
    addCandidates,
    toggleCandidateSelection,
    getDetailedCandidate,
  };

  return (
    <CandidatesContext.Provider value={value}>
      {children}
    </CandidatesContext.Provider>
  );
}

// Custom hook to use the context
export function useCandidates() {
  const context = useContext(CandidatesContext);
  if (context === undefined) {
    throw new Error("useCandidates must be used within a CandidatesProvider");
  }
  return context;
}

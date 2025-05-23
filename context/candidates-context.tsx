"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

// Define the candidate types
export type Experience = {
    company: string
    position: string
    duration: string
    description: string
}

export type Education = {
    institution: string
    degree: string
    duration: string
}

export type DetailedCandidate = {
    id: number
    name: string
    position: string
    email: string
    phone: string
    location: string
    matchScore: number
    skills: string[]
    experience: Experience[]
    education: Education[]
    yearsOfExperience: number
    selected: boolean
}

export type SimpleCandidate = {
    id: number
    name: string
    position: string
    matchScore: number
    skills: string[]
    experience: string
    education: string
    selected: boolean
}

// Initial data
const initialDetailedCandidates: DetailedCandidate[] = [
    {
        id: 1,
        name: "Alex Johnson",
        position: "Frontend Developer",
        email: "alex.johnson@example.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        matchScore: 92,
        skills: ["React", "TypeScript", "CSS", "Node.js", "Redux", "GraphQL", "Jest", "Webpack"],
        experience: [
            {
                company: "Tech Solutions Inc.",
                position: "Senior Frontend Developer",
                duration: "2020 - Present",
                description:
                    "Led the development of multiple web applications using React and TypeScript. Implemented state management with Redux and integrated with GraphQL APIs.",
            },
            {
                company: "Digital Innovations",
                position: "Frontend Developer",
                duration: "2018 - 2020",
                description:
                    "Developed responsive web interfaces using React and CSS. Collaborated with UX designers to implement user-friendly interfaces.",
            },
        ],
        education: [
            {
                institution: "University of California, Berkeley",
                degree: "B.S. Computer Science",
                duration: "2014 - 2018",
            },
        ],
        yearsOfExperience: 5,
        selected: false,
    },
    {
        id: 2,
        name: "Jamie Smith",
        position: "UX Designer",
        email: "jamie.smith@example.com",
        phone: "+1 (555) 234-5678",
        location: "New York, NY",
        matchScore: 88,
        skills: ["Figma", "UI/UX", "Prototyping", "User Research", "Adobe XD", "Sketch", "InVision", "Design Systems"],
        experience: [
            {
                company: "Creative Design Studio",
                position: "Senior UX Designer",
                duration: "2019 - Present",
                description:
                    "Led user research and created wireframes, prototypes, and high-fidelity designs for web and mobile applications. Collaborated with development teams to ensure design implementation.",
            },
            {
                company: "Digital Agency",
                position: "UI/UX Designer",
                duration: "2017 - 2019",
                description:
                    "Designed user interfaces for various clients across different industries. Conducted usability testing and iterated on designs based on user feedback.",
            },
        ],
        education: [
            {
                institution: "Rhode Island School of Design",
                degree: "M.A. Design",
                duration: "2015 - 2017",
            },
            {
                institution: "New York University",
                degree: "B.A. Fine Arts",
                duration: "2011 - 2015",
            },
        ],
        yearsOfExperience: 4,
        selected: false,
    },
    {
        id: 3,
        name: "Taylor Wilson",
        position: "Full Stack Developer",
        email: "taylor.wilson@example.com",
        phone: "+1 (555) 345-6789",
        location: "Austin, TX",
        matchScore: 85,
        skills: ["JavaScript", "Python", "React", "Django", "PostgreSQL", "AWS", "Docker", "Git"],
        experience: [
            {
                company: "Tech Startup",
                position: "Full Stack Developer",
                duration: "2020 - Present",
                description:
                    "Developed and maintained web applications using React and Django. Implemented RESTful APIs and managed database schemas. Deployed applications to AWS using Docker.",
            },
            {
                company: "Software Consultancy",
                position: "Junior Developer",
                duration: "2018 - 2020",
                description:
                    "Worked on client projects using various technologies. Collaborated with senior developers to implement features and fix bugs.",
            },
        ],
        education: [
            {
                institution: "University of Texas",
                degree: "B.S. Software Engineering",
                duration: "2014 - 2018",
            },
        ],
        yearsOfExperience: 3,
        selected: false,
    },
    {
        id: 4,
        name: "Morgan Lee",
        position: "Backend Developer",
        email: "morgan.lee@example.com",
        phone: "+1 (555) 456-7890",
        location: "Seattle, WA",
        matchScore: 78,
        skills: ["Java", "Spring", "SQL", "AWS", "Microservices", "Kafka", "Docker", "Kubernetes"],
        experience: [
            {
                company: "Enterprise Solutions",
                position: "Senior Backend Developer",
                duration: "2017 - Present",
                description:
                    "Designed and implemented microservices architecture for high-traffic applications. Optimized database queries and implemented caching strategies for improved performance.",
            },
            {
                company: "Financial Tech",
                position: "Java Developer",
                duration: "2015 - 2017",
                description:
                    "Developed backend services for financial applications. Implemented secure payment processing systems and integrated with third-party APIs.",
            },
        ],
        education: [
            {
                institution: "University of Washington",
                degree: "M.S. Computer Science",
                duration: "2013 - 2015",
            },
            {
                institution: "Stanford University",
                degree: "B.S. Computer Science",
                duration: "2009 - 2013",
            },
        ],
        yearsOfExperience: 6,
        selected: false,
    },
    {
        id: 5,
        name: "Casey Brown",
        position: "DevOps Engineer",
        email: "casey.brown@example.com",
        phone: "+1 (555) 567-8901",
        location: "Chicago, IL",
        matchScore: 75,
        skills: ["Docker", "Kubernetes", "CI/CD", "Linux", "AWS", "Terraform", "Ansible", "Monitoring"],
        experience: [
            {
                company: "Cloud Services Inc.",
                position: "DevOps Engineer",
                duration: "2019 - Present",
                description:
                    "Implemented and maintained CI/CD pipelines for multiple development teams. Managed Kubernetes clusters and automated infrastructure provisioning using Terraform.",
            },
            {
                company: "IT Solutions",
                position: "Systems Administrator",
                duration: "2017 - 2019",
                description:
                    "Managed Linux servers and network infrastructure. Implemented monitoring solutions and automated routine maintenance tasks.",
            },
        ],
        education: [
            {
                institution: "Illinois Institute of Technology",
                degree: "B.S. Information Technology",
                duration: "2013 - 2017",
            },
        ],
        yearsOfExperience: 4,
        selected: false,
    },
]

// Convert detailed candidates to simple candidates for the ranking page
const convertToSimpleCandidate = (candidate: DetailedCandidate): SimpleCandidate => ({
    id: candidate.id,
    name: candidate.name,
    position: candidate.position,
    matchScore: candidate.matchScore,
    skills: candidate.skills.slice(0, 4), // Only take first 4 skills for the simple view
    experience: `${candidate.yearsOfExperience} years`,
    education: candidate.education[0]?.degree || "N/A",
    selected: candidate.selected,
})

const initialSimpleCandidates: SimpleCandidate[] = initialDetailedCandidates.map(convertToSimpleCandidate)

// Define the context type
type CandidatesContextType = {
    simpleCandidates: SimpleCandidate[]
    detailedCandidates: DetailedCandidate[]
    toggleCandidateSelection: (id: number) => void
    getDetailedCandidate: (id: number) => DetailedCandidate | undefined
    selectedCount: number
    addCandidates: (candidates: DetailedCandidate[]) => void
}

// Create the context
const CandidatesContext = createContext<CandidatesContextType | undefined>(undefined)

// Provider component
export function CandidatesProvider({ children }: { children: ReactNode }) {
    const [simpleCandidates, setSimpleCandidates] = useState<SimpleCandidate[]>(initialSimpleCandidates)
    const [detailedCandidates, setDetailedCandidates] = useState<DetailedCandidate[]>(initialDetailedCandidates)

    // Load saved state from localStorage on initial render
    useEffect(() => {
        // Only run in the browser
        if (typeof window === "undefined") return

        const savedSimpleCandidates = localStorage.getItem("simpleCandidates")
        const savedDetailedCandidates = localStorage.getItem("detailedCandidates")

        if (savedSimpleCandidates && savedDetailedCandidates) {
            try {
                setSimpleCandidates(JSON.parse(savedSimpleCandidates))
                setDetailedCandidates(JSON.parse(savedDetailedCandidates))
            } catch (error) {
                console.error("Error parsing saved candidates:", error)
            }
        }
    }, [])

    // Save state to localStorage whenever it changes
    useEffect(() => {
        // Only run in the browser
        if (typeof window === "undefined") return

        localStorage.setItem("simpleCandidates", JSON.stringify(simpleCandidates))
        localStorage.setItem("detailedCandidates", JSON.stringify(detailedCandidates))
    }, [simpleCandidates, detailedCandidates])

    // Toggle selection for a candidate
    const toggleCandidateSelection = (id: number) => {
        // Update simple candidates
        setSimpleCandidates((prev) =>
            prev.map((candidate) => (candidate.id === id ? { ...candidate, selected: !candidate.selected } : candidate)),
        )

        // Update detailed candidates
        setDetailedCandidates((prev) =>
            prev.map((candidate) => (candidate.id === id ? { ...candidate, selected: !candidate.selected } : candidate)),
        )
    }

    // Get a detailed candidate by ID
    const getDetailedCandidate = (id: number) => {
        return detailedCandidates.find((candidate) => candidate.id === id)
    }

    // Add new candidates - explicitly redefine this function
    const addCandidates = (candidates: DetailedCandidate[]) => {
        // Add detailed candidates
        setDetailedCandidates((prev) => [...prev, ...candidates])

        // Convert and add simple candidates
        const newSimpleCandidates = candidates.map(convertToSimpleCandidate)
        setSimpleCandidates((prev) => [...prev, ...newSimpleCandidates])
    }

    // Count selected candidates
    const selectedCount = simpleCandidates.filter((candidate) => candidate.selected).length

    // Context value
    const value = {
        simpleCandidates,
        detailedCandidates,
        toggleCandidateSelection,
        getDetailedCandidate,
        selectedCount,
        addCandidates,
    }

    return <CandidatesContext.Provider value={value}>{children}</CandidatesContext.Provider>
}

// Custom hook to use the context
export function useCandidates() {
    const context = useContext(CandidatesContext)
    if (context === undefined) {
        throw new Error("useCandidates must be used within a CandidatesProvider")
    }
    return context
}

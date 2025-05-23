import type { DetailedCandidate } from "@/context/candidates-context"
import { detectTemplate, applyTemplateRules, type TemplateInfo } from "./template-detection"

// Extended result type to include template information
export interface ProcessingResult {
    candidates: DetailedCandidate[]
    success: string[]
    failed: string[]
    templateInfo: Record<string, TemplateInfo> // Maps filename to detected template
}

// Mock function to simulate processing CVs
// In a real application, this would use a library like pdf.js to extract text
// and then use AI/ML to parse the CV content into structured data
export async function processCVs(files: File[]): Promise<ProcessingResult> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    const candidates: DetailedCandidate[] = []
    const success: string[] = []
    const failed: string[] = []
    const templateInfo: Record<string, TemplateInfo> = {}

    // Process each file
    for (const file of files) {
        try {
            // Simulate a random failure for demonstration purposes
            if (Math.random() < 0.15) {
                failed.push(file.name)
                continue
            }

            // Detect template
            const template = detectTemplate(file)
            templateInfo[file.name] = template

            // In a real implementation, we would extract text from the PDF here
            // const text = await extractTextFromPDF(file);

            // Generate a mock candidate from the file name
            let candidate = generateMockCandidate(file.name)

            // Apply template-specific parsing rules to improve extraction
            candidate = applyTemplateRules(template, candidate)

            candidates.push(candidate)
            success.push(file.name)
        } catch (error) {
            console.error(`Error processing ${file.name}:`, error)
            failed.push(file.name)
        }
    }

    return { candidates, success, failed, templateInfo }
}

// Generate a mock candidate with random data based on the file name
function generateMockCandidate(fileName: string): DetailedCandidate {
    // Extract a name from the file name (remove extension and replace underscores/hyphens with spaces)
    const nameFromFile = fileName
        .replace(/\.pdf$/i, "")
        .replace(/[_-]/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())

    // Generate a random ID that's likely to be unique
    const id = Date.now() + Math.floor(Math.random() * 1000)

    // List of possible positions
    const positions = [
        "Frontend Developer",
        "Backend Developer",
        "UX Designer",
        "Product Manager",
        "Data Scientist",
        "DevOps Engineer",
        "Full Stack Developer",
        "Marketing Specialist",
        "Content Writer",
        "HR Manager",
    ]

    // List of possible skills by position
    const skillsByPosition: Record<string, string[]> = {
        "Frontend Developer": ["React", "JavaScript", "TypeScript", "CSS", "HTML", "Redux", "Next.js", "Tailwind"],
        "Backend Developer": ["Node.js", "Python", "Java", "SQL", "MongoDB", "Express", "REST API", "GraphQL"],
        "UX Designer": ["Figma", "Adobe XD", "Sketch", "User Research", "Wireframing", "Prototyping", "UI Design"],
        "Product Manager": ["Agile", "Scrum", "Jira", "Product Strategy", "User Stories", "Roadmapping", "Analytics"],
        "Data Scientist": ["Python", "R", "SQL", "Machine Learning", "Data Visualization", "Statistics", "Pandas"],
        "DevOps Engineer": ["Docker", "Kubernetes", "AWS", "CI/CD", "Linux", "Terraform", "Jenkins", "Monitoring"],
        "Full Stack Developer": ["JavaScript", "React", "Node.js", "SQL", "MongoDB", "TypeScript", "REST API", "Git"],
        "Marketing Specialist": ["SEO", "Content Marketing", "Social Media", "Analytics", "Email Marketing", "CRM"],
        "Content Writer": ["Copywriting", "SEO", "Content Strategy", "Editing", "Research", "Storytelling"],
        "HR Manager": ["Recruitment", "Employee Relations", "Performance Management", "Training", "Compliance"],
    }

    // List of possible companies
    const companies = [
        "Tech Innovations",
        "Digital Solutions",
        "Creative Studios",
        "Data Insights",
        "Cloud Systems",
        "Web Frontiers",
        "Mobile Dynamics",
        "Smart Applications",
        "Future Technologies",
        "Global Software",
    ]

    // List of possible universities
    const universities = [
        "University of Technology",
        "State University",
        "Technical Institute",
        "International College",
        "Design Academy",
        "Computer Science University",
        "Business School",
        "Arts Institute",
        "Science University",
        "Engineering College",
    ]

    // Randomly select a position
    const position = positions[Math.floor(Math.random() * positions.length)]

    // Get skills for the selected position
    const positionSkills = skillsByPosition[position] || skillsByPosition["Full Stack Developer"]

    // Randomly select 4-8 skills
    const skillCount = 4 + Math.floor(Math.random() * 5)
    const shuffledSkills = [...positionSkills].sort(() => 0.5 - Math.random())
    const skills = shuffledSkills.slice(0, skillCount)

    // Generate random years of experience (1-10)
    const yearsOfExperience = 1 + Math.floor(Math.random() * 10)

    // Generate random match score (60-95)
    const matchScore = 60 + Math.floor(Math.random() * 36)

    // Generate random experience entries
    const experienceCount = 1 + Math.floor(Math.random() * 2)
    const experience = []

    const currentYear = new Date().getFullYear()
    let lastEndYear = currentYear

    for (let i = 0; i < experienceCount; i++) {
        const durationYears = 1 + Math.floor(Math.random() * 3)
        const startYear = lastEndYear - durationYears
        const company = companies[Math.floor(Math.random() * companies.length)]
        const title = position

        experience.push({
            company,
            position: i === 0 ? title : `Junior ${title}`,
            duration: i === 0 ? `${startYear} - Present` : `${startYear} - ${lastEndYear}`,
            description: `Worked on various ${position.toLowerCase()} projects and collaborated with cross-functional teams to deliver high-quality solutions.`,
        })

        lastEndYear = startYear - 1
    }

    // Generate random education entries
    const educationCount = 1 + Math.floor(Math.random() * 2)
    const education = []

    lastEndYear = currentYear - yearsOfExperience

    for (let i = 0; i < educationCount; i++) {
        const durationYears = 2 + Math.floor(Math.random() * 3)
        const startYear = lastEndYear - durationYears
        const university = universities[Math.floor(Math.random() * universities.length)]

        education.push({
            institution: university,
            degree:
                i === 0
                    ? `B.S. in ${position.replace(" Developer", "").replace(" Engineer", " Engineering")}`
                    : `M.S. in ${position.replace(" Developer", "").replace(" Engineer", " Engineering")}`,
            duration: `${startYear} - ${lastEndYear}`,
        })

        lastEndYear = startYear - 1
    }

    return {
        id,
        name: nameFromFile,
        position,
        email: `${nameFromFile.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: `+1 (${100 + Math.floor(Math.random() * 900)}) ${100 + Math.floor(Math.random() * 900)}-${1000 + Math.floor(Math.random() * 9000)}`,
        location: `${["New York", "San Francisco", "Chicago", "Austin", "Seattle", "Boston", "Denver", "Atlanta"][Math.floor(Math.random() * 8)]}, ${["NY", "CA", "IL", "TX", "WA", "MA", "CO", "GA"][Math.floor(Math.random() * 8)]}`,
        matchScore,
        skills,
        experience,
        education,
        yearsOfExperience,
        selected: false,
    }
}

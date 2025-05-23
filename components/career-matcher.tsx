"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Label } from "@radix-ui/react-label"
import { Progress } from "@radix-ui/react-progress"
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"
import {
    Brain,
    BarChart,
    Zap,
    FileText,
    Upload,
    X,
    CheckCircle,
    AlertCircle,
    Sparkles,
    Briefcase,
    File,
} from "lucide-react"
import { Badge } from "./badge"
import { Button } from "./button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "./card"
import { CareerResult } from "./career-result"
import { Textarea } from "./textarea"

// Sample career matches for demonstration
const sampleCareers = [
    {
        title: "Frontend Developer",
        description: "Build user interfaces and interactive web applications using modern frameworks.",
        matchScore: 95,
        keySkills: ["JavaScript", "React", "UI/UX Design", "Problem Solving"],
        salary: "$75,000 - $120,000",
        growth: "Faster than average",
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        title: "Data Scientist",
        description: "Analyze complex data sets to identify trends and help organizations make data-driven decisions.",
        matchScore: 88,
        keySkills: ["Python", "Data Analysis", "Machine Learning", "Critical Thinking"],
        salary: "$90,000 - $140,000",
        growth: "Much faster than average",
        image: "/placeholder.svg?height=80&width=80",
    },
    {
        title: "Product Manager",
        description:
            "Lead the development of products from conception to launch, balancing business needs with technical constraints.",
        matchScore: 82,
        keySkills: ["Leadership", "Communication", "Project Management", "Problem Solving"],
        salary: "$85,000 - $150,000",
        growth: "Average",
        image: "/placeholder.svg?height=80&width=80",
    },
]

// AI model options
const aiModels = [
    {
        id: "Onet-dataset",
        name: "Onet Dataset",
        description:
            "Model trained on a rich dataset of U.S. occupations detailing skills, tasks, and work activities for job matching and analysis.",
        icon: <Brain className="h-5 w-5" />,
        accuracy: "92%",
        speed: "Moderate",
    },
    {
        id: "Stack-Overflow",
        name: "Stack Overflow",
        description:
            "Model trained on a worldwide tech-focused dataset from Stack Overflow surveys linking developer jobs, skills, and preferences for career analysis.",
        icon: <BarChart className="h-5 w-5" />,
        accuracy: "93%",
        speed: "High",
    },
    {
        id: "ESCOU",
        name: "ESCOU",
        description: "Model trained on an European dataset detailing occupations, skills, and qualifications to support job matching and labor mobility across Europe.",
        icon: <Zap className="h-5 w-5" />,
        accuracy: "94%",
        speed: "Fast",
    },
]

export function CareerMatcher() {
    const [inputMode, setInputMode] = useState<"cv" | "text">("cv")
    const [userText, setUserText] = useState("")
    const [showResults, setShowResults] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [careers, setCareers] = useState<typeof sampleCareers>([])
    const [selectedModel, setSelectedModel] = useState("skill-match")

    // CV upload states
    const [cvFile, setCvFile] = useState<File | null>(null)
    const [uploadProgress, setUploadProgress] = useState(0)
    const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null

        if (file) {
            // Check if file is PDF or DOCX
            const fileType = file.type
            if (
                fileType !== "application/pdf" &&
                fileType !== "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            ) {
                alert("Please upload a PDF or DOCX file")
                return
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert("File size should be less than 5MB")
                return
            }

            setCvFile(file)
            simulateUpload(file)
        }
    }

    const simulateUpload = (file: File) => {
        setUploadStatus("uploading")
        setUploadProgress(0)

        // Simulate upload progress
        const interval = setInterval(() => {
            setUploadProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    setUploadStatus("success")
                    return 100
                }
                return prev + 10
            })
        }, 200)
    }

    const handleRemoveFile = () => {
        setCvFile(null)
        setUploadStatus("idle")
        setUploadProgress(0)
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const handleFindCareers = () => {
        setIsLoading(true)

        // Simulate API call to your model
        setTimeout(() => {
            // Here you would normally send the CV file or userText to your selected AI model
            console.log("Processing with model:", selectedModel)
            if (inputMode === "cv") {
                console.log("Processing CV:", cvFile?.name)
            } else {
                console.log("Processing text description:", userText)
            }

            setCareers(sampleCareers)
            setShowResults(true)
            setIsLoading(false)
        }, 1500)
    }

    const handleReset = () => {
        setCvFile(null)
        setUploadStatus("idle")
        setUploadProgress(0)
        setUserText("")
        setShowResults(false)
        setCareers([])
        if (fileInputRef.current) {
            fileInputRef.current.value = ""
        }
    }

    const isInputValid = inputMode === "cv" ? cvFile !== null && uploadStatus === "success" : userText.trim().length >= 20

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Find Your Ideal Career Path</CardTitle>
                    <CardDescription>
                        Upload your CV or describe your background, and our AI will match you with suitable career options
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="cv" onValueChange={(value) => setInputMode(value as "cv" | "text")} className="mb-6">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="cv">
                                <div className="flex items-center gap-2">
                                    <File className="h-4 w-4" />
                                    Upload CV
                                </div>
                            </TabsTrigger>
                            <TabsTrigger value="text">
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Write Description
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="cv" className="mt-4">
                            <div className="space-y-4">
                                {!cvFile ? (
                                    <div
                                        className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                                            onChange={handleFileChange}
                                        />
                                        <Upload className="h-10 w-10 mx-auto mb-4 text-muted-foreground" />
                                        <h3 className="text-lg font-medium mb-1">Upload your CV</h3>
                                        <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to browse</p>
                                        <p className="text-xs text-muted-foreground">Supports PDF, DOCX (Max 5MB)</p>
                                    </div>
                                ) : (
                                    <div className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                <File className="h-5 w-5 mr-2 text-primary" />
                                                <span className="font-medium">{cvFile.name}</span>
                                            </div>
                                            <Button variant="ghost" size="sm" onClick={handleRemoveFile} className="h-8 w-8 p-0">
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between text-xs">
                                                <span>{(cvFile.size / 1024 / 1024).toFixed(2)} MB</span>
                                                <span className="flex items-center">
                                                    {uploadStatus === "uploading" && "Uploading..."}
                                                    {uploadStatus === "success" && (
                                                        <span className="flex items-center text-green-600">
                                                            <CheckCircle className="h-3 w-3 mr-1" /> Uploaded
                                                        </span>
                                                    )}
                                                    {uploadStatus === "error" && (
                                                        <span className="flex items-center text-red-600">
                                                            <AlertCircle className="h-3 w-3 mr-1" /> Error
                                                        </span>
                                                    )}
                                                </span>
                                            </div>
                                            <Progress value={uploadProgress} className="h-1" />
                                        </div>
                                    </div>
                                )}

                                <div className="text-sm text-muted-foreground">
                                    Upload your CV/resume for the most accurate career matches. Our AI will analyze your skills and
                                    experience.
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="text" className="mt-4">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium block mb-2">
                                        Describe your background, experience, and interests
                                    </label>
                                    <Textarea
                                        placeholder="Example: I have 3 years of experience in digital marketing with a focus on social media campaigns. I enjoy data analysis and have recently completed courses in SQL and Python. I'm looking for a role that combines my creative and analytical skills."
                                        className="min-h-[150px] resize-none"
                                        value={userText}
                                        onChange={(e) => setUserText(e.target.value)}
                                    />
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Provide a detailed description (at least 20 characters) for more accurate career matches. Include your
                                    skills, experience, education, and interests.
                                </div>
                            </div>
                        </TabsContent>
                    </Tabs>

                    {/* AI Model Selection */}
                    <div className="mt-8">
                        <h3 className="text-sm font-medium mb-3">Choose AI Model for Analysis</h3>
                        <RadioGroup defaultValue="skill-match" value={selectedModel} onValueChange={setSelectedModel}>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {aiModels.map((model) => (
                                    <div key={model.id} className="relative">
                                        <RadioGroupItem value={model.id} id={model.id} className="peer sr-only" />
                                        <Label
                                            htmlFor={model.id}
                                            className="flex flex-col h-full p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5"
                                        >
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    {model.icon}
                                                    <span className="font-medium">{model.name}</span>
                                                </div>
                                                <Badge variant="outline" className="text-xs">
                                                    {model.accuracy} Accuracy
                                                </Badge>
                                            </div>
                                            <p className="text-sm text-muted-foreground mb-2">{model.description}</p>
                                            <div className="text-xs text-muted-foreground mt-auto">Processing: {model.speed}</div>
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        </RadioGroup>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-6">
                    <Button onClick={handleFindCareers} disabled={!isInputValid || isLoading} className="w-full sm:w-auto">
                        {isLoading ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                Processing...
                            </>
                        ) : (
                            <>
                                <Sparkles className="mr-2 h-4 w-4" />
                                Find Matching Careers
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>

            {showResults && (
                <div className="mt-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-bold flex items-center">
                            <Briefcase className="mr-2 h-6 w-6" />
                            Your Career Matches
                        </h2>
                        <Button variant="outline" size="sm" onClick={handleReset}>
                            Start Over
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {careers.map((career, index) => (
                            <CareerResult key={index} career={career} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

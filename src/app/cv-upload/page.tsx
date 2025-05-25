"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import {
  ArrowLeft,
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/button";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCandidates } from "@/context/candidates-context";
import { FileUploader } from "@/components/file-uploader";
import { Progress } from "@/components/progress";
import { useRouter } from "next/navigation";

interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
}

interface Skill {
  skill: string;
  importance?: string;
}

interface DetailedCandidate {
  id: number;
  name: string;
  position: string;
  email: string;
  phone: string;
  location: string;
  matchScore: number;
  skills: string[];
  extractedSkillsCount: number;
  requiredSkillsCount: number;
  missingSkills: { name: string; importance: string }[];
  selected: boolean;
}

interface RawResult {
  contact_info?: ContactInfo;
  target_job_title?: string;
  score?: number;
  matched_skills?: Skill[];
  missing_skills?: Skill[];
  extracted_skills_count?: number;
  required_skills_count?: number;
}

// Counter for ensuring unique IDs
let idCounter = 0;

// Generate a truly unique ID by combining timestamp and counter
const generateUniqueId = () => {
  const timestamp = Date.now();
  idCounter += 1;
  return timestamp * 1000 + idCounter;
};

export default function CVUploadPage() {
  const { toast } = useToast();
  const router = useRouter();
  const candidatesContext = useCandidates();
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedFiles, setProcessedFiles] = useState<{
    success: string[];
    failed: string[];
  }>({
    success: [],
    failed: [],
  });
  const [processingProgress, setProcessingProgress] = useState(0);
  const [currentProcessingFile, setCurrentProcessingFile] =
    useState<string>("");
  const [jobs, setJobs] = useState<{ code: string; title: string }[]>([]);
  const [selectedJobCode, setSelectedJobCode] = useState<string | null>(null);

  // Clear localStorage on component mount
  useEffect(() => {
    console.log("Clearing localStorage on component mount...");
    localStorage.removeItem("simpleCandidates");
    localStorage.removeItem("detailedCandidates");
  }, []);

  // Fetch jobs from backend
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/jobs");
        const data = await response.json();
        console.log("Fetched jobs:", data);

        // Check if data is an array directly, or check if it's in data.results
        const jobsData = Array.isArray(data) ? data : data.results;

        if (!jobsData) {
          throw new Error("Jobs data not found in server response");
        }

        setJobs(jobsData);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to fetch job titles. Please try again later.",
          variant: "destructive",
        });
      }
    };

    fetchJobs();
  }, [toast]);

  const handleJobChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCode = event.target.value;
    setSelectedJobCode(selectedCode);
    console.log("Selected Job Code:", selectedCode);
  };

  const handleFilesSelected = (selectedFiles: File[]) => {
    const pdfFiles = selectedFiles.filter(
      (file) =>
        file.type === "application/pdf" ||
        file.name.toLowerCase().endsWith(".pdf")
    );

    if (pdfFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are accepted",
        variant: "destructive",
      });
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles]);
  };

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  };

  // Transform the raw results into DetailedCandidate format
  const handleProcessCVs = async () => {
    console.log("Starting handleProcessCVs...");
    let progressInterval: NodeJS.Timeout | undefined = undefined;

    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one CV to process",
        variant: "destructive",
      });
      return;
    }

    if (!selectedJobCode) {
      toast({
        title: "No job selected",
        description: "Please select a job title before processing CVs",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    files.forEach((file) => {
      formData.append("resumes", file);
    });

    try {
      setIsProcessing(true);
      setProcessedFiles({ success: [], failed: [] });
      setProcessingProgress(0);

      // Set up progress simulation
      const totalTime = files.length * 2000; // 2 seconds per PDF
      const startTime = Date.now();
      let currentFileIndex = 0;

      setCurrentProcessingFile(files[0].name);

      // Progress update interval
      progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const calculatedProgress = Math.min(
          (elapsedTime / totalTime) * 100,
          99
        );
        setProcessingProgress(Math.round(calculatedProgress));

        // Update current processing file every 2 seconds
        const newFileIndex = Math.floor(elapsedTime / 2000);
        if (newFileIndex !== currentFileIndex && newFileIndex < files.length) {
          currentFileIndex = newFileIndex;
          setCurrentProcessingFile(files[currentFileIndex].name);
        }
      }, 100); // Update every 100ms for smooth animation

      console.log("Sending request to backend...");
      const response = await fetch(
        `http://127.0.0.1:8000/rank_resumes/${selectedJobCode}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to process CVs");
      }

      const rawResults = await response.json();
      console.log("Response from server:", rawResults);

      // Check if response has the results array
      const resultsArray = rawResults.results;
      if (!Array.isArray(resultsArray)) {
        throw new Error(
          "Server response is not in the expected format - missing results array"
        );
      }

      // Transform the raw results into DetailedCandidate format with proper typing
      const validCandidates = resultsArray
        .map((result: RawResult, index: number) => {
          if (!result) {
            console.warn(`Empty result at index ${index}`);
            return null;
          }

          return {
            id: generateUniqueId(),
            name: result.contact_info?.name || `Candidate ${index + 1}`,
            position: result.target_job_title || "Not Specified",
            email: result.contact_info?.email || "Not Available",
            phone: result.contact_info?.phone || "Not Available",
            location: result.contact_info?.location || "Not Specified",
            matchScore: result.score || 0,
            skills:
              result.matched_skills?.map((skill: Skill) => skill.skill) || [],
            extractedSkillsCount: result.extracted_skills_count || 0,
            requiredSkillsCount: result.required_skills_count || 0,
            missingSkills:
              result.missing_skills?.map((skill: Skill) => ({
                name: skill.skill,
                importance: skill.importance || "medium",
              })) || [],
            selected: false,
          };
        })
        .filter(
          (candidate): candidate is DetailedCandidate => candidate !== null
        );

      toast({
        title: "CVs processed successfully",
        description: "Redirecting to the ranking page...",
        variant: "default",
      });

      if (candidatesContext.addCandidates) {
        // Set progress to 100% on success
        setProcessingProgress(100);
        candidatesContext.addCandidates(validCandidates, rawResults.report_url);

        toast({
          title: "CVs processed successfully",
          description: "Redirecting to the ranking page...",
          duration: 1500,
        });

        // Redirect to ranking page after a short delay to show the toast
        setTimeout(() => {
          router.push("/cv-ranking");
        }, 1500);
      }
    } catch (error) {
      console.error("Error processing CVs:", error);
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the CVs",
        variant: "destructive",
      });
    } finally {
      // Clear the progress interval
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsProcessing(false);
    }
  };

  const clearAll = () => {
    setFiles([]);
    setProcessedFiles({ success: [], failed: [] });
    setProcessingProgress(0);
  };

  return (
    <div className='container mx-auto py-8 px-4 sm:px-6 md:px-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex items-center gap-2'>
          <Button variant='outline' size='icon' asChild>
            <Link href='/cv-ranking'>
              <ArrowLeft className='h-4 w-4' />
            </Link>
          </Button>
          <h1 className='text-3xl font-bold'>CV Upload</h1>
        </div>

        {/* Job Selection Dropdown */}
        <div className='mb-4'>
          <label
            htmlFor='job-select'
            className='block text-sm font-medium text-gray-700'
          >
            Select a Job Title
          </label>
          <select
            id='job-select'
            className='mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm'
            onChange={handleJobChange}
            value={selectedJobCode || ""}
          >
            <option value='' disabled>
              -- Select a Job --
            </option>
            {jobs.map((job) => (
              <option key={job.code} value={job.code}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload CVs</CardTitle>
            <CardDescription>
              Upload multiple CV files to process and add to the ranking system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader
              onFilesSelected={handleFilesSelected}
              accept='.pdf'
              multiple={true}
            />

            {files.length > 0 && (
              <div className='mt-6'>
                <h3 className='text-sm font-medium mb-2'>
                  Selected Files ({files.length})
                </h3>
                <div className='border rounded-md divide-y'>
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className='flex items-center justify-between p-3'
                    >
                      <div className='flex items-center gap-2'>
                        <FileText className='h-4 w-4 text-muted-foreground' />
                        <span className='text-sm'>{file.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          ({(file.size / 1024).toFixed(1)} KB)
                        </span>
                      </div>
                      <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => removeFile(file.name)}
                        disabled={isProcessing}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className='mt-6 space-y-2'>
                <div className='flex justify-between text-sm'>
                  <span>Processing CVs...</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className='h-2' />
                {currentProcessingFile && (
                  <div className='text-sm text-gray-900 mt-2 flex items-center'>
                    <Loader2 className='h-3 w-3 animate-spin mr-2' />
                    Processing: {currentProcessingFile}
                  </div>
                )}
              </div>
            )}

            {(processedFiles.success.length > 0 ||
              processedFiles.failed.length > 0) && (
              <div className='mt-6 space-y-4'>
                {processedFiles.success.length > 0 && (
                  <div>
                    <h3 className='text-sm font-medium flex items-center gap-1 text-gray-900 mb-2'>
                      <CheckCircle className='h-4 w-4 text-gray-900' />
                      Successfully Processed ({processedFiles.success.length})
                    </h3>
                    <div className='border border-gray-200 bg-gray-50 rounded-md divide-y'>
                      {processedFiles.success.map((fileName, index) => (
                        <div
                          key={index}
                          className='p-2 text-sm flex items-center justify-between'
                        >
                          <div className='flex items-center gap-2'>
                            <span>{fileName}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {processedFiles.failed.length > 0 && (
                  <div>
                    <h3 className='text-sm font-medium flex items-center gap-1 text-red-600 mb-2'>
                      <AlertCircle className='h-4 w-4' />
                      Failed to Process ({processedFiles.failed.length})
                    </h3>
                    <div className='border border-red-200 bg-red-50 rounded-md divide-y'>
                      {processedFiles.failed.map((fileName, index) => (
                        <div key={index} className='p-2 text-sm'>
                          {fileName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className='flex justify-between'>
            <Button
              variant='outline'
              onClick={clearAll}
              disabled={isProcessing || files.length === 0}
            >
              Clear All
            </Button>
            <Button
              onClick={handleProcessCVs}
              disabled={isProcessing || files.length === 0}
            >
              {isProcessing ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className='mr-2 h-4 w-4' />
                  Process CVs
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {processedFiles.success.length > 0 && (
          <div className='flex justify-center'>
            <Button asChild>
              <Link href='/cv-ranking'>Go to CV Ranking</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Upload, FileText, CheckCircle, AlertCircle, Loader2, Info } from "lucide-react"
import Link from "next/link"
import { processCVs } from "@/lib/process-cvs"
import type { TemplateInfo } from "@/lib/template-detection"
import { useCandidates } from "../../../context/candidates-context"
import { useToast } from "../../../hooks/use-toast"
import { Progress } from "@radix-ui/react-progress"
import { Button } from "../../../components/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../../components/card"
import { FileUploader } from "../../../components/file-uploader"
import { TemplateBadge } from "../../../components/template-badge"

export default function CVUploadPage() {
  const { toast } = useToast()
  const candidatesContext = useCandidates()
  const [files, setFiles] = useState<File[]>([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [processedFiles, setProcessedFiles] = useState<{
    success: string[]
    failed: string[]
  }>({
    success: [],
    failed: [],
  })
  const [templateInfo, setTemplateInfo] = useState<Record<string, TemplateInfo>>({})
  const [processingProgress, setProcessingProgress] = useState(0)

  // Check if addCandidates is available
  useEffect(() => {
    if (!candidatesContext.addCandidates) {
      console.error("addCandidates function is not available in the context")
      toast({
        title: "Application Error",
        description: "There was an issue with the application. Please refresh the page.",
        variant: "destructive",
        duration: 5000,
      })
    }
  }, [candidatesContext, toast])

  const handleFilesSelected = (selectedFiles: File[]) => {
    // Filter for PDF files only
    const pdfFiles = selectedFiles.filter(
      (file) => file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf"),
    )

    if (pdfFiles.length !== selectedFiles.length) {
      toast({
        title: "Invalid file type",
        description: "Only PDF files are accepted",
        variant: "destructive",
      })
    }

    setFiles((prevFiles) => [...prevFiles, ...pdfFiles])
  }

  const removeFile = (fileName: string) => {
    setFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName))

    // Also remove template info if it exists
    if (templateInfo[fileName]) {
      const newTemplateInfo = { ...templateInfo }
      delete newTemplateInfo[fileName]
      setTemplateInfo(newTemplateInfo)
    }
  }

  const handleProcessCVs = async () => {
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please select at least one CV to process",
        variant: "destructive",
      })
      return
    }

    // Check if addCandidates is available
    if (!candidatesContext.addCandidates) {
      toast({
        title: "Application Error",
        description: "There was an issue with the application. Please refresh the page.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)
    setProcessedFiles({ success: [], failed: [] })
    setProcessingProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProcessingProgress((prev) => {
          const newProgress = prev + (5 + Math.floor(Math.random() * 10))
          return newProgress >= 95 ? 95 : newProgress
        })
      }, 300)

      // In a real app, we would send the files to a server for processing
      // Here we'll use a mock function to simulate processing
      const results = await processCVs(files)

      clearInterval(progressInterval)
      setProcessingProgress(100)

      // Add the successfully processed candidates to the context
      if (results.candidates.length > 0 && candidatesContext.addCandidates) {
        candidatesContext.addCandidates(results.candidates)
      }

      // Update the processed files state
      setProcessedFiles({
        success: results.success,
        failed: results.failed,
      })

      // Update template info
      setTemplateInfo(results.templateInfo)

      toast({
        title: "CVs processed",
        description: `Successfully processed ${results.success.length} out of ${files.length} CVs`,
        duration: 5000,
      })
    } catch (error) {
      console.error("Error processing CVs:", error)
      toast({
        title: "Processing failed",
        description: "An error occurred while processing the CVs",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const clearAll = () => {
    setFiles([])
    setProcessedFiles({ success: [], failed: [] })
    setTemplateInfo({})
    setProcessingProgress(0)
  }

  // Calculate template statistics
  const templateStats = Object.values(templateInfo).reduce(
    (acc, template) => {
      acc[template.id] = (acc[template.id] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  // Calculate average confidence
  const avgConfidence = Object.values(templateInfo).length
    ? Math.round(
      Object.values(templateInfo).reduce((sum, t) => sum + t.confidence, 0) / Object.values(templateInfo).length,
    )
    : 0

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6 md:px-8">
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" asChild>
            <Link href="/cv-ranking">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">CV Upload</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload CVs</CardTitle>
            <CardDescription>Upload multiple CV files to process and add to the ranking system</CardDescription>
          </CardHeader>
          <CardContent>
            <FileUploader onFilesSelected={handleFilesSelected} accept=".pdf" multiple={true} />

            {files.length > 0 && (
              <div className="mt-6">
                <h3 className="text-sm font-medium mb-2">Selected Files ({files.length})</h3>
                <div className="border rounded-md divide-y">
                  {files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-muted-foreground">({(file.size / 1024).toFixed(1)} KB)</span>
                        {templateInfo[file.name] && <TemplateBadge template={templateInfo[file.name]} />}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeFile(file.name)} disabled={isProcessing}>
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isProcessing && (
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Processing CVs...</span>
                  <span>{processingProgress}%</span>
                </div>
                <Progress value={processingProgress} className="h-2" />
              </div>
            )}

            {Object.keys(templateInfo).length > 0 && (
              <div className="mt-6 p-4 bg-muted/30 rounded-md">
                <h3 className="text-sm font-medium flex items-center gap-1 mb-3">
                  <Info className="h-4 w-4 text-primary" />
                  Template Detection Results
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm mb-2">Detected Templates:</p>
                    <div className="space-y-1">
                      {Object.entries(templateStats).map(([templateId, count]) => (
                        <div key={templateId} className="flex items-center justify-between text-sm">
                          <span>{templateId.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm mb-2">Detection Statistics:</p>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>Average Confidence</span>
                        <span className="font-medium">{avgConfidence}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Total Files Analyzed</span>
                        <span className="font-medium">{Object.keys(templateInfo).length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span>Unknown Formats</span>
                        <span className="font-medium">{templateStats["unknown"] || 0}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {(processedFiles.success.length > 0 || processedFiles.failed.length > 0) && (
              <div className="mt-6 space-y-4">
                {processedFiles.success.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1 text-green-600 mb-2">
                      <CheckCircle className="h-4 w-4" />
                      Successfully Processed ({processedFiles.success.length})
                    </h3>
                    <div className="border border-green-200 bg-green-50 rounded-md divide-y">
                      {processedFiles.success.map((fileName, index) => (
                        <div key={index} className="p-2 text-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span>{fileName}</span>
                            {templateInfo[fileName] && (
                              <TemplateBadge template={templateInfo[fileName]} showConfidence={true} />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {processedFiles.failed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium flex items-center gap-1 text-red-600 mb-2">
                      <AlertCircle className="h-4 w-4" />
                      Failed to Process ({processedFiles.failed.length})
                    </h3>
                    <div className="border border-red-200 bg-red-50 rounded-md divide-y">
                      {processedFiles.failed.map((fileName, index) => (
                        <div key={index} className="p-2 text-sm">
                          {fileName}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" onClick={clearAll} disabled={isProcessing || files.length === 0}>
              Clear All
            </Button>
            <Button onClick={handleProcessCVs} disabled={isProcessing || files.length === 0}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Process CVs
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        {processedFiles.success.length > 0 && (
          <div className="flex justify-center">
            <Button asChild>
              <Link href="/cv-ranking">Go to CV Ranking</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

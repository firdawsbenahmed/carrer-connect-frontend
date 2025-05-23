"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, File } from "lucide-react"
import { Button } from "./button"

interface FileUploaderProps {
    onFilesSelected: (files: File[]) => void
    accept?: string
    multiple?: boolean
}

export function FileUploader({ onFilesSelected, accept = "*", multiple = false }: FileUploaderProps) {
    const [isDragging, setIsDragging] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(true)
    }

    const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)
    }

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDragging(false)

        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const droppedFiles = Array.from(e.dataTransfer.files)
            onFilesSelected(droppedFiles)
        }
    }

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFiles = Array.from(e.target.files)
            onFilesSelected(selectedFiles)

            // Reset the file input so the same file can be selected again if needed
            if (fileInputRef.current) {
                fileInputRef.current.value = ""
            }
        }
    }

    const handleButtonClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    return (
        <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25"
                }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileInputChange}
                accept={accept}
                multiple={multiple}
                className="hidden"
            />
            <div className="flex flex-col items-center justify-center gap-4">
                <div className="rounded-full bg-muted p-3">
                    <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
                <div>
                    <p className="text-sm font-medium">Drag and drop your {multiple ? "files" : "file"} here</p>
                    <p className="text-xs text-muted-foreground mt-1">or click to browse from your computer</p>
                </div>
                <Button type="button" variant="outline" onClick={handleButtonClick}>
                    <File className="mr-2 h-4 w-4" />
                    Browse Files
                </Button>
                {accept !== "*" && (
                    <p className="text-xs text-muted-foreground">Accepted file types: {accept.split(",").join(", ")}</p>
                )}
            </div>
        </div>
    )
}

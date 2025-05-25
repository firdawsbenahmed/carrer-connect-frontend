"use client";

import { Button } from "@/components/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/card";
import { Badge } from "@/components/badge";
import { FileText, Star, User, Download } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCandidates } from "@/context/candidates-context";

export default function CVRankingPage() {
  const { toast } = useToast();
  const { simpleCandidates, reportUrl } = useCandidates();

  const downloadReport = async () => {
    if (!reportUrl) {
      toast({
        title: "No report available",
        description: "Please process some CVs first to generate a report.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    // Construct the full URL using the base URL from the server
    const fullUrl = `http://127.0.0.1:8000${reportUrl}`;

    try {
      // Fetch the report
      const response = await fetch(fullUrl);
      if (!response.ok) throw new Error("Failed to download report");

      // Convert response to blob
      const blob = await response.blob();

      // Create download link
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = reportUrl.split("/").pop() || "report.pdf"; // Extract filename from URL
      document.body.appendChild(a);
      a.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Report downloaded",
        description: "The analysis report has been downloaded successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error("Error downloading report:", error);
      toast({
        title: "Download failed",
        description: "Failed to download the report. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className='container mx-auto py-8 px-4 sm:px-6 md:px-8'>
      <div className='flex flex-col gap-6'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-3xl font-bold'>CV Ranking</h1>
          <p className='text-muted-foreground'>
            Review and select the best candidates for your open positions
          </p>
        </div>

        <div className='flex justify-between items-center'>
          <div className='flex items-center gap-2'>
            <Badge variant='outline' className='px-3 py-1'>
              {simpleCandidates.length} Candidates
            </Badge>
          </div>
          <div className='flex gap-2'>
            <Button onClick={downloadReport}>
              <Download className='mr-2 h-4 w-4' />
              Download Analysis Report
            </Button>
          </div>
        </div>

        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {simpleCandidates.map((candidate) => (
            <Card key={candidate.id}>
              <CardHeader className='pb-2'>
                <div className='flex justify-between items-start'>
                  <div className='flex flex-col'>
                    <CardTitle>{candidate.name}</CardTitle>
                    <CardDescription>{candidate.position}</CardDescription>
                  </div>
                  <div className='flex items-center gap-1 bg-muted px-2 py-1 rounded-md'>
                    <Star className='h-4 w-4 fill-primary text-primary' />
                    <span className='font-medium'>{candidate.matchScore}%</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className='pb-2'>
                <div className='space-y-3'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-muted-foreground' />
                    <span className='text-sm'>Skills:</span>
                    <div className='flex flex-wrap gap-1'>
                      {candidate.skills.map((skill, skillIndex) => (
                        <Badge
                          key={`${candidate.id}-${skill}-${skillIndex}`}
                          variant='secondary'
                          className='text-xs'
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className='flex justify-between'>
                <Button variant='outline' size='sm' asChild>
                  <Link href={`/cv-details/${candidate.id}`}>
                    <FileText className='mr-2 h-4 w-4' />
                    View CV Details
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

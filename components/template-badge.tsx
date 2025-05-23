import {
    FileText,
    GraduationCap,
    Palette,
    Code,
    Briefcase,
    CheckCircle,
    Linkedin,
    Globe,
    HelpCircle,
    type LucideIcon,
} from "lucide-react"
import type { TemplateInfo } from "@/lib/template-detection"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./tooltip"
import { Badge } from "./badge"

// Map template IDs to icons
const templateIcons: Record<string, LucideIcon> = {
    standard: FileText,
    academic: GraduationCap,
    creative: Palette,
    technical: Code,
    executive: Briefcase,
    "ats-friendly": CheckCircle,
    linkedin: Linkedin,
    europass: Globe,
    unknown: HelpCircle,
}

interface TemplateBadgeProps {
    template: TemplateInfo
    showConfidence?: boolean
}

export function TemplateBadge({ template, showConfidence = false }: TemplateBadgeProps) {
    const Icon = templateIcons[template.id] || HelpCircle

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Badge variant="outline" className="flex items-center gap-1 px-2 py-1">
                        <Icon className="h-3 w-3" />
                        <span>{template.name}</span>
                        {showConfidence && <span className="text-xs text-muted-foreground ml-1">({template.confidence}%)</span>}
                    </Badge>
                </TooltipTrigger>
                <TooltipContent>
                    <div className="space-y-1 max-w-xs">
                        <p className="font-medium">{template.name}</p>
                        <p className="text-xs">{template.description}</p>
                        {showConfidence && (
                            <p className="text-xs">
                                Detection confidence: {template.confidence}%<br />
                                Parsing accuracy: {template.parsingAccuracy}%
                            </p>
                        )}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )
}

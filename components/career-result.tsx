import { ArrowUpRight, DollarSign } from "lucide-react";
import { Badge } from "./badge";
import { Button } from "./button";
import { Card, CardHeader, CardContent, CardFooter } from "./card";
import { Progress } from "./progress";

interface CareerResultProps {
  career: {
    title: string;
    matchScore: number;
    keySkills: string[];
    salary: string;
  };
}

export function CareerResult({ career }: CareerResultProps) {
  return (
    <Card className='overflow-hidden transition-all hover:shadow-md'>
      <CardHeader className='pb-4'>
        <div className='flex items-center justify-between'>
          <h3 className='text-xl font-bold'>{career.title}</h3>
          <div className='flex items-center gap-1.5'>
            <span className='text-sm font-medium'>Match:</span>
            <Badge
              variant={career.matchScore > 90 ? "default" : "secondary"}
              className={`px-2.5 ${
                career.matchScore > 90
                  ? "bg-green-500 hover:bg-green-500/90"
                  : ""
              }`}
            >
              {career.matchScore}%
            </Badge>
          </div>
        </div>
        <Progress value={career.matchScore} className='h-1.5 mt-2' />
      </CardHeader>
      <CardContent className='pb-4'>
        <div className='mb-4'>
          <div className='flex items-center gap-2'>
            <DollarSign className='h-4 w-4 text-muted-foreground' />
            <span className='text-sm'>
              Salary Range: <span className='font-medium'>{career.salary}</span>
            </span>
          </div>
        </div>

        <div>
          <h4 className='text-sm font-medium mb-2'>Key Skills</h4>
          <div className='flex flex-wrap gap-2'>
            {career.keySkills.map((skill) => (
              <Badge key={skill} variant='outline' className='px-2.5 py-0.5'>
                {skill}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className='border-t pt-4'>
        <Button variant='outline' size='sm' className='ml-auto'>
          Learn More
          <ArrowUpRight className='ml-1.5 h-3.5 w-3.5' />
        </Button>
      </CardFooter>
    </Card>
  );
}

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CheckCircle, XCircle, Paperclip, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TutorApplication {
  id: number;
  studentName: string;
  studentEmail: string;
  subjects: string[];
  transcriptUrl: string;
  status: 'pending' | 'accepted' | 'rejected';
  appliedDate: string;
}

// Mock data
const mockApplications: TutorApplication[] = [
  {
    id: 1,
    studentName: 'John Anderson',
    studentEmail: 'john.anderson@campus.edu',
    subjects: ['Mathematics', 'Physics'],
    transcriptUrl: '/sample-transcript-1.pdf',
    status: 'pending',
    appliedDate: '2024-01-15',
  },
  {
    id: 2,
    studentName: 'Emily Davis',
    studentEmail: 'emily.davis@campus.edu',
    subjects: ['Chemistry', 'Biology'],
    transcriptUrl: '/sample-transcript-2.pdf',
    status: 'pending',
    appliedDate: '2024-01-14',
  },
  {
    id: 3,
    studentName: 'Michael Brown',
    studentEmail: 'michael.brown@campus.edu',
    subjects: ['Computer Science', 'Mathematics'],
    transcriptUrl: '/sample-transcript-3.pdf',
    status: 'accepted',
    appliedDate: '2024-01-12',
  },
  {
    id: 4,
    studentName: 'Sarah Wilson',
    studentEmail: 'sarah.wilson@campus.edu',
    subjects: ['English Literature', 'History'],
    transcriptUrl: '/sample-transcript-4.pdf',
    status: 'rejected',
    appliedDate: '2024-01-10',
  },
];

export default function TutorApplicationsTab() {
  const [applications, setApplications] = useState<TutorApplication[]>(mockApplications);
  const { toast } = useToast();

  const handleAccept = (id: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: 'accepted' as const } : app
      )
    );
    toast({
      title: 'Application Accepted',
      description: 'The tutor application has been accepted.',
    });
  };

  const handleReject = (id: number) => {
    setApplications(prev =>
      prev.map(app =>
        app.id === id ? { ...app, status: 'rejected' as const } : app
      )
    );
    toast({
      title: 'Application Rejected',
      description: 'The tutor application has been rejected.',
      variant: 'destructive',
    });
  };

  const handleViewTranscript = (transcriptUrl: string, studentName: string) => {
    // In a real app, this would open the PDF in a new tab or modal
    toast({
      title: 'Opening Transcript',
      description: `Opening transcript for ${studentName}`,
    });
    // Simulating opening a PDF
    window.open(transcriptUrl, '_blank');
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge className="bg-success text-success-foreground">Accepted</Badge>;
      case 'rejected':
        return <Badge className="bg-destructive text-destructive-foreground">Rejected</Badge>;
      case 'pending':
        return <Badge className="bg-warning text-warning-foreground">Pending</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tutor Applications</CardTitle>
        <CardDescription>Review and manage tutor applications from students</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Student Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subjects</TableHead>
              <TableHead>Transcript</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((application) => (
              <TableRow key={application.id}>
                <TableCell className="font-medium">{application.studentName}</TableCell>
                <TableCell>{application.studentEmail}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {application.subjects.map((subject, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {subject}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewTranscript(application.transcriptUrl, application.studentName)}
                  >
                    <Paperclip className="h-4 w-4 mr-1" />
                    View
                  </Button>
                </TableCell>
                <TableCell>{application.appliedDate}</TableCell>
                <TableCell>{getStatusBadge(application.status)}</TableCell>
                <TableCell>
                  {application.status === 'pending' ? (
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAccept(application.id)}
                        className="text-success hover:text-success hover:bg-success/10"
                      >
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReject(application.id)}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <span className="text-muted-foreground text-sm">—</span>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

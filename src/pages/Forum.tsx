import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CreatePostModal } from '@/components/ui/CreatePostModal';
import {
  MessageSquare,
  Search,
  Plus,
  TrendingUp,
  Clock,
  Users,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Pin,
  ArrowUp,
  ArrowDown,
  Share,
  MoreHorizontal,
} from 'lucide-react';

export default function Forum() {
  const [searchQuery, setSearchQuery] = useState('');
  const [createPostOpen, setCreatePostOpen] = useState(false);

  const forumPosts = [
    {
      id: 1,
      title: 'Help with Calculus Integration by Parts',
      content: 'I\'m struggling with integration by parts. Can someone explain the u-dv method?',
      author: 'Sarah Johnson',
      avatar: '/api/placeholder/40/40',
      timestamp: '2 hours ago',
      category: 'Mathematics',
      replies: 8,
      upvotes: 12,
      downvotes: 2,
      isPinned: true,
      tags: ['calculus', 'integration', 'help'],
      community: 'r/Mathematics'
    },
    {
      id: 2,
      title: 'Best Resources for Data Structures Practice',
      content: 'Looking for good websites or books to practice data structures problems.',
      author: 'Mike Chen',
      avatar: '/api/placeholder/40/40',
      timestamp: '4 hours ago',
      category: 'Computer Science',
      replies: 15,
      upvotes: 23,
      downvotes: 1,
      isPinned: false,
      tags: ['data-structures', 'resources', 'practice'],
      community: 'r/ComputerScience'
    },
    {
      id: 3,
      title: 'Study Group for Organic Chemistry Final',
      content: 'Anyone interested in forming a study group for the upcoming org chem final?',
      author: 'Emma Rodriguez',
      avatar: '/api/placeholder/40/40',
      timestamp: '6 hours ago',
      category: 'Chemistry',
      replies: 6,
      upvotes: 9,
      downvotes: 0,
      isPinned: false,
      tags: ['chemistry', 'study-group', 'finals'],
      community: 'r/Chemistry'
    },
  ];

  const categories = [
    { name: 'Mathematics', count: 45, color: 'bg-primary' },
    { name: 'Computer Science', count: 38, color: 'bg-secondary' },
    { name: 'Chemistry', count: 22, color: 'bg-success' },
    { name: 'Physics', count: 19, color: 'bg-warning' },
    { name: 'General', count: 67, color: 'bg-muted' },
  ];

  const recentPosts = [
    { 
      id: 1, 
      title: 'I want to create a small game for my girlfriend\'s birthday. Any suggestions or...', 
      community: 'r/IndieDev',
      timeAgo: '7 mo. ago',
      upvotes: 10,
      comments: 27,
      thumbnail: '/api/placeholder/60/40'
    },
    { 
      id: 2, 
      title: 'Games that my long distance girlfriend and I could play together', 
      community: 'r/gamingsuggestions',
      timeAgo: '2 yr. ago',
      upvotes: 114,
      comments: 92,
      thumbnail: null
    },
    { 
      id: 3, 
      title: 'I made a website for my girlfriend and I to play...', 
      community: 'r/LDR',
      timeAgo: '7 mo. ago',
      upvotes: 88,
      comments: 7,
      thumbnail: '/api/placeholder/60/40'
    },
  ];

  const trendingTopics = [
    { tag: 'finals-prep', count: 24 },
    { tag: 'study-tips', count: 18 },
    { tag: 'calculus', count: 15 },
    { tag: 'programming', count: 12 },
    { tag: 'exam-help', count: 10 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Community Forum</h1>
          <p className="text-muted-foreground">Connect, share knowledge, and get help from fellow students</p>
        </div>
        <Button 
          className="bg-gradient-primary hover:opacity-90"
          onClick={() => setCreatePostOpen(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Search and Tabs */}
          <Card>
            <CardContent className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <Tabs defaultValue="recent" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="recent">Recent</TabsTrigger>
                  <TabsTrigger value="trending">Trending</TabsTrigger>
                  <TabsTrigger value="unanswered">Unanswered</TabsTrigger>
                  <TabsTrigger value="following">Following</TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Forum Posts */}
          <div className="space-y-2">
            {forumPosts.map((post) => (
              <Card key={post.id} className="hover:shadow-custom-md transition-shadow border-l-2 border-l-transparent hover:border-l-primary">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    {/* Voting */}
                    <div className="flex flex-col items-center space-y-1 min-w-[40px]">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-orange-500">
                        <ArrowUp className="h-4 w-4" />
                      </Button>
                      <span className="text-sm font-medium text-muted-foreground">
                        {post.upvotes - post.downvotes}
                      </span>
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:text-blue-500">
                        <ArrowDown className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground mb-2">
                        <span className="font-medium hover:underline cursor-pointer">{post.community}</span>
                        <span>•</span>
                        <span>Posted by u/{post.author}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                        {post.isPinned && (
                          <>
                            <span>•</span>
                            <div className="flex items-center text-green-600">
                              <Pin className="h-3 w-3 mr-1" />
                              <span>Pinned</span>
                            </div>
                          </>
                        )}
                      </div>

                      <h3 className="font-medium text-foreground hover:text-primary cursor-pointer mb-2 line-clamp-2">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{post.content}</p>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>

                      {/* Actions */}
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-muted">
                          <MessageCircle className="mr-1 h-3 w-3" />
                          {post.replies} Comments
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-muted">
                          <Share className="mr-1 h-3 w-3" />
                          Share
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 px-2 hover:bg-muted">
                          <MoreHorizontal className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Left Sidebar - Categories */}
        <div className="lg:col-span-1 space-y-6">
          {/* Categories */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {categories.map((category) => (
                <div key={category.name} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`} />
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {category.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Trending Topics */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-4 w-4" />
                Trending Topics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {trendingTopics.map((topic) => (
                <div key={topic.tag} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <span className="text-sm font-medium">#{topic.tag}</span>
                  <Badge variant="outline" className="text-xs">
                    {topic.count}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar - Recent Posts */}
        <div className="lg:col-span-1 space-y-6">
          {/* Recent Posts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Recent Posts</CardTitle>
              <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                Clear
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentPosts.map((post) => (
                <div key={post.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1 text-xs text-muted-foreground mb-1">
                      <span className="font-medium">{post.community}</span>
                      <span>•</span>
                      <span>{post.timeAgo}</span>
                    </div>
                    <h4 className="text-sm font-medium line-clamp-2 mb-2">
                      {post.title}
                    </h4>
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <span>{post.upvotes} upvotes</span>
                      <span>{post.comments} comments</span>
                    </div>
                  </div>
                  {post.thumbnail && (
                    <div className="w-12 h-8 bg-muted rounded overflow-hidden flex-shrink-0">
                      <div className="w-full h-full bg-gradient-subtle" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      <CreatePostModal 
        open={createPostOpen} 
        onOpenChange={setCreatePostOpen}
      />
    </div>
  );
}
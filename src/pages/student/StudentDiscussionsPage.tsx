import React, { useState } from "react";
import {
  MessageSquare,
  Search,
  PlusCircle,
  ThumbsUp,
  Tag,
  AlertCircle,
  CheckCircle2,
  Users,
  Flag,
  Send,
  User,
  Clock,
  Filter,
  Sparkles,
  BookOpen,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNotifications } from "@/context/NotificationContext";

interface DiscussionReply {
  id: string;
  author: string;
  role: "student" | "faculty" | "ta";
  content: string;
  timestamp: string;
  likes: number;
}

interface DiscussionPost {
  id: string;
  course: string;
  title: string;
  author: string;
  taggedFaculty?: string;
  content: string;
  timestamp: string;
  likes: number;
  hasLiked?: boolean;
  replies: DiscussionReply[];
}

export const StudentDiscussionsPage: React.FC = () => {
  const { addNotification } = useNotifications();

  const [posts, setPosts] = useState<DiscussionPost[]>([
    {
      id: "disc-1",
      course: "Full-Stack AI Engineering",
      title: "Why does PagedAttention avoid external memory fragmentation in CUDA allocations?",
      author: "Arjun Mehta (You)",
      taggedFaculty: "@Prof. Rajesh Verma",
      content:
        "In lecture 1.2, Prof. Verma noted that standard continuous KV buffers suffer from 60-80% memory waste. How does PagedAttention's block table map virtual continuous token keys to non-contiguous physical blocks without cache invalidation penalties?",
      timestamp: "Today, 11:15 AM",
      likes: 12,
      hasLiked: false,
      replies: [
        {
          id: "rep-1",
          author: "Prof. Rajesh Verma",
          role: "faculty",
          content:
            "Great question, Arjun! The key is that the GPU kernel accesses the block table in SRAM prior to computing QK^T. Since pages are fixed size (e.g. 16 or 32 tokens), the memory allocator never has to search for variable-sized free chunks, entirely eliminating external fragmentation.",
          timestamp: "Today, 12:40 PM",
          likes: 9,
        },
        {
          id: "rep-2",
          author: "Kavita Rao",
          role: "student",
          content:
            "To add to Prof.'s point: this also enables zero-copy prompt sharing across parallel decoding streams during fork-and-join agent branching!",
          timestamp: "Today, 01:05 PM",
          likes: 4,
        },
      ],
    },
    {
      id: "disc-2",
      course: "Distributed Systems & KV-Cache",
      title: "Recommended chunk overlap when indexing technical code with recursive character splitter?",
      author: "Sneha Reddy",
      taggedFaculty: "@Karthik Sundaram",
      content:
        "For Python AST parsing, does 15% overlap guarantee that function decorator headers won't be truncated across chunk boundaries?",
      timestamp: "Yesterday",
      likes: 8,
      hasLiked: false,
      replies: [
        {
          id: "rep-3",
          author: "Karthik Sundaram",
          role: "faculty",
          content:
            "For codebases, prefer AST-aware splitters like tree-sitter rather than pure character splitters. If using character splitting, use at least 20-25% overlap with `\ndef ` and `\nclass ` as primary split delimiters.",
          timestamp: "Yesterday",
          likes: 7,
        },
      ],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  // Ask Question Modal
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("Full-Stack AI Engineering");
  const [newTaggedFaculty, setNewTaggedFaculty] = useState("@Prof. Rajesh Verma");
  const [newContent, setNewContent] = useState("");

  // Report Inappropriate Content Modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportedPostId, setReportedPostId] = useState("");
  const [reportReason, setReportReason] = useState("Off-topic or spam");

  // Inline Reply state
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});

  const handleToggleLike = (postId: string) => {
    setPosts(
      posts.map((p) => {
        if (p.id === postId) {
          const hasLiked = !p.hasLiked;
          return {
            ...p,
            hasLiked,
            likes: hasLiked ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: DiscussionPost = {
      id: `disc-${Date.now()}`,
      course: newCourse,
      title: newTitle,
      author: "Arjun Mehta (You)",
      taggedFaculty: newTaggedFaculty,
      content: newContent,
      timestamp: "Just now",
      likes: 0,
      replies: [],
    };

    setPosts([newPost, ...posts]);
    setIsAskModalOpen(false);
    setNewTitle("");
    setNewContent("");

    addNotification({
      title: "Question Posted to Forum",
      message: `Your discussion thread "${newTitle}" has been published.`,
      type: "system",
    });
  };

  const handleAddReply = (postId: string) => {
    const text = replyDrafts[postId];
    if (!text || !text.trim()) return;

    const newReply: DiscussionReply = {
      id: `rep-${Date.now()}`,
      author: "Arjun Mehta (You)",
      role: "student",
      content: text,
      timestamp: "Just now",
      likes: 0,
    };

    setPosts(
      posts.map((p) => (p.id === postId ? { ...p, replies: [...p.replies, newReply] } : p))
    );

    setReplyDrafts({ ...replyDrafts, [postId]: "" });

    addNotification({
      title: "Reply Published",
      message: "Your answer was posted to the discussion thread.",
      type: "system",
    });
  };

  const handleReportPost = () => {
    setIsReportModalOpen(false);
    addNotification({
      title: "Report Submitted",
      message: "Our faculty moderators have received your report for review.",
      type: "system",
    });
  };

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCourse = courseFilter === "All" || p.course === courseFilter;
    return matchesSearch && matchesCourse;
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-2.5">
            <MessageSquare className="h-6 w-6 text-primary" /> Course Discussions & Study Groups
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Ask technical questions, tag course faculty, exchange lab insights, and join peer study circles.
          </p>
        </div>

        <Button
          onClick={() => setIsAskModalOpen(true)}
          className="gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-xs h-9 shadow-sm self-start sm:self-auto"
        >
          <PlusCircle className="h-3.5 w-3.5" /> Ask a Question
        </Button>
      </div>

      {/* Active Study Circles Bar */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-4 bg-muted/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <Users className="h-5 w-5 text-primary shrink-0" />
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-foreground">Active Peer Study Groups</h4>
              <p className="text-[11px] text-muted-foreground">
                Cohort 7 LangGraph Swarm Team (4 members) • Weekend vLLM Profiling Lab (6 members)
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => alert("Joined Cohort 7 Study Circle room.")}
            className="text-xs rounded-xl h-8 border-primary/30 text-primary hover:bg-primary/10 self-start md:self-auto"
          >
            Join Active Study Circle
          </Button>
        </div>
      </Card>

      {/* Search and Filters */}
      <Card className="rounded-2xl border-border/60 shadow-sm p-3.5">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:max-w-xs">
            <Search className="h-3.5 w-3.5 absolute left-3 top-3 text-muted-foreground" />
            <Input
              placeholder="Search forum questions & topics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 h-9 rounded-xl text-xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={courseFilter}
              onChange={(e) => setCourseFilter(e.target.value)}
              className="h-9 rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary w-full sm:w-auto"
            >
              <option value="All">All Courses</option>
              <option value="Full-Stack AI Engineering">Full-Stack AI Engineering</option>
              <option value="Distributed Systems & KV-Cache">Distributed Systems & KV-Cache</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Posts Stream */}
      <div className="space-y-4">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="rounded-2xl border-border/70 shadow-sm p-5 space-y-4">
            {/* Post Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 border-b border-border/40 pb-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="text-[10px] font-mono">
                    {post.course}
                  </Badge>
                  {post.taggedFaculty && (
                    <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-semibold">
                      Tagged: {post.taggedFaculty}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">• {post.timestamp}</span>
                </div>

                <h3 className="font-extrabold text-base text-foreground leading-snug">
                  {post.title}
                </h3>

                <p className="text-xs text-muted-foreground">
                  Asked by <strong className="text-foreground">{post.author}</strong>
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-start">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setReportedPostId(post.id);
                    setIsReportModalOpen(true);
                  }}
                  className="h-7 text-[11px] text-muted-foreground hover:text-destructive gap-1"
                >
                  <Flag className="h-3 w-3" /> Report
                </Button>
              </div>
            </div>

            {/* Post Content */}
            <p className="text-xs text-foreground/90 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>

            {/* Like Counter & Reply Toggle */}
            <div className="flex items-center gap-3 pt-1">
              <Button
                variant={post.hasLiked ? "default" : "outline"}
                size="sm"
                onClick={() => handleToggleLike(post.id)}
                className={`h-8 text-xs rounded-xl gap-1.5 ${
                  post.hasLiked ? "bg-primary text-primary-foreground" : ""
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>Helpful ({post.likes})</span>
              </Button>
              <span className="text-xs text-muted-foreground">
                {post.replies.length} {post.replies.length === 1 ? "response" : "responses"}
              </span>
            </div>

            {/* Nested Replies */}
            {post.replies.length > 0 && (
              <div className="space-y-2.5 pt-2 border-t border-border/40 pl-2 sm:pl-4">
                {post.replies.map((reply) => (
                  <div
                    key={reply.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${
                      reply.role === "faculty"
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-border/50"
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground">{reply.author}</span>
                        {reply.role === "faculty" && (
                          <Badge className="bg-primary text-primary-foreground text-[9px] font-bold">
                            Faculty Answer
                          </Badge>
                        )}
                      </div>
                      <span className="text-muted-foreground">{reply.timestamp}</span>
                    </div>

                    <p className="text-foreground leading-relaxed">{reply.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Reply Input */}
            <div className="pt-2 flex items-center gap-2">
              <Input
                placeholder="Write your answer or follow-up clarification..."
                value={replyDrafts[post.id] || ""}
                onChange={(e) => setReplyDrafts({ ...replyDrafts, [post.id]: e.target.value })}
                className="h-9 rounded-xl text-xs flex-1"
              />
              <Button
                size="sm"
                onClick={() => handleAddReply(post.id)}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs h-9 rounded-xl gap-1 shrink-0"
              >
                <Send className="h-3 w-3" /> Reply
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Modal: Ask Question */}
      <Dialog open={isAskModalOpen} onOpenChange={setIsAskModalOpen}>
        <DialogContent className="sm:max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold flex items-center gap-2">
              <PlusCircle className="h-5 w-5 text-primary" /> Ask a Question
            </DialogTitle>
            <DialogDescription className="text-xs">
              Post to the cohort discussion board. Tag instructors for official replies.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleCreatePost} className="space-y-4 pt-2">
            <div>
              <label className="text-xs font-semibold text-muted-foreground">Course *</label>
              <select
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Full-Stack AI Engineering">Full-Stack AI Engineering</option>
                <option value="Distributed Systems & KV-Cache">Distributed Systems & KV-Cache</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Tag Faculty / Instructor</label>
              <select
                value={newTaggedFaculty}
                onChange={(e) => setNewTaggedFaculty(e.target.value)}
                className="mt-1 h-9 w-full rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="@Prof. Rajesh Verma">@Prof. Rajesh Verma (Lead Faculty)</option>
                <option value="@Dr. Priya Sharma">@Dr. Priya Sharma (LLM Architect)</option>
                <option value="@Karthik Sundaram">@Karthik Sundaram (Staff MLOps)</option>
                <option value="">No tag</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Question Title *</label>
              <Input
                placeholder="e.g. How does cross-encoder reranking handle multi-lingual queries?"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="mt-1 h-9 rounded-xl text-xs"
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-muted-foreground">Detailed Description *</label>
              <textarea
                rows={4}
                placeholder="Include code snippets, lecture references, or specific questions..."
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-background p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAskModalOpen(false)}
                className="rounded-xl text-xs h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl text-xs h-9"
              >
                Post Question
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Report Content */}
      <Dialog open={isReportModalOpen} onOpenChange={setIsReportModalOpen}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold flex items-center gap-2 text-destructive">
              <Flag className="h-4 w-4" /> Report Inappropriate Content
            </DialogTitle>
            <DialogDescription className="text-xs">
              Help maintain a high academic standard in student discussions.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2">
            <label className="text-xs font-semibold text-muted-foreground">Select Reason</label>
            <select
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              className="h-9 w-full rounded-xl border border-input bg-background px-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="Off-topic or spam">Off-topic or spam</option>
              <option value="Academic dishonesty / Code dumping">Academic dishonesty / Code dumping</option>
              <option value="Harassment or rude conduct">Harassment or rude conduct</option>
              <option value="Misleading technical assertions">Misleading technical assertions</option>
            </select>
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReportModalOpen(false)}
              className="rounded-xl text-xs h-9"
            >
              Cancel
            </Button>
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReportPost}
              className="rounded-xl text-xs h-9"
            >
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

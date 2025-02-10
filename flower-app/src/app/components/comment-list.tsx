import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface Comment {
  id: string
  user: {
    name: string
    avatar: string
  }
  content: string
  createdAt: string
  likes: number
}

interface CommentListProps {
  comments: Comment[]
}

export function CommentList({ comments }: CommentListProps) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-4">
          <Avatar>
            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
            <AvatarFallback>{comment.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center space-x-2">
              <span className="font-medium">{comment.user.name}</span>
              <span className="text-xs text-muted-foreground">{comment.createdAt}</span>
            </div>
            <p className="text-sm">{comment.content}</p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <button className="hover:underline">返信</button>
              <button className="hover:underline">いいね！ {comment.likes}</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


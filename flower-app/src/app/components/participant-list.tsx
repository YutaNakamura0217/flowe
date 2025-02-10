import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface ParticipantListProps {
  participants: {
    id: string
    name: string
    avatar: string
  }[]
}

export function ParticipantList({ participants }: ParticipantListProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">参加者 ({participants.length})</h3>
      <div className="flex flex-wrap gap-2">
        {participants.map((participant) => (
          <Avatar key={participant.id} title={participant.name}>
            <AvatarImage src={participant.avatar} alt={participant.name} />
            <AvatarFallback>{participant.name[0]}</AvatarFallback>
          </Avatar>
        ))}
      </div>
    </div>
  )
}


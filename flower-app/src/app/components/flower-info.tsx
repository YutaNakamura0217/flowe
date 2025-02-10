import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FlowerInfoProps {
  name: string
  scientificName: string
  family: string
  origin: string
  characteristics: string
  careInstructions: string
}

export function FlowerInfo({
  name,
  scientificName,
  family,
  origin,
  characteristics,
  careInstructions,
}: FlowerInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="font-semibold">学名</h3>
          <p>{scientificName}</p>
        </div>
        <div>
          <h3 className="font-semibold">科名</h3>
          <p>{family}</p>
        </div>
        <div>
          <h3 className="font-semibold">原産地</h3>
          <p>{origin}</p>
        </div>
        <div>
          <h3 className="font-semibold">特徴</h3>
          <p>{characteristics}</p>
        </div>
        <div>
          <h3 className="font-semibold">育て方</h3>
          <p>{careInstructions}</p>
        </div>
      </CardContent>
    </Card>
  )
}


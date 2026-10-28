import Image from "next/image";
import { Avatar, Card } from "@heroui/react";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { getInitials } from "@/utils/tmdb-meta";

export interface PersonCardProps {
  name: string;
  subtitle?: string | null;
  imagePath?: string | null;
}

export default function PersonCard({
  name,
  subtitle,
  imagePath,
}: PersonCardProps) {
  const imageURL = imagePath
    ? bindTMDBimage({ path: imagePath, quality: "w342" })
    : null;

  return (
    <Card
      variant="transparent"
      className="border-separator/70 bg-surface h-full gap-0 overflow-hidden rounded-2xl border p-0"
    >
      <Card.Content className="p-0">
        <Avatar className="aspect-[2/3] h-auto w-full rounded-none">
          {imageURL && (
            <Avatar.Image asChild alt={name} src={imageURL}>
              <Image
                width={342}
                height={513}
                alt={name}
                className="size-full object-cover"
                src={imageURL}
              />
            </Avatar.Image>
          )}
          <Avatar.Fallback color="accent" className="text-2xl">
            {getInitials(name)}
          </Avatar.Fallback>
        </Avatar>
      </Card.Content>

      <Card.Header className="gap-0.5 px-3 py-3">
        <Card.Title className="text-foreground line-clamp-1 text-sm font-semibold">
          {name}
        </Card.Title>
        {subtitle && (
          <Card.Description className="line-clamp-1 text-xs">
            {subtitle}
          </Card.Description>
        )}
      </Card.Header>
    </Card>
  );
}

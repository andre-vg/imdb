import Image from "next/image";
import Link from "next/link";
import { Avatar, Card } from "@heroui/react";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { getInitials } from "@/utils/tmdb-meta";

export interface PersonCardProps {
  id?: number;
  name: string;
  subtitle?: string | null;
  imagePath?: string | null;
}

export default function PersonCard({
  id,
  name,
  subtitle,
  imagePath,
}: PersonCardProps) {
  const imageURL = imagePath
    ? bindTMDBimage({ path: imagePath, quality: "w342" })
    : null;

  const card = (
    <Card
      variant="transparent"
      className="border-separator/70 bg-surface group-hover:border-accent/40 h-full gap-0 overflow-hidden rounded-2xl border p-0 transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-1 group-hover:shadow-xl group-hover:shadow-black/10 motion-reduce:transform-none motion-reduce:transition-none"
    >
      <Card.Content className="p-0">
        <Avatar className="aspect-[2/3] h-auto w-full rounded-none">
          {imageURL && (
            <Avatar.Image asChild alt={name} src={imageURL}>
              <Image
                width={342}
                height={513}
                alt={name}
                className="size-full object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
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
        <Card.Title className="text-foreground group-hover:text-accent line-clamp-1 text-sm font-semibold transition-colors">
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

  if (!id) return card;

  return (
    <Link
      aria-label={`Ver perfil de ${name}`}
      className="group focus-visible:ring-accent focus-visible:ring-offset-background block h-full rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-4 focus-visible:outline-none"
      href={`/person/${id}`}
    >
      {card}
    </Link>
  );
}

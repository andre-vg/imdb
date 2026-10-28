import React from "react";
import { bindTMDBimage } from "@/utils/tmdb-images";
import { Card } from "@heroui/react";
import Image from "next/image";
import type { AppRouter } from "@/server/api/root";
import type { inferProcedureOutput } from "@trpc/server";
import { format, compareAsc } from "date-fns";
import Link from "next/link";

type Person = inferProcedureOutput<
  AppRouter["tmdb"]["movie"]["getCreditsById"]
>["cast"][number];

export default function PersonCard({ person }: { person: Person }) {
  return (
    <Link href={`person/${person.id}`}>
      <Card className="rounded-xl p-2">
        <Card.Content>
          {person.profile_path ? (
            <Image
              src={bindTMDBimage({
                path: person.profile_path,
                quality: "w342",
              })}
              className="max-h-64 rounded-lg"
              width={600}
              height={1000}
              alt={person.name}
            />
          ) : (
            <Image
              src={`https://ui-avatars.com/api/?size=512&name=${person.name.replaceAll(" ", "+")}`}
              className="max-h-64 rounded-lg"
              width={600}
              height={1000}
              alt={person.name}
            />
          )}
        </Card.Content>
        <Card.Header>
          <Card.Title className="font-semibold">{person.name}</Card.Title>
          <Card.Description>{person.character}</Card.Description>
        </Card.Header>
        <Card.Footer />
      </Card>
    </Link>
  );
}
// {format(person.release_date, "PPP")}

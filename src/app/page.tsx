import { api, HydrateClient } from "@/trpc/server";
import { Card } from "@heroui/react";

export default async function Home() {
  const test = await api.tmdb.movie.popular();

  return (
    <HydrateClient>
      <h1 className="text-2xl font-bold">Welcome to tRPC!</h1>

      <div className="grid grid-cols-5 gap-6">
        {test.results.map((movie) => (
          <Card key={movie.id}>
            <Card.Header>
              <Card.Title>{movie.title}</Card.Title>
              <Card.Description>{movie.overview}</Card.Description>
            </Card.Header>
            <Card.Content />
            <Card.Footer />
          </Card>
        ))}
      </div>
      
    </HydrateClient>
  );
}

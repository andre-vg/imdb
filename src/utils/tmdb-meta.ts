/**
 * Gêneros oficiais do TMDB. Usado para transformar `genre_ids` em nomes
 * legíveis sem precisar de uma requisição extra por filme.
 */
export const TMDB_GENRES: Readonly<Record<number, string>> = {
  28: "Ação",
  12: "Aventura",
  16: "Animação",
  35: "Comédia",
  80: "Crime",
  99: "Documentário",
  18: "Drama",
  10751: "Família",
  14: "Fantasia",
  36: "História",
  27: "Terror",
  10402: "Música",
  9648: "Mistério",
  10749: "Romance",
  878: "Ficção científica",
  10770: "Cinema TV",
  53: "Suspense",
  10752: "Guerra",
  37: "Faroeste",
};

export function getGenreNames(
  genreIds: readonly number[],
  limit = 2,
): string[] {
  const names: string[] = [];

  for (const id of genreIds) {
    const name = TMDB_GENRES[id];

    if (name) names.push(name);
    if (names.length >= limit) break;
  }

  return names;
}

export function getReleaseYear(
  releaseDate: string | null | undefined,
): string | null {
  if (!releaseDate) return null;

  const year = releaseDate.slice(0, 4);

  return /^\d{4}$/.test(year) ? year : null;
}

const compactNumber = new Intl.NumberFormat("pt-BR", {
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatVoteCount(voteCount: number) {
  return compactNumber.format(voteCount);
}

const compactCurrency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "USD",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatCurrency(value: number | null | undefined) {
  return value && value > 0 ? compactCurrency.format(value) : "—";
}

export function formatRuntime(minutes: number | null | undefined) {
  if (!minutes || minutes <= 0) return "—";

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;

  if (hours === 0) return `${rest}min`;
  if (rest === 0) return `${hours}h`;

  return `${hours}h ${rest}min`;
}

const longDate = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatFullDate(date: string | null | undefined) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  return Number.isNaN(parsed.getTime()) ? "—" : longDate.format(parsed);
}

export function formatReleaseDate(date: string | null | undefined) {
  return formatFullDate(date);
}

/**
 * Idade em anos completos. Quando `endDate` é informada (ex.: falecimento),
 * calcula a idade naquela data; caso contrário, usa a data atual.
 */
export function getAge(
  birthday: string | null | undefined,
  endDate?: string | null,
) {
  if (!birthday) return null;

  const birth = new Date(`${birthday}T00:00:00`);
  const end = endDate ? new Date(`${endDate}T00:00:00`) : new Date();

  if (Number.isNaN(birth.getTime()) || Number.isNaN(end.getTime())) {
    return null;
  }

  let age = end.getFullYear() - birth.getFullYear();
  const monthDiff = end.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
    age -= 1;
  }

  return age >= 0 ? age : null;
}

const DEPARTMENT_LABELS: Readonly<Record<string, string>> = {
  Acting: "Atuação",
  Directing: "Direção",
  Writing: "Roteiro",
  Production: "Produção",
  Sound: "Som",
  Camera: "Fotografia",
  Art: "Arte",
  "Costume & Make-Up": "Figurino e maquiagem",
  Editing: "Montagem",
  "Visual Effects": "Efeitos visuais",
  Lighting: "Iluminação",
  Crew: "Equipe",
};

export function translateDepartment(department: string | null | undefined) {
  if (!department) return "—";

  return DEPARTMENT_LABELS[department] ?? department;
}

const GENDER_LABELS: Readonly<Record<number, string>> = {
  0: "Não informado",
  1: "Feminino",
  2: "Masculino",
  3: "Não binário",
};

export function translateGender(gender: number | null | undefined) {
  if (gender === null || gender === undefined) return "Não informado";

  return GENDER_LABELS[gender] ?? "Não informado";
}

const JOB_LABELS: Readonly<Record<string, string>> = {
  Director: "Direção",
  Screenplay: "Roteiro",
  Writer: "Roteiro",
  Story: "História",
  Novel: "Obra original",
  Characters: "Personagens",
  Creator: "Criação",
  Producer: "Produção",
  "Executive Producer": "Produção executiva",
  "Co-Producer": "Coprodução",
  "Associate Producer": "Produção associada",
  "Line Producer": "Produção de linha",
  "Unit Production Manager": "Gerência de produção",
  "Production Manager": "Gerência de produção",
  "Director of Photography": "Fotografia",
  "Camera Operator": "Operação de câmera",
  "Steadicam Operator": "Operação de steadicam",
  "Still Photographer": "Fotografia still",
  Editor: "Montagem",
  "Original Music Composer": "Trilha sonora",
  "Music Supervisor": "Supervisão musical",
  "Production Design": "Design de produção",
  "Art Direction": "Direção de arte",
  "Set Decoration": "Decoração de set",
  "Costume Design": "Figurino",
  Casting: "Elenco",
  "Makeup Artist": "Maquiagem",
  Hairstylist: "Cabelo",
  "Sound Designer": "Desenho de som",
  "Sound Re-Recording Mixer": "Mixagem de som",
  "Supervising Sound Editor": "Edição de som",
  "Visual Effects Supervisor": "Supervisão de efeitos visuais",
  "Stunt Coordinator": "Coordenação de dublês",
  Gaffer: "Iluminação",
  "Key Grip": "Maquinaria",
  Colorist: "Colorização",
  Animation: "Animação",
};

export function translateJob(job: string | null | undefined) {
  if (!job) return "—";

  return JOB_LABELS[job] ?? job;
}

const languageNames = new Intl.DisplayNames(["pt-BR"], { type: "language" });
const regionNames = new Intl.DisplayNames(["pt-BR"], { type: "region" });

export function getLanguageName(code: string | null | undefined) {
  if (!code) return "—";

  try {
    return languageNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

export function getCountryName(code: string | null | undefined) {
  if (!code) return "—";

  try {
    return regionNames.of(code) ?? code.toUpperCase();
  } catch {
    return code.toUpperCase();
  }
}

const MOVIE_STATUS_LABELS: Readonly<Record<string, string>> = {
  Released: "Lançado",
  "Post Production": "Pós-produção",
  "In Production": "Em produção",
  Planned: "Planejado",
  Rumored: "Rumor",
  Canceled: "Cancelado",
};

export function translateMovieStatus(status: string | null | undefined) {
  if (!status) return "—";

  return MOVIE_STATUS_LABELS[status] ?? status;
}

export function getInitials(name: string) {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

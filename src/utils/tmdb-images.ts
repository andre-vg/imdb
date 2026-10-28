//Função que pega o path da resposta da api e retorna a URL da imagem

type Propsimdb = {
  path: string;
  quality:
    "w92" | "w154" | "w185" | "w342" | "w500" | "w780" | "w1280" | "original";
};

export const bindTMDBimage = ({ path, quality }: Propsimdb) => {
  return `https://image.tmdb.org/t/p/${quality}${path}`;
};

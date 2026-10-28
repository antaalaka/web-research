
type OpenAlexWork = {
  id: string;
  title: string | null;
  publication_year: number | null;
  doi: string | null;
  authorships?: {
    author?: {
      display_name?: string;
    };
  }[];
  primary_location?: {
    landing_page_url?: string | null;
  } | null;
  open_access?: {
    is_oa?: boolean;
    oa_url?: string | null;
  } | null;
  abstract_inverted_index?: Record<string, number[]> | null;
};

function reconstructAbstract(
  index?: Record<string, number[]> | null
): string | null {
  if (!index) return null;

  const words: string[] = [];

  for (const [word, positions] of Object.entries(index)) {
    for (const position of positions) {
      words[position] = word;
    }
  }

  const abstract = words.join(" ").trim();
  return abstract || null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const claim = searchParams.get("claim")?.trim();

  if (!claim || claim.length < 5) {
    return Response.json(
      {
        error:
          "Please enter a claim of at least 5 characters.",
      },
      { status: 400 }
    );
  }

  if (claim.length > 1000) {
    return Response.json(
      {
        error:
          "The claim must not exceed 1000 characters.",
      },
      { status: 400 }
    );
  }

  try {
    const url = new URL("https://api.openalex.org/works");

    url.searchParams.set("search", claim);
    url.searchParams.set("per_page", "5");
    url.searchParams.set("sort", "relevance_score:desc");

    url.searchParams.set(
      "select",
      [
        "id",
        "title",
        "publication_year",
        "doi",
        "authorships",
        "primary_location",
        "open_access",
        "abstract_inverted_index",
      ].join(",")
    );

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      throw new Error(
        `OpenAlex returned status ${response.status}`
      );
    }

    const data: { results: OpenAlexWork[] } =
      await response.json();

    const articles = data.results.map((work) => ({
      id: work.id,
      title: work.title ?? "Untitled article",
      year: work.publication_year,
      authors:
        work.authorships
          ?.map((item) => item.author?.display_name)
          .filter(
            (name): name is string => Boolean(name)
          )
          .slice(0, 8) ?? [],
      doi: work.doi,
      url:
        work.primary_location?.landing_page_url ??
        work.doi ??
        work.id,
      isOpenAccess: work.open_access?.is_oa ?? false,
      openAccessUrl: work.open_access?.oa_url ?? null,
      abstract: reconstructAbstract(
        work.abstract_inverted_index
      ),
    }));

    return Response.json({
      claim,
      count: articles.length,
      articles,
    });
  } catch (error) {
    console.error("OpenAlex search failed:", error);

    return Response.json(
      {
        error:
          "Could not retrieve articles. Please try again later.",
      },
      { status: 502 }
    );
  }
}

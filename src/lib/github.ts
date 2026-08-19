export type GitHubProfile = {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  public_repos: number;
  followers: number;
  following: number;
};

export type GitHubRepository = {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  language: string | null;
  stargazers_count: number;
  forks_count: number;
  topics: string[];
  license: {
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
  fork: boolean;
};

export async function getGitHubProfile(): Promise<GitHubProfile | null> {
  try {
    const res = await fetch("https://api.github.com/users/Mazees", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch GitHub profile:", error);
    return null;
  }
}

export async function getGitHubRepositories(): Promise<GitHubRepository[]> {
  try {
    const res = await fetch(
      "https://api.github.com/users/Mazees/repos?per_page=100&sort=updated",
      { next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];
    const repos: GitHubRepository[] = await res.json();
    // Filter out forks if requested, but prompt says "Filter repository fork jika tujuan website adalah menampilkan karya original Mada. Jika fork tetap ingin ditampilkan, berikan badge Fork." Let's include forks and give them a badge to be safe, or just exclude them for a cleaner portfolio. Let's keep them and add a badge.
    return repos;
  } catch (error) {
    console.error("Failed to fetch GitHub repositories:", error);
    return [];
  }
}

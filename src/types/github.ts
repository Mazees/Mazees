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

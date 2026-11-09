import { SiGithub } from '@icons-pack/react-simple-icons';
import { GithubInfo as FumadocsGithubInfo } from 'fumadocs-ui/components/github-info';
import Link from 'next/link';

export async function GithubInfo({
  owner,
  repo,
  ...props
}: React.ComponentProps<typeof FumadocsGithubInfo>) {
  try {
    return await FumadocsGithubInfo({ owner, repo, token: process.env.GITHUB_TOKEN, ...props });
  } catch {
    return (
      <Link
        href={`https://github.com/${owner}/${repo}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-card px-3 py-2 text-sm font-medium hover:bg-fd-accent no-underline"
      >
        <SiGithub className="w-4 h-4" />
        <span>{owner}/{repo}</span>
      </Link>
    );
  }
}

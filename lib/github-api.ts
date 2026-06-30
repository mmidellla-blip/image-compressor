import { Octokit } from "@octokit/rest";

function makeOctokit() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("GITHUB_TOKEN이 설정되지 않았습니다");
  return new Octokit({ auth: token });
}

function getRepo() {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  if (!owner || !repo)
    throw new Error("GITHUB_REPO_OWNER 또는 GITHUB_REPO_NAME이 설정되지 않았습니다");
  return { owner, repo };
}

export type PostData = {
  slug: string;
  title: string;
  description: string;
  datePublished: string;
  contentHtml: string;
  published: boolean;
  relatedSlugs: string[];
  sections: never[];
  closingSummary?: string;
  faq?: { question: string; answer: string }[];
};

export async function listPostFiles(): Promise<
  { slug: string; sha: string }[]
> {
  const octokit = makeOctokit();
  const { owner, repo } = getRepo();

  try {
    const res = await octokit.repos.getContent({ owner, repo, path: "posts" });
    if (!Array.isArray(res.data)) return [];
    return res.data
      .filter(
        (f): f is typeof f & { type: "file"; name: string; sha: string } =>
          f.type === "file" && f.name.endsWith(".json")
      )
      .map((f) => ({ slug: f.name.replace(".json", ""), sha: f.sha }));
  } catch {
    return [];
  }
}

export async function getPostFile(
  slug: string
): Promise<{ data: PostData; sha: string } | null> {
  const octokit = makeOctokit();
  const { owner, repo } = getRepo();

  try {
    const res = await octokit.repos.getContent({
      owner,
      repo,
      path: `posts/${slug}.json`,
    });
    if (Array.isArray(res.data) || res.data.type !== "file") return null;
    const content = Buffer.from(res.data.content, "base64").toString("utf8");
    return { data: JSON.parse(content) as PostData, sha: res.data.sha };
  } catch {
    return null;
  }
}

export async function savePostFile(
  slug: string,
  data: PostData,
  sha?: string
): Promise<void> {
  const octokit = makeOctokit();
  const { owner, repo } = getRepo();
  const content = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

  await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path: `posts/${slug}.json`,
    message: sha ? `update: ${data.title}` : `add: ${data.title}`,
    content,
    ...(sha ? { sha } : {}),
  });
}

export async function deletePostFile(slug: string, sha: string): Promise<void> {
  const octokit = makeOctokit();
  const { owner, repo } = getRepo();

  await octokit.repos.deleteFile({
    owner,
    repo,
    path: `posts/${slug}.json`,
    message: `delete: ${slug}`,
    sha,
  });
}

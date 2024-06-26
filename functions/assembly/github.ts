import { http } from "@hypermode/functions-as";

// This function uses the Github REST API to get the issues for a repository.
// See https://docs.github.com/en/rest/issues/issues?apiVersion=2022-11-28#list-repository-issues
// That documentation explains the request and response format.

export function getGithubIssues(owner: string, repo: string): Issue[] {
  const limit = 100;
  const url = `https://api.github.com/repos/${owner}/${repo}/issues?per_page=${limit}`;
  console.log(`Getting Github Issues for ${owner}/${repo}`);

  const request = new http.Request(url, {
    method: "GET",
    headers: http.Headers.from([
      // We will use Hypermode pass the Authorization header securely,
      // using the template set in the hypermode.json manifest file.
      // The rest of the non-sensitive headers are set here.
      ["Accept", "application/vnd.github+json"],
      ["X-GitHub-Api-Version", "2022-11-28"],
      ["Content-Type", "application/json"],
    ]),
  } as http.RequestOptions);

  const response = http.fetch(request);
  if (!response.ok) {
    throw new Error(
      `Failed to read issue. Received: ${response.status} ${response.statusText}`,
    );
  }

  // parse the JSON response into the expected structure
  const issues = response.json<Issue[]>();

  return issues;
}

// Define the structure we expect for the output of the GitHub API.
// We have only need to define the structure of the fields we are interested in.
// Any other fields in the response JSON will be ignored.

@json
export class Issue {
  title!: string;
  body!: string;
  labels: Label[] = [];
  user: User | null = null;


  @alias("created_at")
  createdAt!: string;

  // The URL of the issue on GitHub, after the issue is created.
  @alias("html_url")
  url: string | null = null;
}


@json
export class Label {
  name!: string;
}


@json
export class User {
  login!: string;
}

export const commitTypes = {
  CommitRequest: {
    git_diff: 'string',
    commit_style: 'developer|normal'
  },
  CommitResponse: {
    commit_title: 'string',
    commit_body: 'string',
    confidence: 'number'
  },
  Commit: {
    id: 'string',
    commit_title: 'string',
    commit_body: 'string',
    style: 'string',
    confidence: 'number',
    created_at: 'string'
  },
  CommitCreate: {
    commit_title: 'string',
    commit_body: 'string',
    style: 'string',
    confidence: 'number'
  },
  RepositoryInfoRequest: {
    repository_path: 'string'
  },
  RepositoryInfo: {
    repository_path: 'string',
    current_branch: 'string',
    remote_url: 'string',
    has_staged_changes: 'boolean',
    is_git_repository: 'boolean',
    error: 'string'
  },
  PushToGitHubRequest: {
    repository_path: 'string',
    commit_message: 'string',
    remote_name: 'string'
  }
};

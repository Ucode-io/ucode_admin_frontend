import httpsRequest from "@/utils/httpsRequest";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import requestV2 from "../utils/requestV2";

const githubService = {
  login: (params) => httpsRequest.get("/v1/github/login", {params}),
  loginGitlab: (params) => httpsRequest.get("/v1/gitlab/login", {params}),
  githubUsername: (params) => httpsRequest.get("/v1/github/user", {params}),
  gitlabUsername: (params) => httpsRequest.get("/v1/gitlab/user", {params}),
  githubRepositories: (params) =>
    httpsRequest.get("/v1/github/repos", {params}),
  githubBranches: (params) => httpsRequest.get("/v1/github/branches", {params}),
  gitlabRepositories: (params) =>
    httpsRequest.get("/v1/gitlab/repos", {params}),
  gitlabBranches: (params) => httpsRequest.get("/v1/gitlab/branches", {params}),
  getUser: ({token}) =>
    axios.get("https://api.github.com/user", {
      headers: {Authorization: `Bearer ${token}`},
    }),
  getRepos: ({username, token}) =>
    axios.get(`https://api.github.com/user/repos`, {
      headers: {Authorization: `Bearer ${token}`},
      params: {visibility: "all"},
    }),
  getBranches: ({username, repo, token}) =>
    axios.get(`https://api.github.com/repos/${username}/${repo}/branches`, {
      headers: {Authorization: `Bearer ${token}`},
    }),
};

export const useGithubLoginMutation = (mutationSettings) => {
  return useMutation((data) => githubService.login(data), mutationSettings);
};

export const useGitlabLoginMutation = (mutationSettings) => {
  return useMutation(
    (data) => githubService.loginGitlab(data),
    mutationSettings
  );
};

export const useGithubUserQuery = ({token, queryParams} = {}) => {
  return useQuery(
    ["GITHUB_USER", {token}],
    () => {
      return githubService.getUser({token});
    },
    queryParams
  );
};

export const useGithubRepositoriesQuery = ({
  username,
  token,
  queryParams,
} = {}) => {
  return useQuery(
    ["GITHUB_REPOSITORIES", {username, token}],
    () => {
      return githubService.githubRepositories({username, token});
    },
    queryParams
  );
};

export const useGitlabRepositoriesQuery = ({
  username,
  token,
  resource_id,
  queryParams,
} = {}) => {
  return useQuery(
    ["GITLAB_REPOSITORIES", {username, token, resource_id}],
    () => {
      return githubService.gitlabRepositories({username, token, resource_id});
    },
    queryParams
  );
};

export const useGithubBranchesQuery = ({
  username,
  repo,
  token,
  queryParams,
} = {}) => {
  return useQuery(
    ["GITHUB_BRANCHES", {username, repo, token}],
    () => {
      return githubService.githubBranches({username, repo, token});
    },
    queryParams
  );
};

export const useGitlabBranchesQuery = ({
  username,
  repo,
  token,
  resource_id,
  queryParams,
} = {}) => {
  return useQuery(
    ["GITLAB_BRANCHES", {username, repo, token, resource_id}],
    () => {
      return githubService.gitlabBranches({username, repo, token, resource_id});
    },
    queryParams
  );
};

export default githubService;

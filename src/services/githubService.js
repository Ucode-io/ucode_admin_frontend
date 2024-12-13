import httpsRequest from "@/utils/httpsRequest";
import {useMutation, useQuery} from "react-query";
import axios from "axios";
import requestV2 from "../utils/requestV2";

const githubService = {
  login: (params) => httpsRequest.get("/github/login", {params}),
  githubUsername: (params) => httpsRequest.get("/github/user", {params}),
  githubRepositories: (params) => httpsRequest.get("/github/repos", {params}),
  githubBranches: (params) => httpsRequest.get("/github/branches", {params}),
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

export default githubService;

import { useQuery, useQueryClient } from "react-query";
import fetchWithError from "../helpers/fetchWithError";
import { IssueItem } from "./IssueItem";
import Loader from "./Loader";

export function IssuesList({ labels, status, search, pageNum, setPageNum }) {
  const queryClient = useQueryClient();

  const issuesQuery = useQuery(
    ["issues", { labels, status, search, pageNum }],
    async ({ signal }) => {
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");
      const statusString = status ? `&status=${status}` : "";
      const searchString = search !== "" ? search : "";
      const paginationString = pageNum ? `&page=${pageNum}` : "";

      if (searchString !== "") {
        return fetchWithError(`/api/search/issues?q=${searchString}`, {
          signal,
        }).then((data) => {
          return data.items;
        });
      } else {
        const results = await fetchWithError(
          `/api/issues?${labelsString}${statusString}${paginationString}`,
          {
            // headers: {
            //   "x-error": true,
            // },
            signal,
          }
        );

        results.forEach((issue) => {
          queryClient.setQueryData(["issues", String(issue.number)], issue);
        });

        return results;
      }
    },
    {
      onError: (error) => {
        console.log("Custom error: " + error.message);
      },
      keepPreviousData: true
    }
  );

  return (
    <div>
      <h2>Issues List {issuesQuery.isFetching ? <Loader /> : null}</h2>
      {search && <h6>Search filter: {search}</h6>}
      {issuesQuery.isError && (
        <p>Error occurred: {issuesQuery.error.message}</p>
      )}
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <div className="pagination">
            <button
              onClick={() => {
                if (pageNum - 1 > 0) {
                  setPageNum(pageNum - 1);
                }
              }}
              disabled={pageNum === 1}
            >
              Previous
            </button>
            <p>
              Page {pageNum} {issuesQuery.isFetching ? "..." : ""}
            </p>
            <button onClick={() => {
              if (issuesQuery.data?.length > 1 && !issuesQuery.isPreviousData) {
                setPageNum(pageNum + 1);
              }
            }} disabled={issuesQuery.data?.length === 0 || issuesQuery.isPreviousData }>Next</button>
          </div>
          <ul className="issues-list">
            {issuesQuery.data.map((issue) => (
              <IssueItem
                key={issue.id}
                assignee={issue.assignee}
                commentCount={issue.commentCount}
                createdDate={issue.createdDate}
                createdBy={issue.createdBy}
                labels={issue.labels}
                number={issue.number}
                status={issue.status}
                title={issue.title}
              />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

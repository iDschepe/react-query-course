import { Link } from "react-router-dom";
import { GoIssueOpened, GoIssueClosed, GoComment } from "react-icons/go";
import { relativeDate } from "../helpers/relativeDate";
import useUserData from "../helpers/useUserData";
import { Label } from "./Label";
import { useQueryClient } from "react-query";
import fetchWithError from "../helpers/fetchWithError";

export function IssueItem({
  title,
  number,
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  status,
}) {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);

  const queryClient = useQueryClient();

  return (
    <li
      onMouseEnter={() => {
        queryClient.prefetchQuery(
          ["issues", String(number)],
          () => fetchWithError(`api/issues/${number}`),
          { staleTime: 1000 * 60 }
        );
        queryClient.prefetchInfiniteQuery(
          ["issues", String(number), "comments"],
          () => fetchWithError(`api/issues/${number}/comments?page=1`),
          { staleTime: 1000 * 60 }
        );
      }}
    >
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issue/${number}`}>{title}</Link>
          {labels.map((label) => (
            <Label key={label} label={label} />
          ))}
        </span>
        <small>
          #{number} opened {relativeDate(createdDate)}{" "}
          {`by ${
            createdByUser.isSuccess ? createdByUser.data.name : createdBy
          }`}
        </small>
      </div>
      {assignee !== null && assigneeUser.isSuccess ? (
        <img
          className="assigned-to"
          alt={`Assigned to ${assigneeUser.data.name}`}
          src={assigneeUser.data.profilePictureUrl}
        />
      ) : null}
      <span className="comment-count">
        {commentCount > 0 ? (
          <>
            <GoComment />
            {commentCount}
          </>
        ) : null}
      </span>
    </li>
  );
}

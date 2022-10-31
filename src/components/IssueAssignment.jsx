import { useState } from "react";
import { GoGear } from "react-icons/go";
import { useMutation, useQuery, useQueryClient } from "react-query";
import useUserData from "../helpers/useUserData";

export default function IssueAssignment({ assignee, issueNumber }) {
  const user = useUserData(assignee);
  const [menuOpen, setMenuOpen] = useState(false);
  const toggleMenu = () => {
    setMenuOpen((state) => !state);
  };

  const usersQuery = useQuery(["users"], () =>
    fetch("/api/users").then((res) => res.json())
  );

  const queryClient = useQueryClient();
  const setAssignee = useMutation(
    (assignee) => {
      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ assignee }),
      }).then((res) => res.json())
    },
    {
      onMutate: (assignee) => {
        const oldAssignee = queryClient.getQueryData([
          "issues",
          issueNumber,
        ]).assignee;

        // optimistic update data
        queryClient.setQueryData(["issues", issueNumber], (currentData) => {
          return { ...currentData, assignee };
        });

        return function rollback() {
          // return a rollback function if something goes wrong
          queryClient.setQueryData(["issues", issueNumber], (currentData) => {
            return { ...currentData, oldAssignee };
          });
        };
      },
      onError: (error, variables, rollback) => {
        rollback();
      },
      onSettled: (data, variables, rollback) => {
        // best practice invalidate query cache
        // exact must be true, to only match exact filter
        queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
        console.log(variables);
      },
    }
  );

  return (
    <div className="issue-options">
      <div>
        <span>Assignment</span>
        {user.isSuccess && (
          <div>
            <img
              src={
                user.data.profilePictureUrl
                  ? user.data.profilePictureUrl
                  : "https://unsplash.it/200"
              }
            />
            {user.data.name ? user.data.name : "Unassigned"}
          </div>
        )}
      </div>
      <GoGear
        onClick={() => {
          if (!usersQuery.isLoading) {
            toggleMenu();
          }
        }}
      />
      {menuOpen && (
        <div className="picker-menu">
          {usersQuery.data?.map((user) => {
            return (
              <div
                key={user.id}
                onClick={() => {
                  toggleMenu();
                  setAssignee.mutate(user.id);
                }}
              >
                <img src={user.profilePictureUrl} />
                <div
                  style={
                    user.id === assignee ? { "font-weight": "bolder" } : null
                  }
                >
                  {user.name}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

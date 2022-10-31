import { useState } from "react";
import { GoGear } from "react-icons/go";
import { useMutation, useQueryClient } from "react-query";
import { useLabelsData } from "../helpers/useLabelsData";

export default function IssueLabels({ labels, issueNumber }) {
  const labelsQuery = useLabelsData();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((state) => !state);
  };

  const queryClient = useQueryClient();
  // pass whole list of labels for mutate action
  const setLabels = useMutation(
    (labelId) => {
      const newLabels = labels.includes(labelId)
        ? labels.filter((label) => label !== labelId)
        : labels.concat(labelId);

      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ labels: newLabels }),
      }).then((res) => res.json());
    },
    {
      onMutate: (labelId) => {
        const oldLabels = queryClient.getQueryData([
          "issues",
          issueNumber,
        ]).labels;

        const labels = oldLabels.includes(labelId)
          ? oldLabels.filter((label) => label !== labelId)
          : oldLabels.concat(labelId);

        // optimistic update data
        queryClient.setQueryData(["issues", issueNumber], (currentData) => {
          return { ...currentData, labels };
        });

        return function rollback() {
          // return a rollback function if something goes wrong
          queryClient.setQueryData(["issues", issueNumber], (currentData) => {
            const rollbackLabels = oldLabels.includes(labelId)
              ? [...data.labels, labelId]
              : data.labels.filter((label) => label !== labelId);
            return { ...currentData, labels: rollbackLabels };
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
        <span>Labels</span>
        {labelsQuery.isLoading
          ? null
          : labels.map((label) => {
              const labelObj = labelsQuery.data.find(
                (queryLabel) => queryLabel.id === label
              );
              if (!labelObj) return null;
              return (
                <span key={labelObj.id} className={`label ${labelObj.color}`}>
                  {labelObj.name}
                </span>
              );
            })}
      </div>

      <GoGear onClick={() => !labelsQuery.isLoading && toggleMenu()} />

      {menuOpen && (
        <div className="picker-menu labels">
          {labelsQuery.data?.map((label) => {
            const selected = labels.includes(label.id);
            return (
              <div
                key={label.id}
                className={selected ? "selected" : ""}
                onClick={() => {
                  setLabels.mutate(label.id);
                }}
              >
                <span
                  className="label-dot"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

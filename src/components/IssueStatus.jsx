import { useMutation, useQueryClient } from "react-query";
import StatusSelect from "./StatusSelect";

export default function IssueStatus({status, issueNumber}) {
    const queryClient = useQueryClient();

    const setStatus = useMutation((status) => {
        return fetch(`/api/issues/${issueNumber}`, {
            method: "PUT",
            headers: { "content-type": "application/json"},
            body: JSON.stringify({status})
        }).then((res) => res.json());
    }, {
        onMutate: (status) => {
            const oldStatus = queryClient.getQueryData(["issues", issueNumber]).status;
            
            // optimistic update data
            queryClient.setQueryData(["issues", issueNumber], (currentData) => {
                return {...currentData, status };
            })

            return function rollback() { // return a rollback function if something goes wrong
                queryClient.setQueryData(["issues", issueNumber], (currentData) => {
                    return {...currentData, status: oldStatus };
                })
            }
        }, 
        onError: (error, variables, rollback) => {
            rollback();
        }, 
        onSuccess: (data, variables, rollback) => {
            // could be used to retrieve server response and update data. 
            // Might le "laggy"
            /** Code Sample: 
             rollback();
             queryClient.setQueryData(["issues", issueNumber], (currentData) => {
                 return {...currentData, status: data.status };
                })
            */
        },
        onSettled: (data, variables, rollback) => {
            // best practice invalidate query cache
            // exact must be true, to only match exact filter
            queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
            console.log(variables);
        }
    });


    return (
        <div className="issue-options">
            <div>
                <span>Status</span>
                <StatusSelect noEmptyOption={true} value={status} onChange={(event) => {
                    setStatus.mutate(event.target.value);
                }} />
            </div>
        </div>
    )
}
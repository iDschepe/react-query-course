import { useMutation, useQueryClient } from "react-query";
import { useNavigate } from "react-router-dom";

export default function AddIssue() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addIssue = useMutation(
    (issueBody) =>
      fetch("/api/issues", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(issueBody),
      }).then((res) => res.json()),
    {
      onSuccess: (data) => {
        if (data) {
          console.log(data);
          queryClient.invalidateQueries(["issues"]); // invalidate old
          queryClient.setQueryData(["issues", String(data.number)], data); // set query data cache
          navigate(`/issue/${data.number}`);
        }
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  return (
    <div className="add-issue">
      <h2>Add Issue</h2>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          if (addIssue.isLoading) return;
          addIssue.mutate({
            title: event.target.title.value,
            comment: event.target.comment.value,
          });
        }}
      >
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Title of Issue"
          name="title"
        />
        <label htmlFor="comment">Comment</label>
        <textarea
          type="text"
          id="comment"
          placeholder="Comment..."
          name="comment"
        />
        <button type="submit" disabled={addIssue.isLoading}>
          {addIssue.isLoading ? "Creating ..." : "Create Issue"}
        </button>
      </form>
    </div>
  );
}

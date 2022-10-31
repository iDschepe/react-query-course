export function IssueSearch({ search, updateSearch }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(e.target.elements.search.value);
    updateSearch(e.target.elements.search.value);
  };
  return (
    <>
      <form onSubmit={handleSubmit}>
        <h2>Issues</h2>
        <input
          type="search"
          id="search"
          name="search"
          placeholder="Search..."
          onChange={(event) => {
            if (event.target.value.length === 0) {
                updateSearch("");
            }
          }}
        ></input>
      </form>
    </>
  );
}

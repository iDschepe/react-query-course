import { useState } from "react";
import { Link } from "react-router-dom";
import { IssueSearch } from "../components/IssueSearch";
import { IssuesList } from "../components/IssuesList";
import { LabelList } from "../components/LabelList";
import StatusSelect from "../components/StatusSelect";
export default function Issues() {
  const [labels, setLabels] = useState([]); // selected labels
  const [status, setStatus] = useState(""); // issue status
  const [search, setSearch] = useState(""); // searchTerm
  const [pageNum, setPageNum] = useState(1);

  return (
    <div>
      <main>
        <section>
          <IssueSearch
            search={search}
            updateSearch={(search) => {
              setSearch(search);
              setPageNum(1);
            }}
          />
          <IssuesList
            labels={labels}
            status={status}
            search={search}
            pageNum={pageNum}
            setPageNum={setPageNum}
          />
        </section>
        <aside>
          <LabelList
            key="label-list"
            selected={labels}
            toggle={(label) => {
              setLabels((currentLabels) =>
                currentLabels.includes(label)
                  ? currentLabels.filter(
                      (currentLabel) => currentLabel !== label
                    )
                  : currentLabels.concat(label)
              );
              setPageNum(1);
            }}
          />
          <h3>Status</h3>
          <StatusSelect
            key="status-select"
            value={status}
            onChange={(event) => {
              setStatus(event.target.value);
              setPageNum(1);
            }}
          />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}

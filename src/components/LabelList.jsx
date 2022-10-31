import { useLabelsData } from "../helpers/useLabelsData";
import { Label } from "./Label";

export function LabelList({ selected, toggle }) {
  const labelsQuery = useLabelsData();
  if (labelsQuery.isLoading) return null;

  return (
    <div className={"labels"}>
      <h3>Labels</h3>
      {labelsQuery.isLoading && <p>Loading...</p>}
      <ul>
        {labelsQuery.isSuccess && (
          <>
            {labelsQuery.data.map((label) => (
              <li key={label.id}>
                <button
                  className={`label ${
                    selected.includes(label.name) ? "selected" : ""
                  } ${label.color}`}
                  onClick={() => toggle(label.name)}
                >
                  {label.name}
                </button>
              </li>
            ))}
          </>
        )}
      </ul>
    </div>
  );
}

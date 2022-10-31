import { useLabelsData } from "../helpers/useLabelsData";

export function Label({label}) {
    const labelsQuery = useLabelsData();
    if (labelsQuery.isLoading)
        return null;

    const foundLabel = labelsQuery.data.find(queryLabel => queryLabel.id === label);
    if (!foundLabel)
        return null;

    return <span key={foundLabel.id} className={`label ${foundLabel.color}`}>
        {foundLabel.name}
    </span>;
}

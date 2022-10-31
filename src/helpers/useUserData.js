import { useQuery } from "react-query";


export default function useUserData(userId) {
    function fetchUser({signal}) {
        if (userId) {
            return fetch(`/api/users/${userId}`, {signal}).then(res => res.json());
        }
        return {};
    }

    return useQuery(
        ["user", userId],
        ({signal}) => fetchUser({signal}), 
        {
            staleTime: 1000 * 60 * 5
        }
    )
}
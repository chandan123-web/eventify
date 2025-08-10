//  import { useQuery } from "@tanstack/react-query";
//  import { getAuthUser } from "../lib/api.js";

// const useAuthUser = () => {
//   const authUser = useQuery({
//     queryKey: ["authUser"],
//     queryFn: getAuthUser,
//     retry: false, // auth check
//   });

//   return { isLoading: authUser.isLoading, authUser: authUser.data?.user };
// };
//export default useAuthUser;

import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api.js";

const useAuthUser = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        return await getAuthUser();
      } catch {
        return null; // user not logged in
      }
    },
    retry: false,      // don't retry if unauthorized
    staleTime: 0,      // always refetch on mount
    cacheTime: 0,      // don't keep old user data in memory
  });

  return {
    isLoading,
    authUser: data?.user || null, // ensure null if no user
  };
};

export default useAuthUser;

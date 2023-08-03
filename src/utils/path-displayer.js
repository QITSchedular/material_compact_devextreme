import { useNavigation } from "react-router-dom";

export const currentPathDisplayer = () => {
  const {
    navigationData: { currentPath },
  } = useNavigation();
  return currentPath;
};

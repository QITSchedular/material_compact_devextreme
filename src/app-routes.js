import {
  HomePage,
  ProfilePage,
  ItemsMasterPage,
  ItemsGroupMasterPage,
  AddItemsGroupMasterPage,
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";
// import ItemGroupMaster from "./pages/masters/item-group-master/items-group-master";

const routes = [
  // {
  //   path: "/tasks",
  //   element: TasksPage,
  // },
  {
    path: "/profile",
    element: ProfilePage,
  },
  {
    path: "/home",
    element: HomePage,
  },
  {
    path: "/masters/items",
    element: ItemsMasterPage,
  },
  {
    path: "/masters/itemsgroup",
    element: ItemsGroupMasterPage,
  },
  {
    path: "/masters/additemsgroup",
    element: AddItemsGroupMasterPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});

import {
  HomePage,
  ProfilePage,
  ItemsMasterPage,
  ItemsGroupMasterPage,
  AddItemsGroupMasterPage,
  GateInPage,
  LocationMasterPage,
  ProductPage
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";
// import ItemGroupMaster from "./pages/masters/item-group-master/items-group-master";

const routes = [
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
  {
    path: "/masters/location",
    element: LocationMasterPage,
  },
  //purchases
  {
    path: "/purchases/gatein",
    element: GateInPage,
  },
  {
    path: "/product",
    element: ProductPage,
  },

];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});

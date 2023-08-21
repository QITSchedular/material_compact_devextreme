import {
  HomePage,
  ProfilePage,
  ItemsMasterPage,
  ItemsGroupMasterPage,
  AddItemsGroupMasterPage,
  GateInPage,
  GatePrintQrPage,
  GrpoPage,
  GrpoScanItemsPage,
  GateInMainPage,
  LocationMasterPage,
  UomMasterPage,
  WarehouseMasterPage,
  ItemsubgroupmasterPage,
  IncomingQCPage,
  MasterPage,
  purchasePage,
  VerifyMaterialPage,
  VerifyMaterialScanItemsPage,
  ReceiveMaterialPage,
  ReceiveMaterialScanItemsPage,
  IssueMaterialPage,
} from "./pages";
import { withNavigationWatcher } from "./contexts/navigation";

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
    path: "/masters",
    element: MasterPage,
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
    path: "/masters/itemssubgroup",
    element: ItemsubgroupmasterPage,
  },
  {
    path: "/masters/additemsgroup",
    element: AddItemsGroupMasterPage,
  },
  {
    path: "/masters/uom",
    element: UomMasterPage,
  },
  {
    path: "/masters/warehouse",
    element: WarehouseMasterPage,
  },
  {
    path: "/masters/location",
    element: LocationMasterPage,
  },
  //purchases
  {
    path: "/purchases",
    element: purchasePage,
  },
  {
    path: "/purchases/gateinmain",
    element: GateInMainPage,
  },
  {
    path: "/purchases/gatein",
    element: GateInPage,
  },
  {
    path: "/purchases/gatein-printqr",
    element: GatePrintQrPage,
  },
  {
    path: "/purchases/grpo",
    element: GrpoPage,
  },
  {
    path: "/purchases/grpo/scanItems/:qrCode",
    element: GrpoScanItemsPage,
  },
  {
    path: "/qualityControl/incomingQC",
    element: IncomingQCPage,
  },
  {
    path: "/production/verify-material",
    element: VerifyMaterialPage,
  },
  {
    path: "/production/verify-material/verify-items:prodid",
    element: VerifyMaterialScanItemsPage,
  },
  {
    path: "/production/receive-material",
    element: ReceiveMaterialPage,
  },
  {
    path: "/recieve-material/scanitems/:id",
    element: ReceiveMaterialScanItemsPage,
  },
  {
    path: "/production/issue-material",
    element: IssueMaterialPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});

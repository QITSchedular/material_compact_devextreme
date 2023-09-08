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
  InprocessQCPage,
  MasterPage,
  InprocessQcScanItemsPage,
  SalePage,
  PurchasePage,
  DeliveryPage,
  IncomingQcScanItemsPage,
  DispatchPage
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
    element: PurchasePage,
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
    path: "/qualityControl/inprocessQC",
    element: InprocessQCPage,
  },
  {
    path: "/qualityControl/inprocessQualityControl/InprocessQcScanItemsPage/:headerQRCodeID/:docEntry",
    element: InprocessQcScanItemsPage,
  },
  {
    path: "/qualityControl/incomigQualityControl/IncomingQcScanItemsPage/:headerQRCodeID/:docEntry",
    element: IncomingQcScanItemsPage,
  },
  //Sales Page
  {
    path: "/sales",
    element: SalePage,
  },
  {
    path: "/sales/delivery",
    element: DeliveryPage,
  },
  {
    path: "/sales/delivery/:qrCode",
    element: DispatchPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});

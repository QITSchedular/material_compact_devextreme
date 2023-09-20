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
  VerifyMaterialPage,
  VerifyMaterialScanItemsPage,
  ReceiveMaterialPage,
  ReceiveMaterialScanItemsPage,
  ReceiveMaterialGenerateQrPage,
  IssueMaterialPage,
  IssueMaterialScanItemsPage,
  InventoryTransferMainPage,
  PickPackMain,
  InprocessQcScanItemsPage,
  SalePage,
  PurchasePage,
  DeliveryPage,
  IncomingQcScanItemsPage,
  NotfoundPage,
  MachineInOutPage,
  MachineManagementPage,
  PickPackProcess,
  QualityControlPage,
  ProductionPage,
  InventoryPage,
  MachinemasterPage,
  EmployeemasterPage,
  DepartmentMasterPage,
  VarifyMaterialScanItemPage
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
    path: "/Notfound",
    element: NotfoundPage,
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
  {
    path: "/masters/machine",
    element: MachinemasterPage,
  },
  {
    path: "/masters/Department",
    element: DepartmentMasterPage,
  },
  {
    path: "/masters/employee",
    element: EmployeemasterPage,
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
  // qualityControl
  {
    path: "/qualityControl",
    element: QualityControlPage,
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
  //Production Page
  {
    path: "/production",
    element: ProductionPage,
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
    path: "/production/verify-material/varify-material-scanItemPage/:itemCode/:docEntry",
    element: VarifyMaterialScanItemPage,
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
    path: "/production/receive-material/generateqr",
    element: ReceiveMaterialGenerateQrPage,
  },
  {
    path: "/production/issue-material",
    element: IssueMaterialPage,
  },
  // InventoryPage
  {
    path: "/inventory",
    element: InventoryPage,
  },
  {
    path: "/issue-material/scanitems/:id",
    element: IssueMaterialScanItemsPage,
  },
  {
    path: "/inventory/transfer",
    element: InventoryTransferMainPage,
  },
  {
    path: "/inventory/pick-pack",
    element: PickPackMain,
  },
  {
    path: "/inventory/pick-pack/pick-pack-Process/:qrCode/:docEntry",
    element: PickPackProcess,
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
    path: "/TrackMachines",
    element: MachineInOutPage,
  },
  {
    path: "/TrackMachines/MachineInOut",
    element: MachineInOutPage,
  },
  {
    path: "/TrackMachines/MachineManagement",
    element: MachineManagementPage,
  },
];

export default routes.map((route) => {
  return {
    ...route,
    element: withNavigationWatcher(route.element, route.path),
  };
});

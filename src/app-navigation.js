import { Sacnner, pin, TransferInventory, qualityControl } from "./assets/icon";
import * as icon from './assets/icon';

// console.log(icon['ABC']);

export const navigation = [
  {
    text: "Home",
    path: "/home",
    icon: "home",
  },
  // {
  //   text: "Examples",
  //   icon: "folder",
  //   items: [
  //     {
  //       text: "Profile",
  //       path: "/profile",
  //       icon: "user",
  //     },
  //     {
  //       text: "Tasks",
  //       path: "/tasks",
  //       icon: "datafield",
  //     },
  //   ],
  // },
  {
    text: "Masters List",
    path: "/masters",
    icon: "key",
    items: [
      {
        text: "Item Master",
        path: "/masters/items",
        icon: icon['ItemMaster'],
      },
      {
        text: "Item Group",
        path: "/masters/itemsgroup",
        icon: `${icon['ItemGroup']}`,
      },
      {
        text: "Item Sub Group",
        path: "/masters/itemssubgroup",
        icon: `${icon['ItemSubGroup']}`,
      },
      {
        text: "Uom",
        path: "/masters/uom",
        icon: `${icon['UOM']}`,
      },
      {
        text: "Location",
        path: "/masters/location",
        icon: `${icon['location']}`,
      },
      {
        text: "Warehouse",
        path: "/masters/warehouse",
        icon: `${icon['warehouse']}`,
      },
      // {
      //   text: "Bin Loaction",
      //   path: "/masters/binlocation",
      // },
      {
        text: "Brand",
        path: "/masters/brand",
        icon: `${icon['brands']}`,
      },
      // {
      //   text: "Put Away",
      //   path: "/masters/putaway",
      // },
      // {
      //   text: "Country",
      //   path: "/masters/country",
      // },
      // {
      //   text: "State",
      //   path: "/masters/state",
      // },
      // {
      //   text: "Sales Employee",
      //   path: "/masters/salesemployee",
      // },
    ],
  },
  {
    text: "Purchases",
    path: "/purchases",
    icon: "fa-solid fa-cart-plus",
    items: [
      {
        text: "Gate Inward",
        path: "/purchases/gateinmain",
        icon: `${icon['GateIn']}`
      },
      {
        text: "Generate & Print",
        path: "/purchases/gatein-printqr",
        icon: `${icon['GenerateAndPrint']}`
      },
      {
        text: "GRPO",
        path: "/purchases/grpo",
        icon: `${icon['GRPO']}`
      },
    ],
  },
  {
    text: "Quality Control",
    icon: `${icon['qualityControl']}`,
    items: [
      {
        text: "Incoming QC",
        icon: `${icon['TransferInventory']}`,
        path: "/qualityControl/incomingQC",
      },
    ],
  },
  {
    text: "Sales",
    path: "/sales",
    icon: "fa-solid fa-bag-shopping",
    items: [
      {
        text: "Scanner",
        path: "/scan",
        icon: "home",
      },
    ],
  },
];

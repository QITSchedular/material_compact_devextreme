import * as icon from './assets/icon';

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
            {
                text: "Machine ",
                path: "/masters/machine",
                icon: `${icon['brands']}`,
            },
            {
                text: "Employee ",
                path: "/masters/employee",
                icon: `${icon['brands']}`,
            },
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
        path: "/qualityControl",
        icon: `${icon['qualityControl']}`,
        items: [
            {
                text: "Incoming QC",
                icon: `${icon['IncomingQC']}`,
                path: "/qualityControl/incomingQC",
            },
            {
                text: "Inprocess QC",
                icon: `${icon['IncomingQC']}`,
                path: "/qualityControl/inprocessQC",
            },
        ],
    },
    {
        text: "Production",
        path: "/production",
        icon: "fa-solid fa-bag-shopping",
        items: [
          {
            text: "Issue Material",
            path: "/production/issue-material",
            icon: "login",
          },
          {
            text: "Verify Material",
            path: "/production/verify-material",
            icon: "login",
          },
          {
            text: "Receive Material",
            path: "/production/receive-material",
            icon: "login",
          },
        ],
    },
    {
      text: "Inventory",
      path: "/inventory",
      icon: "fa-solid fa-arrow-down-up-lock",
      items: [
        {
          text: "Inventory Transfer",
          path: "/inventory/transfer",
          icon: "login",
        },
        {
          text: "Pick & Pack",
          path: "/inventory/pick-pack",
          icon: "login",
        },
      ],
    },
    {
        text: "Sales",
        path: "/sales",
        icon: "fa-solid fa-bag-shopping",
        items: [
            {
                text: "Delivery",
                path: "/sales/delivery",
                icon: `${icon['Delivery']}`,
            },
        ],
    },
    {
        text: "Track Machines",
        path: "/TrackMachines",
        icon: "fa-solid fa-bag-shopping",
        items: [
            {
                text: "Machine In & Out",
                path: "/TrackMachines/MachineInOut",
                icon: "home",
            },
        ],
    },
];
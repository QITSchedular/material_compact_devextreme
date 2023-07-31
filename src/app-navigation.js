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
    icon: "key",
    items: [
      {
        text: "Items",
        path: "/masters/items",
      },
      {
        text: "Uom",
        path: "/masters/uom",
      },
      {
        text: "Item Group ",
        path: "/masters/itemsgroup",
      },
      {
        text: "Item Sub Group",
        path: "/masters/itemssubgroup",
      },
      {
        text: "Brands",
        path: "/masters/brand",
      },
      {
        text: "Location",
        path: "/masters/location",
      },
      {
        text: "Warehouse",
        path: "/masters/warehouse",
      },
      {
        text: "Bin Location",
        path: "/masters/binlocation",
      },

      {
        text: "Put Away",
        path: "/masters/putaway",
      },
      {
        text: "Country",
        path: "/masters/country",
      },
      {
        text: "State",
        path: "/masters/state",
      },
      {
        text: "Sales Employee",
        path: "/masters/salesemployee",
      },
    ],
  },
  {
    text: "Purchases",
    icon: "fa-solid fa-cart-plus",
    items: [
      {
        text: "Gate Inward",
        path: "/purchases/gatein",
      },
      {
        text: "Generate & Print",
        path: "/purchases/gatein-printqr",
      },
    ],
  },
  {
    text: "Sales",
    path: "/sales",
    icon: "fa-solid fa-bag-shopping",
  },
];

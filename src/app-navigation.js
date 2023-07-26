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
        text: "Item Master",
        path: "/masters/items",
      },
      {
        text: "Item Group Master",
        path: "/masters/itemsgroup",
      },
      {
        text: "Item Sub Group Master",
        path: "/masters/itemssubgroup",
      },
      {
        text: "Uom Master",
        path: "/masters/uom",
      },
      {
        text: "Location Master",
        path: "/masters/location",
      },
      {
        text: "Warehouse Master",
        path: "/masters/warehouse",
      },
      {
        text: "Bin Loaction Master",
        path: "/masters/binlocation",
      },
      {
        text: "Brand Master",
        path: "/masters/brand",
      },
      {
        text: "Put Away Master",
        path: "/masters/putaway",
      },
      {
        text: "Country Master",
        path: "/masters/country",
      },
      {
        text: "State Master",
        path: "/masters/state",
      },
      {
        text: "Sales Employee Master",
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
    ],
  },
  {
    text: "Sales",
    path: "/sales",
    icon: "fa-solid fa-bag-shopping",
  },
  {
    text: "Product",
    path: "/product",
    icon: "fa-solid fa-bag-shopping",
  },
];

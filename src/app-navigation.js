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
        icon: "gift",
      },
      {
        text: "Item Group Master",
        path: "/masters/itemsgroup",
        icon: "contentlayout",
      },
      {
        text: "Item Sub Group Master",
        path: "/masters/itemssubgroup",
        icon: "smalliconslayout",
      },
      {
        text: "Uom Master",
        path: "/masters/uom",
        icon: "verticalaligncenter",
      },
      {
        text: "Location Master",
        path: "/masters/location",
        icon: "map",
      },
      {
        text: "Warehouse Master",
        path: "/masters/warehouse",
        icon: "box",
      },
      {
        text: "Bin Loaction Master",
        path: "/masters/binlocation",
        icon: "menu",
      },
      {
        text: "Brand Master",
        path: "/masters/brand",
        icon: "card",
      },
      {
        text: "Put Away Master",
        path: "/masters/putaway",
        icon: "check",
      },
      {
        text: "Country Master",
        path: "/masters/country",
        icon: "globe",
      },
      {
        text: "State Master",
        path: "/masters/state",
        icon: "isblank",
      },
      {
        text: "Sales Employee Master",
        path: "/masters/salesemployee",
        icon: "user",
      },
    ],
  },
  {
    text: "Purchases",
    icon: "fa-solid fa-cart-plus",
    items: [
      {
        text: "Gate In",
        path: "/purchases/gatein",
        icon: "fa-solid fa-backward",
      },
    ],
  },
  {
    text: "Sales",
    path: "/sales",
    icon: "fa-solid fa-bag-shopping",
  },
];

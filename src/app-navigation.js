import * as icon from './assets/icon';
import 'material-icons/iconfont/material-icons.css'

export const navigation = [
    {
        text: "Home",
        path: "/home",
        icon: `material-icons-outlined ic-home`,
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
        icon: `material-icons-outlined ic-view_list`,
        items: [
            {
                text: "Item Master",
                path: "/masters/items",
                icon: `material-icons-outlined ic-category`,
            },
            {
                text: "Item Group",
                path: "/masters/itemsgroup",
                icon: `material-icons-outlined ic-change_history`,
            },
            {
                text: "Item Sub Group",
                path: "/masters/itemssubgroup",
                icon: `material-icons-outlined ic-fiber_manual_record`,
            },
            {
                text: "Uom",
                path: "/masters/uom",
                icon: `material-icons-outlined ic-scale`,
            },
            {
                text: "Location",
                path: "/masters/location",
                icon: `material-icons-outlined ic-location_on`,
            },
            {
                text: "Warehouse",
                path: "/masters/warehouse",
                icon: `material-icons-outlined ic-warehouse`,
            },
            // {
            //   text: "Bin Loaction",
            //   path: "/masters/binlocation",
            // },
            {
                text: "Brand",
                path: "/masters/brand",
                icon: `material-icons-outlined ic-real_estate_agent`,
            },
            {
                text: "Machine ",
                path: "/masters/machine",
                icon: `material-icons-outlined ic-precision_manufacturing`,
            },
            {
                text: "Employee ",
                path: "/masters/employee",
                icon: `material-icons-outlined ic-group`,
            },
        ],
    },
    {
        text: "Purchases",
        path: "/purchases",
        icon: "material-icons-outlined ic-shopping_cart",
        items: [
            {
                text: "Gate Inward",
                path: "/purchases/gateinmain",
                icon: `material-icons-outlined ic-arrow_downward`     //system_update_alt
            },
            {
                text: "Generate & Print",
                path: "/purchases/gatein-printqr",
                icon: `material-icons-outlined ic-qr_code_scanner`
            },
            {
                text: "GRPO",
                path: "/purchases/grpo",
                icon: `material-icons-outlined ic-description`
            },
        ],
    },
    {
        text: "Quality Control",
        path: "/qualityControl",
        icon: `material-icons-outlined ic-fact_check`,
        items: [
            {
                text: "Incoming QC",
                path: "/qualityControl/incomingQC",
                icon: `material-icons-outlined ic-troubleshoot`,
            },
            {
                text: "Inprocess QC",
                path: "/qualityControl/inprocessQC",
                icon: `material-icons-outlined ic-youtube_searched_for`,
            },
        ],
    },
    {
        text: "Production",
        path: "/production",
        icon: `material-icons-outlined ic-details`,
        items: [
            {
                text: "Issue Material",
                path: "/production/issue-material",
                icon: `material-icons-outlined ic-logout`,
            },
            {
                text: "Verify Material",
                path: "/production/verify-material",
                icon: `material-icons-outlined ic-rule`,
            },
            {
                text: "Receive Material",
                path: "/production/receive-material",
                icon: `material-icons-outlined ic-call_received`,
            },
        ],
    },
    {
        text: "Inventory",
        path: "/inventory",
        icon: `material-icons-outlined ic-inventory_2`,
        items: [
            {
                text: "Inventory Transfer",
                path: "/inventory/transfer",
                icon: `material-icons-outlined ic-move_up`,
            },
            {
                text: "Pick & Pack",
                path: "/inventory/pick-pack",
                icon: `material-icons-outlined ic-local_shipping`,
            },
        ],
    },
    {
        text: "Sales",
        path: "/sales",
        icon: `material-icons-outlined ic-webhook`,
        items: [
            {
                text: "Delivery",
                path: "/sales/delivery",
                icon: `material-icons-outlined ic-local_shipping`,
            },
        ],
    },
    {
        text: "Track Machines",
        path: "/TrackMachines",
        icon: `material-icons-outlined ic-query_stats`,
        items: [
            {
                text: "Machine In & Out",
                path: "/TrackMachines/MachineInOut",
                icon: `material-icons-outlined ic-show_chart`,
            },
            {
                text: "Machine Mgmt.",
                path: "/TrackMachines/MachineManagement",
                icon: `material-icons-outlined ic-find_in_page`,
            },
        ],
    },
];
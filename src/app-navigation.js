import 'material-icons/iconfont/material-icons.css'

export const navigation = [
    {
        text: "Home",
        path: "/home",
        icon: `home`,
    },
    {
        text: "Masters List",
        path: "/masters",
        icon: `key`,
        items: [
            {
                text: "Item Master",
                path: "/masters/items",
                icon: `category`,
            },
            {
                text: "Item Group",
                path: "/masters/itemsgroup",
                icon: `change_history`,
            },
            {
                text: "Item Sub Group",
                path: "/masters/itemssubgroup",
                icon: `fiber_manual_record`,
            },
            {
                text: "Uom",
                path: "/masters/uom",
                icon: `scale`,
            },
            {
                text: "Location",
                path: "/masters/location",
                icon: `location_on`,
            },
            {
                text: "Warehouse",
                path: "/masters/warehouse",
                icon: `warehouse`,
            },
            // {
            //   text: "Bin Loaction",
            //   path: "/masters/binlocation",
            // },
            {
                text: "Brand",
                path: "/masters/brand",
                icon: `real_estate_agent`,
            },
            {
                text: "Machine ",
                path: "/masters/machine",
                icon: `precision_manufacturing`,
            },
            {
                text: "Department",
                path: "/masters/Department",
                icon: `roofing`,
            },
            {
                text: "Employee ",
                path: "/masters/employee",
                icon: `Group`,
            },
        ],
    },
    {
        text: "Purchases",
        path: "/purchases",
        icon: "shopping_cart",
        items: [
            {
                text: "Gate Inward",
                path: "/purchases/gateinmain",
                icon: `arrow_downward`     //system_update_alt
            },
            {
                text: "Generate & Print",
                path: "/purchases/gatein-printqr",
                icon: `qr_code_scanner`
            },
            {
                text: "GRPO",
                path: "/purchases/grpo",
                icon: `description`
            },
        ],
    },
    {
        text: "Quality Control",
        path: "/qualityControl",
        icon: `fact_check`,
        items: [
            {
                text: "Incoming QC",
                path: "/qualityControl/incomingQC",
                icon: `troubleshoot`,
            },
            {
                text: "Inprocess QC",
                path: "/qualityControl/inprocessQC",
                icon: `youtube_searched_for`,
            },
        ],
    },
    {
        text: "Production",
        path: "/production",
        icon: `details`,
        items: [
            {
                text: "Issue Material",
                path: "/production/issue-material",
                icon: `logout`,
            },
            {
                text: "Verify Material",
                path: "/production/verify-material",
                icon: `rule`,
            },
            {
                text: "Draft Receipt PRO",
                path: "/production/receive-material",
                icon: `call_received`,
            },
            {
                text: "Generate Receipt Qr",
                path: "/production/receive-material/generateqr",
                icon: "login",
             },
        ],
    },
    {
        text: "Inventory",
        path: "/inventory",
        icon: `inventory_2`,
        items: [
            {
                text: "Inventory Transfer",
                path: "/inventory/transfer",
                icon: `move_up`,
            },
            {
                text: "Pick & Pack",
                path: "/inventory/pick-pack",
                icon: `local_shipping`,
            },
        ],
    },
    {
        text: "Sales",
        path: "/sales",
        icon: `webhook`,
        items: [
            {
                text: "Delivery",
                path: "/sales/delivery",
                icon: `local_shipping`,
            },
        ],
    },
    {
        text: "Track Machines",
        path: "/TrackMachines",
        icon: `query_stats`,
        items: [
            {
                text: "Machine In & Out",
                path: "/TrackMachines/MachineInOut",
                icon: `show_chart`,
            },
            {
                text: "Machine Mgmt.",
                path: "/TrackMachines/MachineManagement",
                icon: `find_in_page`,
            },
        ],
    },
];

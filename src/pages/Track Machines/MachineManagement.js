import DataGrid, {
    Scrolling,
} from "devextreme-react/data-grid";
import './MachineManagement.scss';
import { customers } from './data';
import React from 'react';
import FilterToolbar from "../../components/machineFilter/FilterToolbar";

function MachineManagement() {
    const columns = ["CompanyName", "City", "State", "Phone", "Fax"];

    return (
        <>
            <div className="machine-card">
                <div className="content-block-wrapper">
                    <div className="content-block-1">
                        <div className="content-text">
                            <div className="Machine-header">Machine Management</div>
                            <div className="Machine-text-info">Manage the machine and employee</div>
                            <div className="filter-toolbar-row">
                                <div className="Machine-text-info">Filter By</div>
                                <FilterToolbar />
                            </div>
                        </div>
                    </div>
                </div>
                <DataGrid
                    dataSource={customers}
                    keyExpr="ID"
                    defaultColumns={columns}
                    showBorders={true}
                >
                    <Scrolling columnRenderingMode="virtual" />
                </DataGrid>

            </div>
        </>
    )
}

export default MachineManagement
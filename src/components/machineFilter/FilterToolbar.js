import React, { useState } from 'react';
import { Button, DropDownButton } from 'devextreme-react';
import './FilterToolbar.scss';

const FilterItem = ({ filterType, iconClass, label, onClick, isActive }) => {
    return (
        <div className="filter-item">
            <DropDownButton
                className='filter-dropdown'
                text={label}
                icon={iconClass}
                //stylingMode={isActive ? 'contained' : 'text'}
                onItemClick={() => onClick(filterType)}
                height={35}
                width={150}
            />
        </div>
    );
};

const FilterToolbar = () => {
    const [filters, setFilters] = useState({
        Employees: false,
        Shift: false,
        Status: false,
        Machine: false,
        Warehouse: false,
        From_To_To_Date: false,
    });

    const handleFilterClick = (filterType) => {
        setFilters({
            ...filters,
            [filterType]: !filters[filterType],
        });
    };

    const filterItems = [
        {
            filterType: 'Employees',
            iconClass: 'material-icons-outlined ic-groups_2',
            label: 'Employees',
            checked: filters.Employees,
        },
        {
            filterType: 'Shift',
            iconClass: 'material-icons-outlined ic-schedule',
            label: 'Shift',
            checked: filters.Shift,
        },
        {
            filterType: 'Status',
            iconClass: 'material-icons-outlined ic-question_mark',
            label: 'Status',
            checked: filters.Status,
        },
        {
            filterType: 'Machine',
            iconClass: 'material-icons-outlined ic-precision_manufacturing',
            label: 'Machine',
            checked: filters.Machine,
        },
        {
            filterType: 'Warehouse',
            iconClass: 'material-icons-outlined ic-warehouse',
            label: 'Warehouse',
            checked: filters.Warehouse,
        },
        {
            filterType: 'From To To Date',
            iconClass: 'material-icons-outlined ic-calendar_today',
            label: 'From To To Date',
            checked: filters.From_To_To_Date,
        },
    ];

    return (
        <div className="filter-toolbar">
            <div className="filter-row">
                {filterItems.map((item) => (
                    <FilterItem
                        key={item.filterType}
                        {...item}
                        onClick={handleFilterClick}
                    />
                ))}
                <Button
                    icon="search"
                    height={40}
                    width={40}
                />
            </div>
        </div>
    );
};

export default FilterToolbar;

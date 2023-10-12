import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import TreeView from "devextreme-react/tree-view";
import { navigation } from "../../app-navigation";
import { useNavigation } from "../../contexts/navigation";
import { useScreenSize } from "../../utils/media-query";
import "./SideNavigationMenu.scss";
import * as events from "devextreme/events";


export default function SideNavigationMenu(props) {

    const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } = props;

    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        // Check if any item is expanded when the component is mounted
        const hasExpandedItem = items.some(item => item.expanded);
        setIsExpanded(hasExpandedItem);
    }, []);

    function normalizePath() {
        return navigation.map((item) => ({
            ...item,
            expanded: false,
            path: item.path && !/^\//.test(item.path) ? `/${item.path}` : item.path,
        }));
    }

    const items = useMemo(
        normalizePath,
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
    );

    const {
        navigationData: { currentPath },
    } = useNavigation();

    const treeViewRef = useRef(null);
    const wrapperRef = useRef();
    const getWrapperRef = useCallback(
        (element) => {
            const prevElement = wrapperRef.current;
            if (prevElement) {
                events.off(prevElement, "dxclick");
            }

            wrapperRef.current = element;
            events.on(element, "dxclick", (e) => {
                openMenu(e);
            });
        },
        [openMenu]
    );

    const [expandedPath, setExpandedPath] = useState("");
    const [selectedPath, setSelectedPath] = useState("");

    const handleTreeViewItemClick = (e) => {
        const clickedPath = e.itemData.path;

        if (expandedPath === clickedPath) {
            setExpandedPath(expandedPath);
        } else {
            setExpandedPath(clickedPath);
        }
        setSelectedPath(clickedPath); // Update selectedPath
        selectedItemChanged(e);
    };

    useEffect(() => {
        const treeView = treeViewRef.current.instance;

        if (!treeView) {
            treeView.collapseAll();
            return;
        }

        if (isExpanded && expandedPath !== currentPath) {
            treeView.collapseAll();
            treeView.selectItem(selectedPath);
            treeView.expandItem(selectedPath);
        }
        else {
            treeView.collapseAll(currentPath);
            treeView.selectItem(currentPath);
            treeView.expandItem(currentPath);
        }
    }, [currentPath, expandedPath, isExpanded, selectedPath]); // Include selectedPath in the dependencies

    const itemRender = (items) => {
        return (
            <>
                <i className="dx-icon material-symbols-outlined">{items.icon}</i>
                <span>{items.text}</span>
            </>
        );
    };

    return (
        <div className={"dx-swatch-additional side-navigation-menu"} ref={getWrapperRef}>
            {children}
            <div className={"menu-container"}>
                <TreeView
                    ref={treeViewRef}
                    items={items}
                    keyExpr={"path"}
                    selectionMode={"single"}
                    focusStateEnabled={false}
                    expandEvent={"click"}
                    onItemClick={handleTreeViewItemClick}
                    onContentReady={onMenuReady}
                    width={"100%"}
                    itemRender={itemRender}
                />
            </div>
        </div>
    );
}
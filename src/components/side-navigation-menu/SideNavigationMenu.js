import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import TreeView from "devextreme-react/tree-view";
import { navigation } from "../../app-navigation";
import { useNavigation } from "../../contexts/navigation";
import { useScreenSize } from "../../utils/media-query";
import "./SideNavigationMenu.scss";
import * as events from "devextreme/events";


export default function SideNavigationMenu(props) {

  const { children, selectedItemChanged, openMenu, compactMode, onMenuReady } = props;

  const { isLarge } = useScreenSize();

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

  const handleTreeViewItemClick = (e) => {
    const clickedPath = e.itemData.path;
       
    if (expandedPath === clickedPath) {
      setExpandedPath(expandedPath);
    }else{
      setExpandedPath(clickedPath);
    }
    selectedItemChanged(e);
    
  };

  useEffect(() => {
    const treeView = treeViewRef.current.instance;
  
    if (!treeView) {
      treeView.collapseAll();
      return;
    }
    
    if (expandedPath === currentPath) {
      treeView.collapseAll(expandedPath);
      treeView.selectItem(expandedPath);
      treeView.expandItem(expandedPath);
    }
    else {
      treeView.collapseAll(currentPath);
      treeView.selectItem(currentPath);
      treeView.expandItem(currentPath);
    }
  }, [currentPath, expandedPath]);

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
          // itemRender={itemRender}
          //expandEvent={"click"}
          onItemClick={handleTreeViewItemClick}
          onContentReady={onMenuReady}
          width={"100%"}
        />
      </div>
    </div>
  );
}
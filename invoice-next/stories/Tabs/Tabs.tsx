import React, { PropsWithChildren } from "react";
import { useTabs, TabsProvider, tabsActions } from "./TabsContext";

export type TabsProps = PropsWithChildren<{
    defaultActiveTab?: string;
}>;

const Tabs = ({ defaultActiveTab, children }: TabsProps) => {
    return <TabsProvider defaultActiveTab={defaultActiveTab}>{children}</TabsProvider>;
};

export type TabProps = PropsWithChildren<{
    id: string;
}>;

const Tab = ({ id, children }: TabProps) => {
    const [_, dispatch] = useTabs();
    const handleClick = () => tabsActions.setActiveTab(dispatch, id);
    return (
        <div
            onClick={handleClick}
        >
            {children}
        </div>
    );
};

export type PanelProps = PropsWithChildren<{
    id: string;
}>;

const Panel = ({ id, children }: PanelProps) => {
    const [{ activeTab }] = useTabs();
    return activeTab === id ? (
        <div >
            {children}
        </div>
    ) : null;
};

Tabs.Tab = Tab;
Tabs.Panel = Panel;

export { Tabs };
import React, { ReactElement } from "react";
import { Tabs } from "./Tabs";
import { useTabs } from "./TabsContext";

interface TabItem {
  id: string;
  content: string;
}

const TabPanel = ({ tabItem, ...props }: { tabItem: TabItem }) => {
  return (
    <Tabs.Panel id={tabItem.id} {...props}>
      {tabItem.content}
    </Tabs.Panel>
  );
};

const Tab = ({ tabItem, ...props }: { tabItem: TabItem }) => {
  const [{ activeTab }] = useTabs();
  const isActiveTab = activeTab === tabItem.id;
  return (
    <Tabs.Tab id={tabItem.id} {...props}>
      {isActiveTab ? "Current tab is:" : "Change to tab:"} {tabItem.id}
    </Tabs.Tab>
  );
};

const MyTabs = () => {
  const tabItems: TabItem[] = [
    { id: "1", content: "foo" },
    { id: "2", content: "bar" },
  ];

  const tabs: ReactElement[] = [];
  const panels: ReactElement[] = [];

  tabItems.forEach((tabItem) => {
    tabs.push(<Tab tabItem={tabItem} />);
    panels.push(<TabPanel key={tabItem.id} tabItem={tabItem} />);
  });

  return (
    <Tabs defaultActiveTab="2">
      <div>{tabs}</div>
      <div>{panels}</div>
    </Tabs>
  );
};

export default MyTabs;

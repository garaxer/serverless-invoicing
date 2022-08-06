import React, { Dispatch, PropsWithChildren, createContext, useContext, useReducer, useEffect } from "react";

/**
 * State
 */

export interface TabsState {
    activeTab?: string;
}

/**
 * Actions
 */

export type TabsAction = { type: "SET_ACTIVE_TAB"; id: string };

export const tabsActions = {
    setActiveTab: (dispatch: Dispatch<TabsAction>, id: string) => {
        dispatch({ type: "SET_ACTIVE_TAB", id });
    },
};

/**
 * Reducer
 */

const reducer = (state: TabsState, action: TabsAction) => {
    switch (action.type) {
        case "SET_ACTIVE_TAB":
            return { ...state, activeTab: action.id };

        default:
            return state;
    }
};

/**
 * Context
 */

const TabsContext = createContext<[TabsState, Dispatch<TabsAction>] | undefined>(undefined);
TabsContext.displayName = "TabsContext";

export type TabsProviderProps = PropsWithChildren<{
    defaultActiveTab?: string;
}>;

export const TabsProvider = ({ defaultActiveTab, children }: TabsProviderProps) => {
    const initialState:TabsState = { activeTab: defaultActiveTab }
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        if (defaultActiveTab && state.activeTab !== defaultActiveTab) {
            tabsActions.setActiveTab(dispatch, defaultActiveTab);
        }
    }, [defaultActiveTab]);

    return <TabsContext.Provider value={[state, dispatch]}>{children}</TabsContext.Provider>;
};

export const useTabs = () => {
    const context = useContext(TabsContext);
    if (context === undefined) {
        throw new Error("TabsContext must be used within a TabsProvider");
    }
    return context;
};
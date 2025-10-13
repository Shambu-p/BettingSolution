// DynamicComponent.tsx
import React, { Suspense } from "react";

// Registry for known components
import registry from "./ComponentRegistry";

interface DynamicComponentProps {
    page: string;
    parentType: ("workspace"|"portal"|"main_ui");
    routeData: any;
    dataPassed: any;
    workspaceParams?: any;
    workspaceNavigation?: (data: any) => void;
    updateWindowData?: (id: string, data: any) => void;
};

const ComponentLoader: React.FC<DynamicComponentProps> = (props) => {

    const mainUINavigation = (navData: any) => {
    };

    const Known = registry[props.page];

    if (Known) return (
        <Known
            routeData={{}}
            dataPassed={props.dataPassed}
            mainNavigation={props.workspaceNavigation ?? mainUINavigation}
            updatePageTitle={(title: string) => {
                if(props.updateWindowData && props.workspaceParams) {
                    props.updateWindowData(props.workspaceParams.id, {...props.workspaceParams, title});
                }
            }}
        />
    );

    // Fallback: dynamic import
    const Lazy = React.lazy(() => import(`./${name}`));
    return (
        <Suspense fallback={<div>Loading {props.page}...</div>}>
            <Lazy
                routeData={{}}
                dataPassed={props.dataPassed}
                mainNavigation={props.workspaceNavigation ?? mainUINavigation}
                updatePageTitle={(title: string) => {
                    if(props.updateWindowData && props.workspaceParams) {
                        props.updateWindowData(props.workspaceParams.id, {...props.workspaceParams, title});
                    }
                }}
            />
        </Suspense>
    );

};

export default ComponentLoader;

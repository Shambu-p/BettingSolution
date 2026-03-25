// DynamicComponent.tsx
import React, { Suspense, useEffect, useState } from "react";

// Registry for known components
import ComponentRegistry from "./ComponentRegistry";
import ErrorPage from "../Views/Error";

interface DynamicComponentProps {
    compId: string;
    dataPassed: any;
    routeData?: any;
    parentType?: ("workspace"|"portal"|"main_ui");
    workspaceParams?: any;
    workspaceNavigation?: (data: any) => void;
    updateWindowData?: (id: string, data: any) => void;
};

const ComponentLoader: React.FC<DynamicComponentProps> = (props) => {

    const [registry, setRegistry] = useState<any>({});

    useEffect(() => {
        loadRegistry();
    }, []);

    const mainUINavigation = (navData: any) => {
    };

    const loadRegistry = async () => {
        const reg = await ComponentRegistry();
        setRegistry(reg);
    }

    const Known = registry[props.compId];
    
    if (Known) {

        return (
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

    } else {

        return (
            <div className="w-100 h-100">
                <ErrorPage message={`Component "${props.compId}" not found or failed to load.`} />
            </div>
        );

    }


    // // Fallback: dynamic import
    // const Lazy = React.lazy(() => import(`./${props.compId}`));
    // return (
    //     <Suspense fallback={<div>Loading {props.compId}...</div>}>
    //         <Lazy
    //             routeData={{}}
    //             dataPassed={props.dataPassed}
    //             mainNavigation={props.workspaceNavigation ?? mainUINavigation}
    //             updatePageTitle={(title: string) => {
    //                 if(props.updateWindowData && props.workspaceParams) {
    //                     props.updateWindowData(props.workspaceParams.id, {...props.workspaceParams, title});
    //                 }
    //             }}
    //         />
    //     </Suspense>
    // );

};

export default ComponentLoader;

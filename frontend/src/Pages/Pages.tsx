import React, { Fragment, useEffect, useState, Suspense } from "react";
import { useNavigate, useParams } from "react-router-dom";

// Registry for known components
import ComponentRegistry from "./ComponentRegistry";
import ComponentLoader from "./ComponentLoader";
import ErrorPage from "../Views/Error";


const Pages = (props: {
    page: string,
    parentType: ("workspace"|"portal"|"main_ui"),
    routeData: any,
    dataPassed: any,
    workspaceParams?: any,
    workspaceNavigation?: (data: any) => void,
    updateWindowData?: (id: string, data: any) => void
    loadComponent?: (page: string) => React.ReactNode;
}) => {

    const params = useParams();
    const navigate = useNavigate();

    const [registry, setRegistry] = useState<any>({});

    useEffect(() => {
        loadRegistry();
    }, []);
    
    const mainUINavigation = (navData: any) => {
        navigate(navData.routeAddress);
    };

    const getComponent = (page: string) => {
        return (
            <ComponentLoader
                compId={page}
                parentType={props.parentType}
                routeData={props.routeData}
                dataPassed={props.dataPassed}
                workspaceParams={props.workspaceParams}
                workspaceNavigation={props.workspaceNavigation}
                updateWindowData={props.updateWindowData}
            />
        );
    };

    const loadRegistry = async () => {
        const reg = await ComponentRegistry();
        setRegistry(reg);
    }

    const Known = registry[props.page];

    // return (
    //     <div></div>
    // );

    if (Known) return (
        <div className="w-100 h-100">
            <Known
                routeData={(props.parentType != "workspace") ? ({...props.routeData, params: {...params}}) : props.routeData}
                dataPassed={props.dataPassed}
                mainNavigation={props.workspaceNavigation ?? mainUINavigation}
                updatePageTitle={(title: string) => {
                    if(props.updateWindowData && props.workspaceParams) {
                        props.updateWindowData(props.workspaceParams.id, {...props.workspaceParams, title});
                    }
                }}
                loadComponent={getComponent}
            />
        </div>
    );

    return (
        <div className="w-100 h-100">
            <ErrorPage message={`Component "${props.page}" not found or failed to load.`} />
        </div>
    );

    // Fallback: dynamic import
    // const Lazy = React.lazy(() => import(`./${props.page}`));
    // return (
    //     <div className="w-100 h-100">
    //         <Suspense fallback={<div>Loading {props.page}...</div>}>
    //             <Lazy
    //                 routeData={(props.parentType != "workspace") ? ({...props.routeData, params: {...params}}) : props.routeData}
    //                 dataPassed={props.dataPassed}
    //                 mainNavigation={props.workspaceNavigation ?? mainUINavigation}
    //                 updatePageTitle={(title: string) => {
    //                     if(props.updateWindowData && props.workspaceParams) {
    //                         props.updateWindowData(props.workspaceParams.id, {...props.workspaceParams, title});
    //                     }
    //                 }}
    //                 loadComponent={getComponent}
    //             />
    //         </Suspense>
    //     </div>
    // );

};

export default Pages;
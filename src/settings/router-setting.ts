import { IconDefinition, faBarsProgress, faFlask, faHome, faMagicWandSparkles } from "@fortawesome/free-solid-svg-icons";

export interface IRouter {
    title: string;
    folder: string;
    icon?: IconDefinition;
    parent?: keyof IRouterInfo
    isNavigation?: boolean
}

export interface IRouterInfo {
    HOME: IRouter;
    WORKFLOW: IRouter;
    WORKFLOW_EDITOR: IRouter;
    TEMPLATE: IRouter;
    DRAWER: IRouter;
    PREVIEW: IRouter;
}

const RouterInfo: IRouterInfo = {
    HOME: {
        title: 'Home',
        icon: faHome,
        folder: '',
        isNavigation: true
    },
    WORKFLOW: {
        title: 'Workflow',
        folder: 'workflow',
        icon: faBarsProgress,
        isNavigation: true,
        parent: "HOME"
    },
    WORKFLOW_EDITOR: {
        title: 'Workflow',
        folder: 'workflow-editor',
        icon: faBarsProgress,
        parent: "WORKFLOW"
    },
    TEMPLATE: {
        title: 'Template',
        folder: 'template',
        icon: faMagicWandSparkles,
        isNavigation: true,
        parent: "HOME"
    },
    DRAWER: {
        title: 'Layout Creator',
        folder: 'drawer',
        icon: faFlask,
        isNavigation: true,
        parent: "HOME"
    },
    PREVIEW: {
        title: '',
        folder: 'preview',
        isNavigation: false,
        parent: 'DRAWER'
    }
}


export default RouterInfo
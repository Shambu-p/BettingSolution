import NavigationTypes from "../Enums/NavigationTypes";
import UserRoles from "../Enums/UserRoles";
import INavigation from "../Intefaces/INavigation";
import DashboardIcon from '@mui/icons-material/Dashboard';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ListIcon from '@mui/icons-material/List';
import AttachmentIcon from '@mui/icons-material/Attachment';
import LockPersonIcon from '@mui/icons-material/LockPerson';
import TuneIcon from '@mui/icons-material/Tune';
import InventoryIcon from '@mui/icons-material/Inventory';
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import WidgetsIcon from '@mui/icons-material/Widgets';
import ContactsIcon from '@mui/icons-material/Contacts';
import StoreIcon from '@mui/icons-material/Store';
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import MiscellaneousServicesIcon from '@mui/icons-material/MiscellaneousServices';
import PlusOneIcon from '@mui/icons-material/PlusOne';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import WebAssetIcon from '@mui/icons-material/WebAsset';
import SellIcon from '@mui/icons-material/Sell';
// import ConveyorBeltIcon from '@mui/icons-material/ConveyorBelt';
import FactoryIcon from '@mui/icons-material/Factory';
import WebhookIcon from '@mui/icons-material/Webhook';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ProcessIcon from '@mui/icons-material/Memory';
import TimerOutlinedIcon from '@mui/icons-material/TimerOutlined';
import GridViewIcon from '@mui/icons-material/GridView';


const SideBarNavigation: INavigation[] = [
    {
        Name: "Dashboard",
        ParentName: null,
        Icon: DashboardIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Asset Management",
        ParentName: null,
        Icon: WebAssetIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "sell",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Products",
        ParentName: "Asset Management",
        Icon: WidgetsIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/product/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Sell Management",
        ParentName: null,
        Icon: PointOfSaleIcon,
        roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "sell",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Create Sell",
        ParentName: "Sell Management",
        Icon: PointOfSaleIcon,
        roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/create-sell/-1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Sells",
        ParentName: "Sell Management",
        Icon: PointOfSaleIcon,
        roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/sell/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Sell Orders",
        ParentName: "Sell Management",
        Icon: StoreIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/transfer/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Sell Product Item",
        ParentName: "Sell Management",
        Icon: PointOfSaleIcon,
        roles: [UserRoles.Admin, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/sell_product/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Production Management",
        ParentName: null,
        Icon: FactoryIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "production",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Production Form",
        ParentName: "Production Management",
        Icon: FactoryIcon,
        roles: [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/production-form/-1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Product Receiving Slip",
        ParentName: "Production Management",
        Icon: FactoryIcon,
        roles: [UserRoles.Admin, UserRoles.ProductionManager, UserRoles.BranchManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/receive-slip/-1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Productions",
        ParentName: "Production Management",
        Icon: WidgetsIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.ProductionManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/production/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Needs Start Approval",
        ParentName: "Production Management",
        Icon: WidgetsIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/production/1?filter=%257B%2522status%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522waiting_consumption_approval%2522%252C%2522type%2522%253A%2522select%2522%257D%257D",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Consumption",
        ParentName: "Production Management",
        Icon: WidgetsIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/production_consumption/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Finished Products",
        ParentName: "Production Management",
        Icon: WidgetsIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/finished_product/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Products Store In",
        ParentName: "Production Management",
        Icon: WidgetsIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/receive_product/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },

    {
        Name: "Store Management",
        ParentName: null,
        Icon: StoreIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "store management",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Stores",
        ParentName: "Store Management",
        Icon: StoreIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/store/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Stores Items",
        ParentName: "Store Management",
        Icon: StoreIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/store_item/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Stores Products",
        ParentName: "Store Management",
        Icon: StoreIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/store_product/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Services",
        ParentName: "Asset Management",
        Icon: MiscellaneousServicesIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/service/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Inventory",
        ParentName: "Asset Management",
        Icon: InventoryIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/inventory_item/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Purchase Management",
        ParentName: null,
        Icon: ShoppingBasketIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "purchase",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Create Purchase",
        ParentName: "Purchase Management",
        Icon: ShoppingBasketIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/create-purchase/-1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Purchase",
        ParentName: "Purchase Management",
        Icon: ShoppingBasketIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/purchase/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Purchase Needs Approval",
        ParentName: "Purchase Management",
        Icon: ShoppingBasketIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/purchase/1?filter=%257B%2522status%2522%253A%257B%2522operator%2522%253A%2522equals%2522%252C%2522value%2522%253A%2522waiting_approval%2522%252C%2522type%2522%253A%2522select%2522%257D%257D",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Purchase Items",
        ParentName: "Purchase Management",
        Icon: ShoppingBasketIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/purchase_item/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Customer And Delivery",
        ParentName: null,
        Icon: DeliveryDiningIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "customer and delivery",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Delivery",
        ParentName: "Customer And Delivery",
        Icon: DeliveryDiningIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/delivery/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Customers",
        ParentName: "Customer And Delivery",
        Icon: ContactsIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/customer/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Users And Access Control",
        ParentName: null,
        Icon: AccountBoxIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "user and access",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Users",
        ParentName: "Users And Access Control",
        Icon: AccountBoxIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/user/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "User Roles",
        ParentName: "Users And Access Control",
        Icon: LockPersonIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/userRole/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "User Store Settings",
        ParentName: "Users And Access Control",
        Icon: SellIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/user_store/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },

    {
        Name: "Accounting and Finance",
        ParentName: null,
        Icon: AccountBalanceWalletIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "/list/account",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Finance Dashboard",
        ParentName: "Accounting and Finance",
        Icon: DashboardIcon,
        roles: [UserRoles.Admin, UserRoles.BranchManager, UserRoles.Finance, UserRoles.ProductionManager, UserRoles.Sells],
        type: NavigationTypes.LINK,
        active: true,
        link: "/finance=dashboard",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Store/Sells Report",
        ParentName: "Accounting and Finance",
        Icon: DashboardIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/store-report",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Accounts",
        ParentName: "Accounting and Finance",
        Icon: AccountBalanceWalletIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/account/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Transactions",
        ParentName: "Accounting and Finance",
        Icon: AccountBalanceWalletIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/transaction/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Main Transactions",
        ParentName: "Accounting and Finance",
        Icon: AccountBalanceWalletIcon,
        roles: [UserRoles.Admin, UserRoles.Finance],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/main_transaction/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },


    {
        Name: "API Integration",
        ParentName: null,
        Icon: WebhookIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "API Users",
        ParentName: "API Integration",
        Icon: WebhookIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/api_user/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "API Endpoints",
        ParentName: "API Integration",
        Icon: WebhookIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/endpoint/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },


    {
        Name: "Flow Management",
        ParentName: null,
        Icon: ListIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "/list/flow_defination/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Flow Definations",
        ParentName: "Flow Management",
        Icon: AccountTreeIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/flow_defination/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Processes",
        ParentName: "Flow Management",
        Icon: ProcessIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/process/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Waiting Process",
        ParentName: "Flow Management",
        Icon: TimerOutlinedIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/waiting_process/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Flow Builder",
        ParentName: "Flow Management",
        Icon: AccountTreeIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/flow-builder",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Posts",
        ParentName: "Flow Management",
        Icon: TimerOutlinedIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/post/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },



    {
        Name: "UI Management",
        ParentName: null,
        Icon: GridViewIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "/list/ui_component",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "UI Components",
        ParentName: "UI Management",
        Icon: GridViewIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/ui_component/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },


    {
        Name: "System Settings",
        ParentName: null,
        Icon: ListIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.CONTAINER,
        active: true,
        link: "/list/choice",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Choices",
        ParentName: "System Settings",
        Icon: ListIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/choice/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "System Navigation",
        ParentName: "System Settings",
        Icon: ListIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/system_nav/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "System Actions",
        ParentName: "System Settings",
        Icon: TuneIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/system/actions",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Attachments",
        ParentName: "System Settings",
        Icon: AttachmentIcon,
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/attachment/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    },
    {
        Name: "Auto Numbers",
        Icon: PlusOneIcon,
        ParentName: "System Settings",
        roles: [UserRoles.Admin],
        type: NavigationTypes.LINK,
        active: true,
        link: "/list/auto_number/1",
        validator: async (user: any): Promise<boolean> => {
            return true;
        },
        action: async (user: any): Promise<void> => {

        }
    }

];

export default SideBarNavigation;
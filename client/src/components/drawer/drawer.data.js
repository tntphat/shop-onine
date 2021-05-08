import InboxIcon from "@material-ui/icons/MoveToInbox";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import PeopleOutlineIcon from "@material-ui/icons/PeopleOutline";
import DashboardIcon from "@material-ui/icons/Dashboard";
import BarChartIcon from "@material-ui/icons/BarChart";
import CategoryIcon from "@material-ui/icons/Category";
import LayersIcon from "@material-ui/icons/Layers";

const data = [
  { id: 1, link: "/admin", name: "Dasboard", icon: <DashboardIcon /> },
  { id: 2, link: "/admin/mail", name: "Mail", icon: <InboxIcon /> },
  {
    id: 3,
    link: "/admin/products",
    name: "Products",
    icon: <ShoppingCartIcon />,
  },
  { id: 5, link: "/admin/chart", name: "Chart", icon: <BarChartIcon /> },
  {
    id: 7,
    link: "/admin/employees",
    name: "Employees",
    icon: <PeopleOutlineIcon />,
  },
  {
    id: 11,
    link: "/admin/categories",
    name: "Categories",
    icon: <CategoryIcon />,
  },
  {
    id: 13,
    link: "/admin/authorities",
    name: "Authorities",
    icon: <LayersIcon />,
  },
];

export default data;

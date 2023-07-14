import React, { useEffect, useState } from "react";
import { useMenuMutation } from "../../../features/users";

const Navigation = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    responseMenu();
  }, []);

  const [getMenu] = useMenuMutation();

  const responseMenu = async () => {
    try {
      const response = await getMenu();
      setMenu(response.data.menus); // Update to response.data.menus
      console.log(response.data.menus);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-100">
      <div className="drawer lg:drawer-open">
        <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col items-center justify-center">
          {/* Page content here */}
          <label
            htmlFor="my-drawer-2"
            className="btn btn-primary drawer-button lg:hidden"
          >
            Open Menu
          </label>
        </div>
        <div className="drawer-side">
          <label htmlFor="my-drawer-2" className="drawer-overlay"></label>
          <ul className="menu p-4 w-64 h-full bg-base-200 text-base-content">
            {/* Sidebar content here */}
            {menu.map((item) => (
              <li key={item.id} className="py-1">
                <a href={item.url} className="text-base font-semibold">
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

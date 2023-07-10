import React, { useEffect, useState } from "react";
import { useMenuMutation } from "../../../features/users";

const Navigation = () => {
  const [menu, setMenu] = useState([]);

  useEffect(() => {
    responseMenu();
  }, []);

  const [getMenu] = useMenuMutation();
  const [openSubMenus, setOpenSubMenus] = useState([]);

  const responseMenu = async () => {
    try {
      const response = await getMenu();
      setMenu(response.data.menus);
    } catch (error) {
      console.log(error);
    }
  };

  const toggleSubMenu = (itemId) => {
    if (openSubMenus.includes(itemId)) {
      setOpenSubMenus(openSubMenus.filter((id) => id !== itemId));
    } else {
      setOpenSubMenus([...openSubMenus, itemId]);
    }
  };

  return (
    <div className="h-full flex overflow-hidden bg-gray-100">
      <div className="h-full drawer lg:drawer-open">
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
              <div key={item.id}>
                {item.subMenus.length > 0 ? (
                  <>
                    <a
                      href={item.url}
                      className={`flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900 ${
                        openSubMenus.includes(item.id)
                          ? "bg-gray-200 text-gray-900"
                          : ""
                      }`}
                      onClick={() => toggleSubMenu(item.id)}
                    >
                      {item.name}
                    </a>
                    <div
                      className={`ml-6 ${
                        openSubMenus.includes(item.id) ? "block" : "hidden"
                      }`}
                    >
                      {item.subMenus.map((subMenu) => (
                        <a
                          key={subMenu.id}
                          href={subMenu.url}
                          className="flex items-center px-6 py-2 text-sm text-gray-500 hover:text-gray-900"
                        >
                          {subMenu.name}
                        </a>
                      ))}
                    </div>
                  </>
                ) : (
                  <a
                    href={item.url}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 hover:text-gray-900"
                  >
                    {item.name}
                  </a>
                )}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navigation;

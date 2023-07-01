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
      console.log(response.data.menus);
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
    <div className="h-screen flex overflow-hidden bg-gray-100">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 border-r border-gray-200 bg-white">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <nav className="flex-1 px-2 space-y-1">
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
            </nav>
          </div>
          <div className="flex-shrink-0 flex bg-gray-100 p-4">
            {/* Add your sidebar footer content here */}
          </div>
        </div>
      </div>
      <div className="flex flex-col flex-1">
        {/* Add the main content of your page here */}
      </div>
    </div>
  );
};

export default Navigation;

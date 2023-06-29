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
      console.log(response.data.menus);
      setMenu(response.data.menus); // Update to set the menu array from response data
    } catch (error) {
      console.log(error);
    }
  };

  const handleMenuClick = (e, item) => {
    e.preventDefault();
    const updatedMenu = menu.map((menuItem) => {
      if (menuItem.name === item.name) {
        return { ...menuItem, showSubMenu: !item.showSubMenu };
      }
      return menuItem;
    });
    setMenu(updatedMenu);
  };

  return (
    <>
      <nav className="bg-gray-800 text-white w-64 p-4">
        <ul>
          {menu.map((item, index) => (
            <li key={item.name} className="relative">
              <a
                href={item.url}
                className="text-white hover:text-gray-300"
                onClick={(e) => handleMenuClick(e, item)}
              >
                {item.name}
              </a>
              {item.showSubMenu && item.subMenus && (
                <ul className="absolute top-full left-0 bg-white text-gray-800 shadow-lg rounded-lg py-2 space-y-2 z-10 opacity-100 transition-opacity duration-300">
                  {item.subMenus.map((subMenu) => (
                    <li key={subMenu.name}>
                      <a
                        href={subMenu.url}
                        className="block px-4 py-2 hover:bg-gray-200"
                      >
                        {subMenu.name}
                      </a>
                    </li>
                  ))}
                </ul>
              )}
              {index < menu.length - 1 && (
                <div className="border-b border-gray-300 my-1"></div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;

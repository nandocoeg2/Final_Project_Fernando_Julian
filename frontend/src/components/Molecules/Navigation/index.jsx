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
      setMenu(response.data.menus); // Update to set the menu array from response data
      console.log("ini hasil menu", response.data.menus);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <nav className="bg-gray-800 text-white w-64 p-4">
        <ul>
          {menu.map((item) => (
            <li key={item.name} className="mb-2">
              <a href={item.url} className="text-white hover:text-gray-300">
                {item.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
};

export default Navigation;

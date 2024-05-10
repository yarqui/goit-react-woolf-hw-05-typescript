import React, {
  createContext,
  useMemo,
  useState,
  useContext,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import noop from "lodash/noop";

type MenuIds = "first" | "second" | "last";
type Menu = { id: MenuIds; title: string };

type MenuSelected = {
  selectedMenu: Menu | Record<string, never>;
};

type MenuAction = {
  onSelectedMenu: Dispatch<SetStateAction<Menu | Record<string, never>>>;
};

// Додати тип Menu Selected

const MenuSelectedContext = createContext<MenuSelected | undefined>({
  selectedMenu: {},
});

// Додайте тип MenuAction

const MenuActionContext = createContext<MenuAction | undefined>({
  onSelectedMenu: noop,
});

type PropsProvider = {
  children: ReactNode; // Додати тип для children
};

function MenuProvider({ children }: PropsProvider) {
  // Додати тип для SelectedMenu він повинен містити { id }
  const [selectedMenu, setSelectedMenu] = useState<
    Menu | Record<string, never>
  >({});

  const menuContextAction = useMemo(
    () => ({
      onSelectedMenu: setSelectedMenu,
    }),
    []
  );

  const menuContextSelected = useMemo(
    () => ({
      selectedMenu,
    }),
    [selectedMenu]
  );

  return (
    <MenuActionContext.Provider value={menuContextAction}>
      <MenuSelectedContext.Provider value={menuContextSelected}>
        {children}
      </MenuSelectedContext.Provider>
    </MenuActionContext.Provider>
  );
}

type PropsMenu = {
  menus: Menu[]; // Додайте вірний тип для меню
};

function useMenuActionContext() {
  const context = useContext(MenuActionContext);
  if (context === undefined) {
    throw new Error(
      "onSelectedMenu should be used inside a MenuActionContext Provider "
    );
  }
  return context;
}

function useMenuSelectedContext() {
  const context = useContext(MenuSelectedContext);

  if (context === undefined) {
    throw new Error(
      "selectedMenu should be used inside a MenuSelectedContext Provider "
    );
  }
  return context;
}

function MenuComponent({ menus }: PropsMenu) {
  const { onSelectedMenu } = useMenuActionContext();
  const { selectedMenu } = useMenuSelectedContext();

  return (
    <>
      {menus.map((menu) => (
        <div
          key={menu.id}
          onClick={() => onSelectedMenu({ id: menu.id, title: menu.title })}
        >
          {menu.title}{" "}
          {selectedMenu.id === menu.id ? "Selected" : "Not selected"}
        </div>
      ))}
    </>
  );
}

export function ComponentApp() {
  const menus: Menu[] = [
    {
      id: "first",
      title: "first",
    },
    {
      id: "second",
      title: "second",
    },
    {
      id: "last",
      title: "last",
    },
  ];

  return (
    <MenuProvider>
      <MenuComponent menus={menus} />
    </MenuProvider>
  );
}

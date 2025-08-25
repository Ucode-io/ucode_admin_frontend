const newClickHandler = ({
  el,
  element,
  navigate,
  dispatch,
  menuActions,
  relationTabActions,
  setSelectedApp,
  setFolderItem,
  setSelectedFolder,
  closeMenu,
  menuChilds,
  coontrolAccordionAction,
  setElement,
  setSubMenuIsOpen,
  auth,
}) => {
  if (element?.id === "USERS_MENU_ITEM_ID") {
    return navigate("/client-types");
  }

  dispatch(menuActions.setMenuItem(element));
  dispatch(relationTabActions.clear());
  setSelectedApp(element);

  if (element.type === "FOLDER") {
    setFolderItem(el);
    setSelectedFolder(el?.id ? el : element);
    const isOpen = menuChilds[element.id]?.open;
    if (isOpen) {
      closeMenu(element.id);
      return;
    } else {
      coontrolAccordionAction(element);
      setElement(element);
      setSubMenuIsOpen(true);
    }
    return;
  }

  if (element.type === "TABLE") {
    setSubMenuIsOpen(false);
    navigate(`/${element?.id}`);
  } else if (element.type === "LINK") {
    const website_link = element?.attributes?.website_link;
    if (website_link) {
      navigate(`/${element?.id}/website`, {
        state: {url: website_link},
      });
    } else if (element?.id === "3b74ee68-26e3-48c8-bc95-257ca7d6aa5c") {
      navigate(
        replaceValues(
          element?.attributes?.link,
          auth?.loginTableSlug,
          auth?.userId
        )
      );
    } else {
      navigate(element?.attributes?.link);
    }
    setSubMenuIsOpen(false);
  } else if (element.type === "MICROFRONTEND") {
    setSubMenuIsOpen(false);
    let obj = {};
    element?.attributes?.params.forEach((el) => {
      obj[el.key] = el.value;
    });
    const searchParams = new URLSearchParams(obj || {});
    return navigate({
      pathname: `/${element.id}/page/${element?.data?.microfrontend?.id}`,
      search: `?menuId=${element?.id}&${searchParams.toString()}`,
    });
  } else if (element.type === "WEBPAGE") {
    navigate(
      `/${element?.id}/web-page/${element?.data?.webpage?.id}?menuId=${element?.id}`
    );
    setSubMenuIsOpen(false);
  }
};

export default newClickHandler;

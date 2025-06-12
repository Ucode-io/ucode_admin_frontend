const oldClickHandler = ({
  el,
  element,
  navigate,
  dispatch,
  menuActions,
  relationTabActions,
  setSelectedApp,
  setMenuDraggable,
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
    setMenuDraggable(false);
    const isOpen = menuChilds[element.id]?.open;
    if (isOpen) {
      closeMenu(element.id);
      return;
    } else {
      coontrolAccordionAction(element);
      setElement(element);
      setSubMenuIsOpen(true);
      navigate(`/main/${element.id}`);
    }
    return;
  }

  if (element.type === "TABLE") {
    setSubMenuIsOpen(false);
    navigate(
      `/main/${element?.parent_id}/object/${element?.data?.table?.slug}?menuId=${element?.id}`
    );
  } else if (element.type === "LINK") {
    const website_link = element?.attributes?.website_link;
    if (website_link) {
      navigate(`/main/${element?.id}/website`, {
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
      pathname: `/main/${element.id}/page/${element?.data?.microfrontend?.id}`,
      search: `?menuId=${element?.id}&${searchParams.toString()}`,
    });
  } else if (element.type === "WEBPAGE") {
    navigate(
      `/main/${element?.id}/web-page/${element?.data?.webpage?.id}?menuId=${element?.id}`
    );
    setSubMenuIsOpen(false);
  }
};

export default oldClickHandler;

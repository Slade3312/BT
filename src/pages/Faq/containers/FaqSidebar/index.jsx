import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import SideMenu from 'components/layouts/SideMenu';

function FaqSidebar(props) {
  const { Faq } = useContext(StoresContext);
  const propsWithSidebar = {
    items: Faq.sideMenuList,
    ...props,
  };
  return <SideMenu {...propsWithSidebar} />;
}

export default observer(FaqSidebar);


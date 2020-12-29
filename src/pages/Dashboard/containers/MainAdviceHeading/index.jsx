import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { StoresContext } from 'store/mobx';
import { ExoticHeading } from 'components/layouts';

export default observer(({ className, level }) => {
  const { Templates } = useContext(StoresContext);
  const { dashboard } = Templates.data;

  return (
    <ExoticHeading
      className={className}
      level={level}
    >
      {dashboard?.MainAdviceHeading?.title}
    </ExoticHeading>
  );
});

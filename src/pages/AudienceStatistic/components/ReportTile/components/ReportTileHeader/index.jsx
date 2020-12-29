import React from 'react';
import TileWrapper from '../TileWrapper';
import TileCol from '../TileCol';

export default function ReportTileHeader() {
  return (
    <TileWrapper isCompact>
      <TileCol>Дата начала</TileCol>
      <TileCol>Название</TileCol>
      <TileCol>Кол-во людей в выборке</TileCol>
      <TileCol />
    </TileWrapper>
  );
}

'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
// Theme
import type { ColDef, CellClickedEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// Core CSS
import { AgGridReact } from 'ag-grid-react';
import HistoryAddModal from '../modal/HistoryAddModal';
import { RowData } from '@lib/types/history';
import { useMediaQuery } from '@mui/material';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function HistoryGrid({
  historyList,
}: {
  historyList: RowData[];
}) {
  const isMobile = useMediaQuery('(max-width:768px)');
  const [rowData, setRowData] = useState<RowData[]>(historyList);

  // 모바일의 경우 grid 간소화를 위해 일부 컬럼만 렌더링
  const colDefs = useMemo<ColDef<RowData>[]>(() => {
    const baseCols: ColDef<RowData>[] = [
      { field: 'no', headerName: '순서', flex: 0.5 },
      {
        field: 'description',
        headerName: '설명',
        flex: 2,
        filter: true,
        cellStyle: { textAlign: 'center' },
      },
      { field: 'amount', headerName: '금액', flex: 1 },
      { field: 'date', headerName: '날짜', flex: 1.5 },
      { field: 'writer', headerName: '이름', flex: 1 },
      { field: 'type', headerName: '지출/수입', flex: 1 },
      { field: 'categoryName', headerName: '항목', flex: 1 },
    ];

    return isMobile
      ? baseCols.filter(
          (col) =>
            !['no', 'writer', 'type', 'categoryName'].includes(col.field!),
        )
      : baseCols;
  }, [isMobile]);

  // 모달 상태 및 선택된 row 데이터
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<RowData | null>(null);

  // 셀 클릭 이벤트 핸들러
  const handleCellClick = useCallback((event: CellClickedEvent<RowData>) => {
    if (event.data) {
      setModalOpen(true);
      setSelectedRow(event.data);
    }
  }, []);

  useEffect(() => {
    if (historyList) {
      setRowData(historyList);
    }
  }, [historyList]);

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellClicked={handleCellClick} // 셀 클릭 이벤트 추가
        pagination={isMobile ? false : true}
      />

      {/* 입금 모달 */}
      <HistoryAddModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        selectedData={selectedRow}
      />
    </div>
  );
}

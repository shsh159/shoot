'use client';

import { useCallback, useEffect, useState } from 'react';
// Theme
import type { ColDef, CellClickedEvent } from 'ag-grid-community';
import { AllCommunityModule, ModuleRegistry } from 'ag-grid-community';
// Core CSS
import { AgGridReact } from 'ag-grid-react';
import HistoryAddModal from '../modal/HistoryAddModal';
import { RowData } from '@lib/types/history';

ModuleRegistry.registerModules([AllCommunityModule]);

export default function HistoryGrid({
  historyList,
}: {
  historyList: RowData[];
}) {
  // Row Data
  const [rowData, setRowData] = useState<RowData[]>(historyList);

  // Column Definitions
  const [colDefs] = useState<ColDef<RowData>[]>([
    { field: 'no', width: 70 },
    { field: 'description', flex: 1 },
    { field: 'amount', width: 120 },
    { field: 'date', width: 140 },
    { field: 'writer', width: 120 },
    { field: 'type', width: 100 },
    { field: 'categoryName', width: 120 },
  ]);

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

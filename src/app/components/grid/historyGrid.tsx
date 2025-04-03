"use client";

import { useCallback, useState } from "react";
// Theme
import type { ColDef, CellClickedEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";
import HistoryAddModal from "../modal/historyAddModal";
import dayjs, { Dayjs } from "dayjs";

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
  no?: number;
  description: string;
  amount: number;
  date: string;
  writer: string;
  type: "income" | "expense";
}

export default function HistoryGrid() {
  // Row Data
  const [rowData] = useState<IRow[]>([
    { no: 3, description: "입금 테스트", amount: 64950, date: "2025-03-16", writer: 'kim', type:'income' },
    { no: 2, description: "출금 테스트", amount: 33850, date: "2025-03-16", writer: 'byun', type:'expense' },
    { no: 1, description: "입금 테스트", amount: 29600, date: "2025-03-15", writer: 'byun', type:'income' },
  ]);

  // Column Definitions
  const [colDefs] = useState<ColDef<IRow>[]>([
    { field: "no" },
    { field: "description" },
    { field: "amount" },
    { field: "date" },
    { field: "writer" },
    { field: "type"}
  ]);

  // 모달 상태 및 선택된 row 데이터
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<IRow | null>(null);

  // 셀 클릭 이벤트 핸들러
  const handleCellClick = useCallback((event: CellClickedEvent<IRow>) => {
    if (event.data) {
        setModalOpen(true);
        setSelectedRow(event.data);
    }
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <AgGridReact
        rowData={rowData}
        columnDefs={colDefs}
        onCellClicked={handleCellClick} // 셀 클릭 이벤트 추가
      />

      {/* 입금 모달 */}
      <HistoryAddModal open={modalOpen} handleClose={() => setModalOpen(false)} selectedData={selectedRow} />
    </div>
  );
}

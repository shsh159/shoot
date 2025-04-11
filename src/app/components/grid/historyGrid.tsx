"use client";

import { useCallback, useEffect, useState } from "react";
// Theme
import type { ColDef, CellClickedEvent } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";
import HistoryAddModal from "../modal/historyAddModal";
import { RowData } from "@/app/types";

ModuleRegistry.registerModules([AllCommunityModule]);

export default function HistoryGrid({historyList} : {historyList: RowData[]}) {
  // Row Data
  const [rowData, setRowData] = useState<RowData[]>(historyList);

  // Column Definitions
  const [colDefs] = useState<ColDef<RowData>[]>([
    { field: "no" },
    { field: "description" },
    { field: "amount" },
    { field: "date" },
    { field: "writer" },
    { field: "type"}
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

  useEffect(()=>{
    if (historyList) {
      setRowData(historyList);
    }
  }, [historyList])

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

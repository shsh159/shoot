"use client";

import { useCallback, useEffect, useState } from "react";
// Theme
import type { ColDef } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
// Core CSS
import { AgGridReact } from "ag-grid-react";

ModuleRegistry.registerModules([AllCommunityModule]);

// Row Data Interface
interface IRow {
  no: number;
  description: string;
  amount: number;
  date: string;
}

export default function HistoryGrid() {

    // Row Data: The data to be displayed.
    const [rowData, setRowData] = useState<IRow[]>([
        { no: 3, description: "입금 테스트", amount: 64950, date: '2025-03-16' },
        { no: 2, description: "출금 테스트", amount: 33850, date: '2025-03-16' },
        { no: 1, description: "입금 테스트", amount: 29600, date: '2025-03-15' },
    ]);

    // Column Definitions: Defines & controls grid columns.
    const [colDefs, setColDefs] = useState<ColDef<IRow>[]>([
        { field: "no" },
        { field: "description" },
        { field: "amount" },
        { field: "date" },
    ]);

    return(
        <div style={{ width: "100%", height: "100%" }}>
            <AgGridReact rowData={rowData} columnDefs={colDefs} />
        </div>
    );
}
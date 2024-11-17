import { useCallback, useEffect, useRef, useState } from 'react'
import { AgGridReact } from 'ag-grid-react'
import { v4 as uuidv4 } from 'uuid'
import 'ag-grid-community/styles/ag-grid.css'
import 'ag-grid-community/styles/ag-theme-alpine.css'

import { RowActionDelete } from './components/RowActionDelete'
import { RowActionEdit } from './components/RowActionEdit'

interface DataType {
  id: number
  color: string
  value1: number
  value2: number
  action?: string | null
}

const columnDefs = [
  {
    field: 'id',
    pinned: 'left',
    maxWidth: 100,
    sortable: true,
    sortingOrder: ['asc']
  },
  { field: 'color', filter: true },
  { field: 'value1' },
  { field: 'value2' }
]

const topGridColumnDefs = [
  ...columnDefs,
  {
    field: 'action',
    pinned: 'right',
    cellRenderer: RowActionDelete,
    maxWidth: 140,
    cellStyle: { align: 'center' }
  }
]

const bottomGridColumnDefs = [
  ...columnDefs,
  {
    field: 'action',
    pinned: 'right',
    cellRenderer: RowActionEdit,
    maxWidth: 140,
    cellStyle: { align: 'center' }
  }
]

const rowClassRules = {
  'bg-red-500': 'data.action === "remove"',
  'bg-green-500': 'data.action === "insert"'
}

const defaultColDef = {
  flex: 1,
  minWidth: 100,
  sortable: false,
  filter: false,
  resizable: true
}

const data: DataType[] = [
  {
    id: 1,
    color: 'red',
    value1: 123,
    value2: 234,
    action: null
  },
  {
    id: 2,
    color: 'green',
    value1: 123,
    value2: 234,
    action: null
  },
  {
    id: 3,
    color: 'gray',
    value1: 123,
    value2: 234,
    action: null
  },
  {
    id: 4,
    color: 'gray',
    value1: 123,
    value2: 234,
    action: null
  }
]

function AgGridApp() {
  const [topRowData, setTopRowData] = useState<DataType[]>(data)
  const [bottomRowData, setBottomRowData] = useState<DataType[]>([])

  const topGridRef = useRef<any>(null)
  const bottomGridRef = useRef<any>(null)

  const getRowId = (params: { data: { id: any } }) => params.data.id

  useEffect(() => {
    const topRowData = data.filter(({ action }) => action !== 'insert')
    setTopRowData(topRowData)
  }, [])

  const updateGrid = () => {
    let rowData: any[] = []
    topGridRef.current!.api.forEachNode((node: any) => rowData.push(node.data))

    const bottomRowData = rowData.filter(({ action }) => action)
    setBottomRowData(bottomRowData)
  }

  const isExternalFilterPresent = useCallback(() => {
    return true
  }, [])

  const doesExternalFilterPass = useCallback((node: any) => {
    if (node.data) {
      return node.data.action !== 'insert'
    }
    return true
  }, [])

  const insertRow = () => {
    const row = {
      id: uuidv4(),
      // id: Math.floor(Math.random() * data.length * 9407),
      color: 'red',
      value1: 123,
      value2: 234,
      action: 'insert'
    }
    topGridRef.current!.api.applyTransaction({
      add: [row]
    })
    updateGrid()
  }

  return (
    <div className='bg-neutral-800 flex flex-col gap-4 h-screen w-screen ag-theme-alpine-dark p-4'>
      <AgGridReact<DataType>
        ref={topGridRef}
        alignedGrids={
          bottomGridRef.current ? [bottomGridRef.current] : undefined
        }
        context={{ updateGrid }}
        defaultColDef={defaultColDef}
        columnDefs={topGridColumnDefs as any}
        rowClassRules={rowClassRules}
        getRowId={getRowId}
        rowData={topRowData}
        isExternalFilterPresent={isExternalFilterPresent}
        doesExternalFilterPass={doesExternalFilterPass}
      />

      <div className='flex items-center justify-center gap-4'>
        <button type='button' onClick={insertRow}>
          Insert
        </button>
        <button>Remove</button>
        <button>Clear</button>
      </div>

      <AgGridReact<DataType>
        ref={bottomGridRef}
        alignedGrids={topGridRef.current ? [topGridRef.current] : undefined}
        context={{ updateGrid, alignedGridRef: topGridRef.current }}
        defaultColDef={defaultColDef}
        columnDefs={bottomGridColumnDefs as any}
        rowClassRules={rowClassRules}
        getRowId={getRowId}
        rowData={bottomRowData}
      />
    </div>
  )
}

export default AgGridApp

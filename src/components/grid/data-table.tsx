"use client"

import * as React from "react"
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
    getFilteredRowModel,
    ColumnDef,
    flexRender,
    SortingState,
    VisibilityState,
    RowData,
    getGroupedRowModel,
    getExpandedRowModel,
    GroupingState,
    ExpandedState
} from "@tanstack/react-table"

import {
    Users,
    ChevronRight,
    ChevronDown,
    MessageSquare,
    Settings2,
    Share2,
    GripVertical,
    Maximize2,
    Type,
    Hash,
    Paperclip,
    CheckSquare,
    User,
    Calendar as CalendarIcon,
    X,
    MoreHorizontal,
    Plus,
    ArrowUpDown,
    Check,
    FileText,
    File,
    Image as ImageIcon,
    Music,
    Video,
    FileJson,
    FileCode,
    FileArchive,
    Clock,
    UserPlus,
    Hash as AutoNumberIcon,
    IdCard,
} from "lucide-react"

declare module "@tanstack/react-table" {
    interface TableMeta<TData extends RowData> {
        updateData: (rowId: string, columnId: string, value: unknown) => void
        openProfile: (row: TData) => void
        deleteRows: (rowIds: string[]) => void
    }
}

import { useVirtualizer } from "@tanstack/react-virtual"
import { uploadFile } from "@/app/actions/upload"
import { updateRowData, createRow, deleteRows } from "@/app/actions/rows"
import { renameColumn } from "@/app/actions/sheets"
import { GridColumn, GridRow } from "./types"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

// Editable cell renderer
const EditableCell = ({
    getValue,
    row,
    column,
    table,
}: {
    getValue: () => unknown
    row: { id: string, original: GridRow }
    column: GridColumn
    table: { options: { meta?: { updateData: (rowId: string, columnId: string, value: unknown) => void, openProfile: (row: GridRow) => void } } }
}) => {
    const initialValue = getValue()
    const [value, setValue] = React.useState(initialValue)
    const [isUploading, setIsUploading] = React.useState(false)
    const [isDialogOpen, setIsDialogOpen] = React.useState(false)

    const isPatientNameColumn = column.name.toLowerCase() === 'patient name' || column.id === 'patientName'

    // Sync with external data changes
    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    const onBlur = async () => {
        table.options.meta?.updateData(row.id, column.id, value)
    }

    const onSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setValue(e.target.value)
        table.options.meta?.updateData(row.id, column.id, e.target.value)
    }

    const onCheckboxChange = (checked: boolean) => {
        setValue(checked)
        table.options.meta?.updateData(row.id, column.id, checked)
    }

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.length) return

        setIsUploading(true)
        const newFiles = []

        const currentFiles = Array.isArray(value) ? value : []

        for (let i = 0; i < e.target.files.length; i++) {
            const file = e.target.files[i]
            const formData = new FormData()
            formData.append("file", file)

            try {
                const res = await uploadFile(formData)
                if (res.success) {
                    newFiles.push({ name: file.name, path: res.path })
                }
            } catch (error) {
                console.error("Upload failed for", file.name, error)
            }
        }

        const updatedValue = [...currentFiles, ...newFiles]
        setValue(updatedValue)
        table.options.meta?.updateData(row.id, column.id, updatedValue)
        setIsUploading(false)

        // Reset input
        e.target.value = ""
    }

    switch (column.type) {
        case 'CHECKBOX':
            return (
                <div className="flex justify-center w-full h-full items-center">
                    {value ? (
                        <div className="flex items-center justify-center p-0.5 rounded bg-emerald-500 text-white">
                            <Check className="h-3 w-3" />
                        </div>
                    ) : (
                        <div
                            className="h-4 w-4 rounded border border-slate-300 bg-white cursor-pointer"
                            onClick={() => onCheckboxChange(true)}
                        />
                    )}
                    <Checkbox
                        checked={!!value}
                        onCheckedChange={onCheckboxChange}
                        className="hidden" // Keep logical checkbox for accessibility but use custom UI
                    />
                </div>
            )
        case 'CURRENCY':
            return (
                <div className="flex items-center w-full h-full px-2">
                    <span className="text-muted-foreground mr-1">$</span>
                    <input
                        className="w-full bg-transparent outline-none font-mono text-xs tabular-nums text-right"
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                    />
                </div>
            )
        case 'DATE':
            // Delivered Date is fully automated. Show text only, or empty if null.
            if (column.id === 'deliveredDate' || column.name.toLowerCase() === 'delivered date' || column.name.toLowerCase() === 'refill due') {
                return (
                    <div className="flex items-center w-full h-full px-2 text-xs text-slate-700">
                        {value ? (value as string) : ""}
                    </div>
                )
            }

            return (
                <div className="relative w-full h-full flex items-center group/date overflow-hidden">
                    <input
                        type="text"
                        placeholder="" // No dd/mm/yyyy placeholder
                        className="flex-1 min-w-0 bg-transparent outline-none text-xs text-slate-700 px-2 h-full"
                        value={value as string || ""}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                (e.target as HTMLInputElement).blur()
                            }
                        }}
                    />
                    <div className="relative flex items-center justify-center shrink-0 w-7 h-full mr-1">
                        <CalendarIcon className="h-3.5 w-3.5 text-slate-400 group-hover/date:text-amber-500 transition-colors pointer-events-none" />
                        <input
                            type="date"
                            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                            value={value && !isNaN(new Date(value as string).getTime()) ? new Date(value as string).toISOString().split('T')[0] : ""}
                            onChange={(e) => {
                                const newValue = e.target.value
                                setValue(newValue)
                                table.options.meta?.updateData(row.id, column.id, newValue)
                            }}
                        />
                    </div>
                </div>
            )
        case 'SELECT':
            // User requested to remove dropdown for tracking status and keep it auto-filled
            if (column.id === 'trackingStatus') {
                return (
                    <div className="flex items-center w-full h-full px-1 text-xs whitespace-nowrap overflow-hidden text-ellipsis">
                        {value as string}
                    </div>
                )
            }

            return (
                <select
                    className="w-full h-full bg-transparent outline-none text-xs border-none focus:ring-0 appearance-none pl-1"
                    value={(value as string) || ""}
                    onChange={onSelectChange}
                    style={{ colorScheme: "dark" }}
                >
                    <option value="" disabled className="hidden"></option>
                    {column.options?.map((opt: string) => (
                        <option key={opt} value={opt} className="bg-[#09090b] text-white">{opt}</option>
                    ))}
                </select>
            )
        case 'FILE': {
            const files = Array.isArray(value) ? value : []

            const removeFile = (index: number) => {
                const updatedFiles = [...files]
                updatedFiles.splice(index, 1)
                setValue(updatedFiles)
                table.options.meta?.updateData(row.id, column.id, updatedFiles)
            }

            return (
                <div className="flex items-center gap-1.5 w-full h-full px-2 overflow-x-auto no-scrollbar group/file-cell">
                    {files.map((f: any, i: number) => {
                        const isImage = /\.(jpg|jpeg|png|gif|svg|webp)$/i.test(f.name)

                        return (
                            <div key={i} className="relative group/thumb shrink-0">
                                <div className="h-6 w-6 rounded border bg-white flex items-center justify-center overflow-hidden shadow-sm">
                                    {isImage ? (
                                        <img src={f.path} alt={f.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <div className="text-slate-400">
                                            <FileText className="h-3.5 w-3.5" />
                                        </div>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        removeFile(i)
                                    }}
                                    className="absolute -top-1.5 -right-1.5 bg-background border rounded-full p-0.5 shadow-md opacity-0 group-hover/thumb:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground z-10"
                                >
                                    <X className="h-2 w-2" />
                                </button>
                            </div>
                        )
                    })}
                    <label className="cursor-pointer flex items-center justify-center p-1 hover:bg-muted rounded-md border border-dashed border-muted-foreground/30 min-w-7 h-7 transition-colors">
                        {isUploading ? (
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
                        ) : (
                            <Plus className="h-3.5 w-3.5 text-muted-foreground hover:text-amber-600 transition-colors" />
                        )}
                        <input type="file" multiple className="hidden" onChange={handleFileUpload} />
                    </label>
                </div>
            )
        }
        case 'LONG_TEXT':
            return (
                <div className="relative group/cell w-full h-full flex items-center overflow-hidden">
                    <input
                        className="w-full bg-transparent outline-none px-2 text-sm h-full truncate"
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        onDoubleClick={() => setIsDialogOpen(true)}
                    />
                    <button
                        onClick={(e) => {
                            e.stopPropagation()
                            setIsDialogOpen(true)
                        }}
                        className="absolute right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-background/80 backdrop-blur-sm border rounded hover:bg-muted transition-opacity z-10 shadow-sm"
                        title="Expand cell"
                    >
                        <Maximize2 className="h-3 w-3 text-amber-600" />
                    </button>
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        if (!open) onBlur()
                        setIsDialogOpen(open)
                    }}>
                        <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader className="border-b pb-2">
                                <DialogTitle className="flex items-center gap-2 text-amber-700">
                                    <FileText className="h-4 w-4" /> {column.name}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="pt-4">
                                <Textarea
                                    className="min-h-[300px] text-sm leading-relaxed focus-visible:ring-amber-500"
                                    value={value as string}
                                    onChange={(e) => setValue(e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={`Enter ${column.name}...`}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )
        default:
            return (
                <div className="relative group/cell w-full h-full flex items-center overflow-hidden">
                    <input
                        className={cn(
                            "flex-1 w-0 bg-transparent outline-none px-2 text-sm h-full",
                            isPatientNameColumn && "font-medium text-amber-700"
                        )}
                        value={value as string}
                        onChange={(e) => setValue(e.target.value)}
                        onBlur={onBlur}
                        onDoubleClick={() => setIsDialogOpen(true)}
                    />
                    {isPatientNameColumn && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                table.options.meta?.openProfile(row.original)
                            }}
                            className="mr-1 p-1 bg-amber-100/50 text-amber-600 rounded border border-amber-200 hover:bg-amber-100 hover:text-amber-700 transition-all shadow-sm shrink-0"
                            title="Open Patient Profile"
                        >
                            <Maximize2 className="h-3 w-3" />
                        </button>
                    )}
                    {typeof value === 'string' && value.length > 20 && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation()
                                setIsDialogOpen(true)
                            }}
                            className="absolute right-1 opacity-0 group-hover/cell:opacity-100 p-1 bg-background/80 backdrop-blur-sm border rounded hover:bg-muted transition-opacity z-10 shadow-sm"
                            title="Expand cell"
                        >
                            <Maximize2 className="h-3 w-3 text-amber-600" />
                        </button>
                    )}
                    <Dialog open={isDialogOpen} onOpenChange={(open) => {
                        if (!open) onBlur()
                        setIsDialogOpen(open)
                    }}>
                        <DialogContent className="max-w-2xl bg-white">
                            <DialogHeader className="border-b pb-2">
                                <DialogTitle className="flex items-center gap-2 text-amber-700">
                                    <Type className="h-4 w-4" /> {column.name}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="pt-4">
                                <Textarea
                                    className="min-h-[300px] text-sm leading-relaxed focus-visible:ring-amber-500"
                                    value={value as string}
                                    onChange={(e) => setValue(e.target.value)}
                                    onBlur={onBlur}
                                    placeholder={`Enter ${column.name}...`}
                                />
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            )
    }
}

const ColumnHeader = ({
    column,
    sheetId,
    getColumnIcon
}: {
    column: GridColumn,
    sheetId: string,
    getColumnIcon: (type: string) => React.ReactNode
}) => {
    const [name, setName] = React.useState(column.name)
    const [isEditing, setIsEditing] = React.useState(false)

    // Sync with external name changes
    React.useEffect(() => {
        setName(column.name)
    }, [column.name])

    const handleBlur = async () => {
        setIsEditing(false)
        if (name.trim() && name !== column.name) {
            await renameColumn(column.id, name, sheetId)
        } else {
            setName(column.name)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            (e.target as HTMLInputElement).blur()
        }
    }

    return (
        <div className="flex items-center gap-2 overflow-hidden w-full group/header">
            <span className="text-slate-400 shrink-0">{getColumnIcon(column.type)}</span>
            {isEditing ? (
                <input
                    autoFocus
                    className="bg-white text-[11px] font-semibold text-slate-800 outline-none w-full px-1 rounded-sm border border-slate-300 shadow-sm"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <span
                    className="text-[11px] font-semibold text-slate-600 truncate tracking-tight cursor-text hover:bg-black/5 px-1 rounded-sm w-full transition-colors"
                    onClick={(e) => {
                        e.stopPropagation()
                        setIsEditing(true)
                    }}
                >
                    {name}
                </span>
            )}
        </div>
    )
}

interface DataTableProps {
    columns: GridColumn[]
    data: GridRow[]
    sheetId: string
    isSelectionMode: boolean
    selectedRowIds: string[]
    setSelectedRowIds: React.Dispatch<React.SetStateAction<string[]>>
    globalFilter: string
    setGlobalFilter: (val: string) => void
    sorting: SortingState
    setSorting: (val: any) => void
    columnVisibility: VisibilityState
    setColumnVisibility: (val: any) => void
    grouping: GroupingState
    setGrouping: (val: any) => void
}

export function DataTable({
    columns: initialColumns,
    data: initialData,
    sheetId,
    isSelectionMode,
    selectedRowIds,
    setSelectedRowIds,
    globalFilter,
    setGlobalFilter,
    sorting,
    setSorting,
    columnVisibility,
    setColumnVisibility,
    grouping,
    setGrouping
}: DataTableProps) {
    const [data, setData] = React.useState(initialData)
    const [expanded, setExpanded] = React.useState<ExpandedState>(true) // True means all expanded by default
    const [draggedRowId, setDraggedRowId] = React.useState<string | null>(null)
    const [dropTargetGroupId, setDropTargetGroupId] = React.useState<string | null>(null)

    // Help format grouping values (especially dates)
    const formatGroupingValue = (value: any, columnId: string) => {
        if (value === null || value === undefined || value === "" || value === "undefined") return "Empty"

        const column = initialColumns.find(c => c.id === columnId)
        if (column?.type === 'DATE') {
            try {
                const date = new Date(value)
                if (!isNaN(date.getTime())) {
                    return date.toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                    })
                }
            } catch (e) {
                return String(value)
            }
        }
        return String(value)
    }

    // Ref to track processing rows to avoid double submissions if needed
    // but state update is simple enough

    React.useEffect(() => {
        const MIN_ROWS = 50
        const currentData = [...initialData]
        const check = currentData.length

        if (check < MIN_ROWS) {
            const extraRows = Array.from({ length: MIN_ROWS - check }).map((_, i) => ({
                id: `ghost-${i}`,
            }))
            setData([...currentData, ...extraRows])
        } else {
            setData(currentData)
        }
    }, [initialData])

    const getColumnIcon = (type: string) => {
        switch (type) {
            case 'TEXT': return <Type className="h-3 w-3" />
            case 'NUMBER': return <Hash className="h-3 w-3" />
            case 'CURRENCY': return <span className="text-[10px] font-bold">$</span>
            case 'DATE': return <CalendarIcon className="h-3 w-3" />
            case 'CHECKBOX': return <CheckSquare className="h-3 w-3" />
            case 'SELECT': return <ChevronDown className="h-3 w-3" />
            case 'FILE': return <Paperclip className="h-3 w-3" />
            case 'LONG_TEXT': return <FileText className="h-3 w-3" />
            case 'USER': return <User className="h-3 w-3" />
            case 'AUTO_NUMBER': return <AutoNumberIcon className="h-3 w-3" />
            default: return null
        }
    }

    // Convert GridColumn to TanStack ColumnDef with Selection Column if needed
    const tableColumns = React.useMemo<ColumnDef<GridRow>[]>(() => {
        const cols: ColumnDef<GridRow>[] = []

        // Add selection column only in selection mode
        if (isSelectionMode) {
            cols.push({
                id: "selection",
                header: ({ table }) => (
                    <div className="flex items-center justify-center w-full h-full">
                        <Checkbox
                            checked={table.getIsAllPageRowsSelected()}
                            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                            aria-label="Select all"
                            className="bg-white border-amber-500 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                        />
                    </div>
                ),
                cell: ({ row }) => {
                    const isGhost = row.original.id.startsWith("ghost-")
                    if (isGhost) return null

                    return (
                        <div className="flex items-center justify-center w-full h-full">
                            <Checkbox
                                checked={row.getIsSelected()}
                                onCheckedChange={(value) => row.toggleSelected(!!value)}
                                aria-label="Select row"
                                className="border-amber-400 data-[state=checked]:bg-amber-600 data-[state=checked]:border-amber-600"
                            />
                        </div>
                    )
                },
                size: 40,
                enableSorting: false,
                enableHiding: false,
            })
        }

        const dataCols = initialColumns.map((col) => ({
            accessorKey: col.id,
            header: ({ column }: { column: any }) => <ColumnHeader column={col} sheetId={sheetId} getColumnIcon={getColumnIcon} />,
            cell: ({ getValue, row, table }: { getValue: any, row: any, table: any }) => <EditableCell getValue={getValue} row={row} column={col} table={table} />,
            size: col.width || 150,
        }))

        return [...cols, ...dataCols]
    }, [initialColumns, isSelectionMode, sheetId])

    const [aiAnalysisResult, setAiAnalysisResult] = React.useState<string | null>(null)

    const updateData = (rowId: string, columnId: string, value: unknown) => {
        if (isSelectionMode) return // Prevent editing in selection mode

        setData((old) => {
            const rowIndex = old.findIndex(r => r.id === rowId)
            if (rowIndex === -1) return old

            const currentRow = old[rowIndex]
            if (!currentRow) return old

            // Optimistically update local state first
            const newData = old.map((row) => {
                if (row.id === rowId) {
                    return {
                        ...row,
                        [columnId]: value,
                    }
                }
                return row
            })

            // Trigger server update
            if (rowId && !rowId.startsWith('ghost-')) {
                updateRowData(rowId, { [columnId]: value }, sheetId).then(res => {
                    if (res.success && res.row) {
                        setData(prev => prev.map((r) => {
                            if (r.id === rowId) {
                                return {
                                    ...r,
                                    id: res.row.id,
                                    ...(res.row.data as object)
                                }
                            }
                            return r
                        }))

                        if ((res as any).aiAnalysis) {
                            setAiAnalysisResult((res as any).aiAnalysis)
                        }
                    } else if (!res.success) {
                        if ((res as any).isAiError) {
                            alert(`File Analysis Error: ${res.error}`);
                        } else {
                            console.error("Failed to save row", res.error)
                        }
                    }
                })
            }

            return newData
        })
    }

    const [selectedProfileRow, setSelectedProfileRow] = React.useState<GridRow | null>(null)
    const [isProfileOpen, setIsProfileOpen] = React.useState(false)

    const openProfile = (row: GridRow) => {
        setSelectedProfileRow(row)
        setIsProfileOpen(true)
    }

    const [rowSelection, setRowSelection] = React.useState({})

    // Sync TanStack row selection with our selectedRowIds
    React.useEffect(() => {
        const ids = Object.keys(rowSelection)
            .filter(id => id && !id.startsWith("ghost-"))
        setSelectedRowIds(ids)
    }, [rowSelection, setSelectedRowIds])

    // Reset selection when exiting mode
    React.useEffect(() => {
        if (!isSelectionMode) {
            setRowSelection({})
        }
    }, [isSelectionMode])

    const table = useReactTable({
        data,
        columns: tableColumns,
        state: {
            sorting,
            rowSelection,
            globalFilter,
            columnVisibility,
            grouping,
            expanded,
        },
        enableRowSelection: isSelectionMode,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        onColumnVisibilityChange: setColumnVisibility,
        onGroupingChange: setGrouping,
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getGroupedRowModel: getGroupedRowModel(),
        autoResetExpanded: false,
        meta: {
            updateData,
            openProfile,
            deleteRows,
        },
        columnResizeMode: "onChange",
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getRowId: (row) => row.id,
    })

    const handleInsertRow = async (index: number) => {
        const res = await createRow(sheetId, {})
        if (res.success) {
            // Update local state to reflect the new row immediately
            const newData = [...data]
            newData.splice(index + 1, 0, res.row as any)
            setData(newData)
        }
    }

    // Virtualization
    const parentRef = React.useRef<HTMLDivElement>(null)

    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35, // Row height
        overscan: 5,
    })

    return (
        <div className="flex flex-col h-full border rounded-md bg-background overflow-hidden">
            <div
                ref={parentRef}
                className="flex-1 overflow-auto w-full relative"
            >
                {/* Header - Sticky inside scroll container */}
                <div
                    className="flex bg-[#f5f5f5] font-normal text-slate-600 sticky top-0 z-20 w-fit min-w-full border-b border-slate-200"
                    style={{
                        width: table.getTotalSize(),
                        minWidth: '100%'
                    }}
                >
                    {table.getHeaderGroups().map(headerGroup => (
                        <div key={headerGroup.id} className="flex w-full">
                            {headerGroup.headers.map((header, index) => (
                                <div
                                    key={header.id}
                                    className={cn(
                                        "relative flex items-center px-3 py-2 border-r border-slate-200 h-9 shrink-0 bg-[#f5f5f5] hover:bg-[#ececec] transition-colors group text-[11px] uppercase tracking-wider font-semibold",
                                        index === 0 && "sticky left-0 z-30 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r-2"
                                    )}
                                    style={{ width: header.getSize() }}
                                >
                                    {header.isPlaceholder
                                        ? null
                                        : flexRender(header.column.columnDef.header, header.getContext())}
                                    <div
                                        {...{
                                            onMouseDown: header.getResizeHandler(),
                                            onTouchStart: header.getResizeHandler(),
                                            className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''
                                                }`,
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    ))}
                </div>

                <div
                    style={{
                        height: `${rowVirtualizer.getTotalSize()}px`,
                        width: `${table.getTotalSize()}px`,
                        position: 'relative',
                    }}
                >
                    {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                        const row = rows[virtualRow.index]
                        if (!row) return null

                        const isGrouped = row.getIsGrouped()

                        if (isGrouped) {
                            const groupColumnId = row.groupingColumnId || (row as any).columnId
                            const groupValue = row.groupingValue || (row as any).value

                            return (
                                <div
                                    key={virtualRow.index}
                                    className={cn(
                                        "flex absolute left-0 border-b border-slate-200 bg-slate-50/95 items-center z-10 shadow-sm transition-all",
                                        dropTargetGroupId === groupValue && "ring-2 ring-amber-500 ring-inset bg-amber-50/50"
                                    )}
                                    style={{
                                        height: `${virtualRow.size}px`,
                                        top: `${virtualRow.start}px`,
                                        width: `${table.getTotalSize()}px`,
                                        minWidth: '100%'
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault()
                                        setDropTargetGroupId(String(groupValue))
                                    }}
                                    onDragLeave={() => setDropTargetGroupId(null)}
                                    onDrop={(e) => {
                                        e.preventDefault()
                                        if (draggedRowId) {
                                            updateData(draggedRowId, groupColumnId, groupValue)
                                        }
                                        setDraggedRowId(null)
                                        setDropTargetGroupId(null)
                                    }}
                                >
                                    <div className="sticky left-0 flex items-center h-full z-20">
                                        <button
                                            onClick={() => row.toggleExpanded()}
                                            className="flex items-center gap-2 px-4 py-1.5 hover:bg-slate-200/50 transition-colors h-full text-xs font-bold text-slate-700 no-underline outline-none"
                                        >
                                            <div className="flex items-center gap-2">
                                                {row.getIsExpanded() ? (
                                                    <ChevronDown className="h-4 w-4 text-amber-600" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4 text-slate-400" />
                                                )}
                                                <span className="uppercase text-[9px] text-slate-400 font-black tracking-widest mr-1">
                                                    {initialColumns.find(c => c.id === groupColumnId)?.name || 'Group'}
                                                </span>
                                                <span className="text-[12px] font-semibold text-slate-800">
                                                    {formatGroupingValue(groupValue, groupColumnId)}
                                                </span>
                                                <span className="bg-slate-200/60 text-slate-600 px-2 py-0.5 rounded-full text-[10px] ml-2 font-medium">
                                                    {row.subRows.length}
                                                </span>
                                            </div>
                                        </button>
                                    </div>
                                    {/* Line spanning the rest of the group header */}
                                    <div className="flex-1 h-px bg-slate-200/50 ml-4 mr-8" />
                                </div>
                            )
                        }

                        return (
                            <div
                                key={virtualRow.index}
                                className={cn(
                                    "flex absolute left-0 border-b border-slate-100 hover:bg-slate-50/80 transition-colors bg-background items-center group",
                                    virtualRow.index % 2 === 0 ? "bg-background" : "bg-slate-50/30"
                                )}
                                style={{
                                    height: `${virtualRow.size}px`,
                                    top: `${virtualRow.start}px`,
                                    width: `${table.getTotalSize()}px`,
                                }}
                            >
                                {row.getVisibleCells().map((cell, index) => {
                                    const isFirstColumn = index === 0

                                    // If row is grouped, cells might be empty except the grouped one, 
                                    // but usually we want to show the data in rows UNDER the group.

                                    return (
                                        <div
                                            key={cell.id}
                                            className={cn(
                                                "px-0 py-0 border-r border-slate-100 h-full flex items-center outline-none cursor-text shrink-0 select-text",
                                                isFirstColumn ? "sticky left-0 z-10 bg-white shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-r-2" : "bg-inherit"
                                            )}
                                            style={{ width: cell.column.getSize() }}
                                            tabIndex={0}
                                        >
                                            {isFirstColumn && (
                                                <div
                                                    draggable
                                                    onDragStart={() => setDraggedRowId(row.id)}
                                                    onDragEnd={() => setDraggedRowId(null)}
                                                    className="absolute left-0 cursor-grab active:cursor-grabbing p-1 opacity-0 group-hover:opacity-100 transition-opacity z-50 hover:text-amber-600"
                                                    title="Drag to change group"
                                                >
                                                    <GripVertical className="h-3 w-3" />
                                                </div>
                                            )}
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </div>
                                    )
                                })}
                            </div>
                        )
                    })}
                    {/* Add row at the bottom */}
                    <div
                        className="flex absolute left-0 w-full border-b border-slate-100 bg-background items-center group cursor-pointer hover:bg-slate-50 transition-colors"
                        style={{
                            height: `35px`,
                            width: `${table.getTotalSize()}px`,
                            top: `${rowVirtualizer.getTotalSize()}px`,
                        }}
                        onClick={() => handleInsertRow(rows.length - 1)}
                    >
                        <div className="flex items-center justify-center p-2 text-slate-400 group-hover:text-blue-600 transition-colors">
                            <Plus className="h-4 w-4" />
                        </div>
                    </div>
                </div>
            </div>
            {/* AI Analysis Popup */}
            {aiAnalysisResult && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-background border rounded-xl shadow-2xl w-full max-w-3xl max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in slide-in-from-bottom-4 duration-300 ring-1 ring-border">
                        <div className={cn(
                            "flex items-center justify-between p-5 border-b",
                            aiAnalysisResult.includes("PASS") ? "bg-green-500/10 border-green-500/20" :
                                aiAnalysisResult.includes("FAIL") ? "bg-red-500/10 border-red-500/20" : "bg-blue-500/10 border-blue-500/20"
                        )}>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-50 rounded-xl">
                                    <CheckSquare className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold">AI Compliance Report</h3>
                                    <p className="text-xs text-muted-foreground">Automation complete - Data extracted and mapped</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setAiAnalysisResult(null)}
                                className="p-2 hover:bg-muted rounded-full transition-colors text-muted-foreground hover:text-foreground"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="flex-1 overflow-auto p-8 prose prose-sm max-w-none dark:prose-invert">
                            <div className="whitespace-pre-wrap font-sans text-[15px] leading-relaxed text-foreground/90">
                                {aiAnalysisResult.split('\n').map((line, i) => {
                                    if (line.startsWith('✅') || line.startsWith('👉 PASS')) {
                                        return <div key={i} className="text-green-600 dark:text-green-400 font-bold text-lg mb-4">{line}</div>
                                    }
                                    if (line.startsWith('❌') || line.startsWith('👉 FAIL')) {
                                        return <div key={i} className="text-red-600 dark:text-red-400 font-bold text-lg mb-4">{line}</div>
                                    }
                                    if (line.startsWith('🔍') || line.startsWith('📍') || line.startsWith('✍️')) {
                                        return <div key={i} className="font-semibold text-blue-600 mt-6 mb-2 flex items-center gap-2">{line}</div>
                                    }
                                    return <div key={i} className="mb-1">{line}</div>
                                })}
                            </div>
                        </div>
                        <div className="p-5 border-t bg-muted/5 flex justify-between items-center">
                            <div className="text-xs text-muted-foreground italic">
                                * All data has been automatically filled in the grid.
                            </div>
                            <button
                                onClick={() => setAiAnalysisResult(null)}
                                className="px-8 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:ring-2 ring-blue-500/20 transition-all shadow-lg active:scale-95"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Patient Profile Dialog - Optimized & Sexy Design */}
            <Dialog open={isProfileOpen} onOpenChange={setIsProfileOpen}>
                <DialogContent className="sm:max-w-none max-w-[1850px] w-[98vw] h-[98vh] p-0 overflow-hidden bg-white border-none shadow-2xl flex flex-col rounded-xl">
                    {selectedProfileRow && (
                        <div className="flex h-full flex-row overflow-hidden">
                            {/* Main Content Area */}
                            <div className="flex-[3] flex flex-col bg-white overflow-hidden border-r border-slate-100 min-w-[800px]">
                                {/* Header Navigation bar (Standard Airtable look) */}
                                <div className="h-12 border-b flex items-center justify-between px-4 text-slate-500 bg-white shrink-0">
                                    <div className="flex items-center gap-2">
                                        <Users className="h-3.5 w-3.5" />
                                        <span className="text-[11px] font-bold uppercase tracking-wider">Patients</span>
                                        <ChevronRight className="h-3.5 w-3.5 opacity-40" />
                                        <span className="text-[11px] font-bold text-slate-900 truncate uppercase tracking-tight">
                                            {initialColumns.find(c => c.name.toLowerCase() === 'patient name')
                                                ? selectedProfileRow[initialColumns.find(c => c.name.toLowerCase() === 'patient name')!.id]
                                                : "Patient Record"}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <Share2 className="h-3.5 w-3.5 hover:text-slate-800 transition-colors cursor-pointer" />
                                        <Paperclip className="h-3.5 w-3.5 hover:text-slate-800 transition-colors cursor-pointer" />
                                        <MoreHorizontal className="h-3.5 w-3.5 hover:text-slate-800 transition-colors cursor-pointer" />
                                        <X className="h-4.5 w-4.5 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setIsProfileOpen(false)} />
                                    </div>
                                </div>

                                {/* Primary Field (Patient Name large box) */}
                                <div className="p-14 pt-10 pb-8 shrink-0">
                                    <div className="flex items-center gap-2.5 text-[12px] font-black text-slate-400 uppercase tracking-widest mb-3 pl-1">
                                        <Type className="h-4 w-4" />
                                        Patient Name
                                    </div>
                                    <div className="w-full border-2 border-blue-500 rounded-xl p-6 text-4xl font-bold text-slate-900 bg-white group hover:border-blue-600 transition-all cursor-text relative shadow-sm">
                                        {initialColumns.find(c => c.name.toLowerCase() === 'patient name')
                                            ? selectedProfileRow[initialColumns.find(c => c.name.toLowerCase() === 'patient name')!.id]
                                            : "Patient Record"}
                                        <span className="absolute right-6 top-1/2 -translate-y-1/2 opacity-10 text-slate-900 text-2xl font-mono">@</span>
                                    </div>
                                </div>

                                {/* Form Fields List (Vertical with icons) */}
                                <div className="flex-1 overflow-y-auto p-14 pt-2 space-y-12 custom-scrollbar">
                                    <div className="space-y-10 w-full max-w-6xl">
                                        {initialColumns.filter(col => col.name.toLowerCase() !== 'patient name').map((col) => {
                                            const value = selectedProfileRow[col.id];
                                            const isEmpty = value === null || value === undefined || value === '';

                                            return (
                                                <div key={col.id} className="grid grid-cols-[280px_1fr] gap-12 items-center group">
                                                    <div className="flex items-center gap-4 py-1 text-slate-500 select-none">
                                                        <span className="p-2 rounded-lg bg-slate-50 group-hover:bg-slate-100 transition-colors shadow-sm">
                                                            {getColumnIcon(col.type)}
                                                        </span>
                                                        <span className="text-[14px] font-bold text-slate-600 truncate group-hover:text-slate-900 transition-colors">{col.name}</span>
                                                    </div>
                                                    <div className="min-h-[48px] flex items-center px-5 py-2.5 border-2 border-transparent hover:border-slate-100 rounded-xl bg-white transition-all text-slate-800 text-[15px] relative">
                                                        {col.type === 'CHECKBOX' ? (
                                                            <div className={cn(
                                                                "h-[18px] w-[18px] rounded border border-slate-300 flex items-center justify-center transition-all",
                                                                value ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white"
                                                            )}>
                                                                {value && <Check className="h-3 w-3 stroke-[3px]" />}
                                                            </div>
                                                        ) : col.type === 'FILE' ? (
                                                            <div className="w-full">
                                                                <button className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded text-[11px] font-bold text-slate-600 transition-colors mb-2">
                                                                    <Paperclip className="h-3 w-3" />
                                                                    Attach file
                                                                </button>
                                                                <div className="flex flex-wrap gap-3 mt-1">
                                                                    {Array.isArray(value) && value.length > 0 ? value.map((f: any, i: number) => (
                                                                        <div key={i} className="flex flex-col gap-1">
                                                                            <div className="h-24 w-36 bg-slate-50 border border-slate-200 rounded-lg overflow-hidden flex items-center justify-center text-slate-300 hover:border-blue-400 transition-colors cursor-pointer group/thumb shadow-sm">
                                                                                <FileText className="h-10 w-10 opacity-10 group-hover/thumb:opacity-20 transition-opacity" />
                                                                            </div>
                                                                            <span className="text-[10px] text-slate-400 truncate w-36 pl-1">{f.name}</span>
                                                                        </div>
                                                                    )) : null}
                                                                </div>
                                                            </div>
                                                        ) : col.type === 'DATE' ? (
                                                            <div className="flex items-center justify-between w-full border border-slate-200 rounded px-2.5 py-1 text-[12px]">
                                                                <span>{value ? String(value) : "mm/dd/yyyy"}</span>
                                                                <ChevronDown className="h-3.5 w-3.5 opacity-30" />
                                                            </div>
                                                        ) : (
                                                            <div className={cn(
                                                                "w-full px-2 py-1 rounded border border-transparent hover:border-slate-200 transition-colors",
                                                                isEmpty ? "text-slate-300 italic" : "text-slate-800"
                                                            )}>
                                                                {isEmpty ? "Empty" : String(value)}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>

                            {/* Comments Sidebar (Right Side) */}
                            <div className="w-full md:w-[350px] h-full bg-[#fdfdfd] flex flex-col hidden lg:flex shrink-0">
                                <div className="h-12 border-b flex items-center justify-between px-4 text-slate-400 bg-white">
                                    <div className="flex items-center gap-2">
                                        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">All comments</span>
                                        <ChevronDown className="h-3.5 w-3.5 opacity-60" />
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Settings2 className="h-3.5 w-3.5" />
                                        <Paperclip className="h-3.5 w-3.5" />
                                    </div>
                                </div>
                                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 bg-white">
                                    <MessageSquare className="h-14 w-14 mb-5 opacity-10" />
                                    <p className="text-sm font-semibold text-slate-800 mb-2">Start a conversation</p>
                                    <p className="text-[12px] text-slate-400 leading-relaxed px-4">
                                        Ask questions, keep track of status updates, or collaborate with your team — directly in Airtable.
                                    </p>
                                    <p className="mt-6 text-[11px] font-bold text-blue-500 cursor-pointer hover:underline bg-blue-50 px-3 py-1.5 rounded-full">@mention collaborators</p>
                                </div>
                                <div className="p-4 border-t sticky bottom-0 bg-white w-full">
                                    <div className="flex items-center gap-3 border border-slate-200 rounded-lg p-2 hover:border-slate-300 transition-colors">
                                        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-[11px] font-bold shrink-0">M</div>
                                        <span className="text-[12px] text-slate-400">Leave a comment...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    )
}

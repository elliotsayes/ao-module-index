import { useInfiniteQuery } from "@tanstack/react-query";
import { modulueGqlQuery as moduleGqlQuery } from "./lib/query";
import { useMemo } from "react";
import { ModuleData, parseModuleTransaction } from "./lib/parse";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
 

const columnHelper = createColumnHelper<ModuleData>()

const columns = [
  columnHelper.accessor("txId", {
    header: "TxId",
  }),
  columnHelper.accessor("ownerId", {
    header: "Owner",
  }),
  columnHelper.accessor("size", {
    header: "Size",
  }),
  columnHelper.accessor("timestamp", {
    header: "Timestamp",
  }),
  columnHelper.accessor("blockId", {
    header: "Block",
  }),
  columnHelper.accessor("bundleId", {
    header: "Bundle",
  }),
  columnHelper.accessor("contentType", {
    header: "Content Type",
  }),
  columnHelper.accessor("dataProtocol", {
    header: "Data Protocol",
  }),
  columnHelper.accessor("type", {
    header: "Type",
  }),
  columnHelper.accessor("variant", {
    header: "Variant",
  }),
  columnHelper.accessor("moduleFormat", {
    header: "Format",
  }),
  columnHelper.accessor("inputEncoding", {
    header: "Input Encoding",
  }),
  columnHelper.accessor("outputEncoding", {
    header: "Output Encoding",
  }),
  columnHelper.accessor("memoryLimit", {
    header: "Memory Limit",
  }),
  columnHelper.accessor("computeLimit", {
    header: "Compute Limit",
  }),
  columnHelper.accessor("extensions", {
    header: "Extensions",
    cell: (cell) => {
      const extensions = cell.row.original.extensions;
      if (extensions.length === 0) {
        return "<none>";
      }
      return <p>{extensions.join(', ')}</p>
    },
  }),
]

function ModuleTable() {
  const {
    data: gqlData,
    isError,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery(moduleGqlQuery(50));

  const tableData = useMemo(() => {
    if (gqlData === undefined) {
      return []
    }
    return gqlData.pages.map((page) => 
      page.transactions.edges.map((item) => {
        try {
          return parseModuleTransaction(item.node)
        } catch (e) {
          return null;
        }
      }).filter(Boolean) as ModuleData[]
    ).flat()
  }, [gqlData])

  const table = useReactTable({
    columns,
    data: tableData,
    getCoreRowModel: getCoreRowModel(),
  })

  if (isError) {
    return <div>Error</div>
  }

  if (isLoading) {
    return <div>Loading</div>
  }
 
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {
        hasNextPage ? (
          <Button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
          >
            More
          </Button>
        ) : (
          <p>No more results</p>
        )
      }
    </div>
  )
}

export default ModuleTable

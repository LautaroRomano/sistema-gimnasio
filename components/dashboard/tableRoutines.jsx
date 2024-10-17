import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Image,
} from "@nextui-org/react";
import { CiEdit as EditIcon } from "react-icons/ci";

export default function TableRoutines({ data, setEdit }) {
  const renderCell = React.useCallback((exercise, columnKey) => {
    const cellValue = exercise[columnKey];

    switch (columnKey) {
      case "gif":
        return <Image src={cellValue} isZoomed className={"max-h-32"}/>;
      case "name":
        return (
          <div className="flex flex-col">
            <p className="text-bold text-sm capitalize">{cellValue}</p>
          </div>
        );
      case "terminado":
        return (
          <Chip
            className="capitalize w-1/2"
            color={cellValue ? "success" : "warning"}
            size="sm"
            variant="flat"
          >
            {cellValue ? "SI" : "NO"}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Editar">
              <button 
              className="text-xl text-white cursor-pointer active:opacity-50"
              onClick={cellValue.edit}
              >
                <EditIcon />
              </button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  return (
    <Table aria-label="Example table with custom cells">
      <TableHeader
        columns={Object.keys(data[0]).map((val) => ({
          name: val.toUpperCase(),
          uid: val,
        }))}
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
            width={64}
          >
            <p className="flex md:hidden">{".................................."}</p>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item, i) => {
          return (
            <TableRow key={item.id} className="max-h-32">
              {(columnKey) => (
                <TableCell align="center" className={"max-h-32"} >
                  {renderCell(item, columnKey)}
                </TableCell>
              )}
            </TableRow>
          );
        }}
      </TableBody>
    </Table>
  );
}

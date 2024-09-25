import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User,
  Chip,
  Tooltip,
  getKeyValue,
  Image,
} from "@nextui-org/react";
import { CiEdit as EditIcon } from "react-icons/ci";
import { MdOutlineDelete as DeleteIcon } from "react-icons/md";
import { FaRegEye as EyeIcon } from "react-icons/fa";

const statusColorMap = {
  active: "success",
  paused: "danger",
  vacation: "warning",
};

export default function TableRoutines({ data = [] }) {
  const renderCell = React.useCallback((exercise, columnKey) => {
    const cellValue = exercise[columnKey];

    switch (columnKey) {
      case "gif":
        return (
          <Image src={cellValue} isZoomed/>
        );
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
            color={cellValue?'success':'warning'}
            size="sm"
            variant="flat"
          >
            {cellValue?'SI':'NO'}
          </Chip>
        );
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EyeIcon />
              </span>
            </Tooltip>
            <Tooltip content="Edit exercise">
              <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                <EditIcon />
              </span>
            </Tooltip>
            <Tooltip color="danger" content="Delete exercise">
              <span className="text-lg text-danger cursor-pointer active:opacity-50">
                <DeleteIcon />
              </span>
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
        columns={Object.keys(data[0]).map(val=>({ name: val.toUpperCase(), uid: val }))}
      >
        {(column) => (
          <TableColumn
            key={column.uid}
            align={column.uid === "actions" ? "center" : "start"}
          >
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody items={data}>
        {(item,i) => {
        return (
          <TableRow key={item.id}>
            {(columnKey) => (
              <TableCell align="center" className={'max-h-32'}>{renderCell(item, columnKey)}</TableCell>
            )}
          </TableRow>
        )}}
      </TableBody>
    </Table>
  );
}


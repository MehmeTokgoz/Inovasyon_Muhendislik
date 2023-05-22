// eslint-disable-next-line no-unused-vars
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import "./courseTable.scss";
import PropTypes from "prop-types";
import { alpha } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";
import { visuallyHidden } from "@mui/utils";
// eslint-disable-next-line no-unused-vars
import { Button } from "@mui/material";
import { toast } from "react-hot-toast";

function CourseTable() {
  // eslint-disable-next-line no-unused-vars
  const [isLoading, setIsLoading] = useState(false);
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("date");
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [dense, setDense] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // eslint-disable-next-line no-unused-vars
  const [courseList, setCourseList] = useState([]);
  const [selectedCourses, setSelectedCourses] = useState(
    JSON.parse(localStorage.getItem("myCourseList")) || []
  );

  // Request to get all posts from database.
  const getAllCourses = async () => {
    await axios.get("http://localhost:3540/api/courses/").then(({ data }) => {
      if (data) {
        setCourseList(data);
      }
    });
  };

  const getCourseById = async (_id) => {
    await axios
      .get(`http://localhost:3540/api/courses/get-a-course/${_id}`)
      .then(({ data }) => {
        if (!selectedCourses) {
          setSelectedCourses({
            courseId: data.courseId,
            courseName: data.courseName,
            instructor: data.instructor,
          });
        }
        console.log(selectedCourses);
      });

    if (selectedCourses) {
      const courseToAdd = {
        courseId: selectedCourses.courseId,
        courseName: selectedCourses.courseName,
        instructor: selectedCourses.instructor,
      };
    }

    toast.success("Course Added");
  };

  // Call the getAllCourses and getCourseById function on the page render.
  useEffect(() => {
    getAllCourses();
    getCourseById();
  }, []);

  const visibleRows = useMemo(
    () =>
      stableSort(courseList, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      ),
    [order, orderBy, page, rowsPerPage]
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) {
        return order;
      }
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  const headCells = [
    {
      id: "name",
      numeric: false,
      disablePadding: true,
      label: "Course Name",
    },
    {
      id: "courseId",
      numeric: true,
      disablePadding: false,
      label: "Course ID",
    },

    {
      id: "instructor",
      numeric: true,
      disablePadding: false,
      label: "Instructor",
    },
  ];

  function EnhancedTableHead(props) {
    const {
      onSelectAllClick,
      order,
      orderBy,
      numSelected,
      rowCount,
      onRequestSort,
    } = props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead className="courses-content-table-head">
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              className="courses-content-table-head-cell"
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all desserts",
              }}
            />
          </TableCell>
          {headCells.map((headCell) => (
            <TableCell
              className="courses-content-table-head-cell"
              key={headCell.id}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
                  </Box>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(["asc", "desc"]).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  function EnhancedTableToolbar(props) {
    const { numSelected } = props;
    return (
      <Toolbar
        sx={{
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
          ...(numSelected > 0 && {
            bgcolor: (theme) =>
              alpha(
                theme.palette.primary.main,
                theme.palette.action.activatedOpacity
              ),
          }),
        }}
      >
        {numSelected > 0 ? (
          <Typography
            sx={{ flex: "1 1 100%" }}
            color="inherit"
            variant="subtitle1"
            component="div"
          >
            {numSelected} Selected
          </Typography>
        ) : (
          <Typography
            sx={{ flex: "1 1 100%" }}
            variant="h6"
            id="tableTitle"
            component="div"
          >
            ALL COURSES
          </Typography>
        )}

        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : (
          <Tooltip title="Filter list">
            <IconButton>
              <FilterListIcon />
            </IconButton>
          </Tooltip>
        )}
      </Toolbar>
    );
  }

  EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = courseList.map((n) => n.courseName);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, courseName) => {
    const selectedIndex = selected.indexOf(courseName);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, courseName);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (courseName) => selected.indexOf(courseName) !== -1;

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - courseList.length) : 0;

  // const handleAddMyCourses = (courseName) => {
  //   if (isSelected(courseName)) {
  //     return;
  //   }
  //   setSelected((prev) => [...prev, courseName]);
  // };
  // console.log(selected);

  return (
    <Box className="main-table-container">
      <Paper className="main-table-paper">
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className="courses-content-table"
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "medium"}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={courseList.length}
            />
            <TableBody className="courses-content-table-body">
              {visibleRows.map((row, index) => {
                const isItemSelected = isSelected(row.courseName);
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow
                    hover
                    onClick={(event) => handleClick(event, row.courseName)}
                    role="checkbox"
                    aria-checked={isItemSelected}
                    tabIndex={-1}
                    key={row.courseName}
                    selected={isItemSelected}
                    sx={{ cursor: "pointer" }}
                    className={`courses-content-table-row ${
                      isItemSelected ? "courses-content-table-row-selected" : ""
                    }`}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={isItemSelected}
                        inputProps={{
                          "aria-labelledby": labelId,
                        }}
                        className="courses-content-table-body-cell"
                      />
                    </TableCell>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      className="courses-content-table-body-cell"
                    >
                      {row.courseName}
                    </TableCell>
                    <TableCell
                      align="right"
                      className="courses-content-table-body-cell"
                    >
                      {row.courseId}
                    </TableCell>
                    <TableCell
                      className="courses-content-table-body-cell"
                      align="right"
                    >
                      {row.instructor}
                    </TableCell>
                    <TableCell
                      className="courses-content-table-body-cell"
                      align="right"
                    >
                      <Button
                        variant="outlined"
                        onClick={() => getCourseById(row._id)}
                        id="button-show-info"
                      >
                        ADD TO MY COURSES
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50, 100]}
          labelRowsPerPage="Satır sayısı:"
          component="div"
          count={courseList.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Dense padding"
      />
    </Box>
  );
}

export default CourseTable;

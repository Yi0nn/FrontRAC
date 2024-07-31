import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Typography, Collapse, Button, Box } from '@mui/material';

const DynamicForm = () => {
  const [data, setData] = useState([]);
  const [openCollapsibles, setOpenCollapsibles] = useState({});

  useEffect(() => {
    axios.post('https://datos-rac.vercel.app/getData', { sheetName: 'Datos Generales RAC' })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const dataWithCampoID = response.data.data.map((row, index) => ({
            ...row,
            campoID: `campo-${index}`,
          }));
          setData(dataWithCampoID);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleToggleCollapsible = (id) => {
    setOpenCollapsibles((prevState) => {
      const newOpenCollapsibles = { ...prevState };
      Object.keys(newOpenCollapsibles).forEach((key) => {
        if (key !== id) {
          newOpenCollapsibles[key] = false;
        }
      });
      return { ...newOpenCollapsibles, [id]: !prevState[id] };
    });
  };

  const handleInputChange = (campoID, newValue) => {
    setData((prevData) =>
      prevData.map((row) =>
        row.campoID === campoID ? { ...row, valor: newValue } : row
      )
    );
  };

  const renderField = (row) => {
    console.log(row)
    if (row.tipo === 'Campo') {
      return (
        <TextField
          key={row.campoID}
          label={row.etiqueta}
          fullWidth
          margin="normal"
          value={row.valor || ''}
          onChange={(e) => handleInputChange(row.campoID, e.target.value)}
        />
      );
    } else if (row.tipo === 'Titulo1') {
      return <h2>{row.etiqueta}</h2>;
    }
    return null; // No renderiza nada si el tipo no es 'Campo' o 'Título1'
  };

  const renderCollapsible = (row, fields) => (
    <Box key={row.ID} marginBottom={2}>
      <Button
        variant="outlined"
        onClick={() => handleToggleCollapsible(row.ID)}
        sx={{
          backgroundColor: '#a30000',
          color: 'white',
          cursor: 'pointer',
          padding: '18px',
          width: '100%',
          textAlign: 'left',
          fontSize: '15px',
          marginBottom: '5px',
          '&:hover': {
            backgroundColor: '#6b0900',
          },
          '&.active': {
            backgroundColor: '#6b0900',
          },
        }}
      >
        {row.etiqueta}
      </Button>
      <Collapse in={openCollapsibles[row.ID]}>
        <Box marginTop={2}>{fields}</Box>
      </Collapse>
    </Box>
  );

  const groupFieldsByCollapsible = (rows) => {
    if (!Array.isArray(rows)) {
      console.error('Expected rows to be an array:', rows);
      return null;
    }
    const groupedFields = [];
    let currentCollapsible = null;
    let currentFields = [];
    rows.forEach((row) => {
      if (row.tipo === 'Colapsable1') {
        if (currentCollapsible) {
          groupedFields.push(renderCollapsible(currentCollapsible, currentFields));
        }
        currentCollapsible = row;
        currentFields = [];
      } else {
        currentFields.push(renderField(row));
      }
    });
    if (currentCollapsible) {
      groupedFields.push(renderCollapsible(currentCollapsible, currentFields));
    }
    return groupedFields;
  };

  return (
    <form>
      {groupFieldsByCollapsible(data)}
    </form>
  );
};

export default DynamicForm;
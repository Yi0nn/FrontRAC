import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TextField, Typography, Collapse, Button, Box, Paper, Grid } from '@mui/material';

const DynamicForm = () => {
  const [data, setData] = useState([]);
  const [openCollapsibles, setOpenCollapsibles] = useState({});

  useEffect(() => {
    axios.post('https://datos-rac.vercel.app/getData', { sheetName: 'Datos Generales RAC' })
      .then((response) => {
        if (Array.isArray(response.data.data)) {
          const dataWithCampoIDAndCollapsibleID = response.data.data.map((row, index) => ({
            ...row,
            campoID: `campo-${index}`,
            collapsibleID: `collapsible-${index}`,
            nuevoCampo: '',
          }));
          setData(dataWithCampoIDAndCollapsibleID);
        } else {
          console.error('Unexpected response data format:', response.data);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  const handleToggleCollapsible = (collapsibleID) => {
    setOpenCollapsibles((prevState) => {
      const newOpenCollapsibles = { ...prevState };
      newOpenCollapsibles[collapsibleID] = !prevState[collapsibleID];
      return newOpenCollapsibles;
    });
  };

  const handleInputChange = (collapsibleID, newValue) => {
    setData((prevData) => prevData.map((row) => row.collapsibleID === collapsibleID ? { ...row, nuevoCampo: newValue } : row));
  };

  const renderField = (row) => {
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
    } else if (row.tipo === 'Criterio') {
      return (
        <table style={{ borderCollapse: 'collapse', width: '100%' }}>
          <tbody>
            <tr style={{ backgroundColor: '#a30000', color: 'white' }}>
              <th className="criterio" style={{ border: '1px solid black', padding: '10px', width: '33.33%' }}>Criterio</th>
              <th style={{ border: '1px solid black', padding: '10px', width: '33.33%' }}>Grado de Cumplimiento</th>
              <th style={{ border: '1px solid black', padding: '10px', width: '33.33%' }}>Calificación</th>
            </tr>
            <tr>
              <td className="criterio" style={{ border: '1px solid black', padding: '10px', width: '33.33%' }}>{row.etiqueta}</td>
              <td style={{ border: '1px solid black', padding: '10px', width: '33.33%' }}>{row.valor}</td>
              <td style={{ border: '1px solid black', padding: '10px', width: '33.33%' }}>
                <textarea />
              </td>
            </tr>
          </tbody>
        </table>
      );
    }
    return null;
  };

  const renderCollapsible = (row, fields) => (
    <Box key={row.collapsibleID} marginBottom={2} flex={1}>
      <Button
        variant="contained"
        color="error"
        onClick={() => handleToggleCollapsible(row.collapsibleID)}
        sx={{
          padding: '18px',
          width: '100%',
          textAlign: 'left',
          fontSize: '15px',
          marginBottom: '5px',
          '&:hover': { backgroundColor: '#6b0900' },
        }}
      >
        {row.etiqueta}
      </Button>
      <Collapse in={openCollapsibles[row.collapsibleID]}>
        <Box marginTop={2} padding={2} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
          {fields}
          <Box textAlign="center" marginTop={2}>
            <Button variant="contained" color="error">Guardar información</Button>
          </Box>
        </Box>
      </Collapse>
    </Box>
  );

  const renderSubCollapsible = (row, fields) => (
    <Box key={row.collapsibleID} marginBottom={2}>
      <Button
        variant="contained"
        color="error"
        onClick={() => handleToggleCollapsible(row.collapsibleID)}
        sx={{
          padding: '18px',
          width: '100%',
          textAlign: 'left',
          fontSize: '15px',
          marginBottom: '5px',
          '&:hover': { backgroundColor: '#6b0900' },
        }}
      >
        {row.etiqueta}
      </Button>
      <Collapse in={openCollapsibles[row.collapsibleID]}>
        <Box marginTop={2} padding={2} sx={{ backgroundColor: '#f0f0f0', borderRadius: '10px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#a30000', color: 'white' }}>
                <th colSpan="2" style={{ padding: '10px', border: '1px solid black' }}>Evaluación de la</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ padding: '10px', border: '1px solid black' }}>Fortaleza del programa</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>
                  <textarea style={{ width: '100%' }} />
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px', border: '1px solid black' }}>Oportunidades de mejoramiento relacionadas con la condición</td>
                <td style={{ padding: '10px', border: '1px solid black' }}>
                  <textarea style={{ width: '100%' }} />
                </td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Collapse>
    </Box>
  );

  const renderLabelAndLink = (row) => (
    <Box key={row.collapsibleID} marginBottom={2}>
      <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
        {row.etiqueta}
      </Typography>
      <a href={row.valor} target="_blank" rel="noopener noreferrer" style={{ color: '#a30000' }}>
        Vinculo a la tabla
      </a>
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
    let currentSubCollapsible = null;
    let currentSubFields = [];
    rows.forEach((row) => {
      if (row.tipo === 'Colapsable1') {
        if (currentCollapsible) {
          if (currentSubCollapsible) {
            currentFields.push(renderSubCollapsible(currentSubCollapsible, currentSubFields));
            currentSubCollapsible = null;
            currentSubFields = [];
          }
          groupedFields.push(renderCollapsible(currentCollapsible, currentFields));
        }
        currentCollapsible = row;
        currentFields = [];
      } else if (row.tipo === 'Colapsable2') {
        if (currentSubCollapsible) {
          currentFields.push(renderSubCollapsible(currentSubCollapsible, currentSubFields));
        }
        currentSubCollapsible = row;
        currentSubFields = [];
      } else if (row.tipo === 'ConclusionCondicion') {
        if (currentSubCollapsible) {
          currentFields.push(renderSubCollapsible(currentSubCollapsible, currentSubFields));
          currentSubCollapsible = null;
          currentSubFields = [];
        }
        currentSubCollapsible = row;
        currentSubFields = [];
      } else if (row.tipo === 'TablaExtra') {
        currentFields.push(renderLabelAndLink(row));
      } else {
        if (currentSubCollapsible) {
          currentSubFields.push(renderField(row));
        } else {
          currentFields.push(renderField(row));
        }
      }
    });
    if (currentCollapsible) {
      if (currentSubCollapsible) {
        currentFields.push(renderSubCollapsible(currentSubCollapsible, currentSubFields));
      }
      groupedFields.push(renderCollapsible(currentCollapsible, currentFields));
    }
    return groupedFields;
  };

  const groupCollapsiblesInRows = (collapsibles) => {
    const rows = [];
    for (let i = 0; i < collapsibles.length; i += 4) {
      rows.push(
        <Grid key={i} container spacing={2} marginBottom={2}>
          {collapsibles.slice(i, i + 4).map((collapsible, index) => (
            <Grid item xs={3} key={index}>
              {collapsible}
            </Grid>
          ))}
        </Grid>
      );
    }
    return rows;
  };

  return (
    <Paper sx={{ padding: '20px', maxWidth: '1000px', margin: '20px auto' }}>
      <form>
        {groupCollapsiblesInRows(groupFieldsByCollapsible(data))}
      </form>
    </Paper>
  );
};

export default DynamicForm;

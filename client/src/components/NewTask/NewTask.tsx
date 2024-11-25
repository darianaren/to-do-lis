"use client";

import React, { useState } from "react";

import {
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Fab,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  TextField
} from "@mui/material";

import styles from "./styles.module.css";

import { NewTaskProps, Task } from "@/interfaces/ITask";

const NewTask: React.FC<NewTaskProps> = ({
  isLoading,
  newTaskForm,
  labelOptions,
  handleAddTask,
  handleAddLabel
}) => {
  const [labels, setLabels] = useState<string[]>([]);

  const { form, errors, resetForm, handleChange, blurValidator } = newTaskForm;

  const handleSelect = (event) => {
    const newLabels = event.target.value.filter((value) => value);

    if (newLabels.length !== labels.length) setLabels(event.target.value);
  };

  const addLabel = async () => {
    const response = await handleAddLabel(form.label);

    if (response) {
      handleChange({ target: { name: "label", value: "" } });

      setLabels((prevLabels) => {
        if (!prevLabels.length) {
          return [form.label];
        }

        if (prevLabels.includes(form.label)) {
          return prevLabels;
        }

        return [...prevLabels, form.label];
      });
    }
  };

  const handleSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const response = await handleAddTask({
      labels,
      title: form.title,
      status: form.status,
      dueDate: form.dueDate,
      description: form.description
    } as Task);

    if (response) {
      resetForm();
    }
  };

  return (
    <Box component="form" className={styles["new-task-container"]}>
      <h2>✨ Nueva Tarea</h2>
      <FormControl fullWidth>
        <InputLabel id="simple-select-status">Estado</InputLabel>
        <Select
          name="status"
          label="Estado"
          value={form.status}
          id="demo-simple-select"
          onChange={handleChange}
          labelId="simple-select-status"
          sx={{ maxHeight: "50vh" }}
        >
          <MenuItem value="pending">Pendiente</MenuItem>
          <MenuItem value="in-progress">En Progreso</MenuItem>
          <MenuItem value="completed">Completado</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth>
        <InputLabel id="multiple-select-labels">Etiquetas</InputLabel>
        <Select
          multiple
          value={labels}
          label="Etiquetas"
          onChange={handleSelect}
          labelId="multiple-select-labels"
          renderValue={(selected) => (selected as string[]).join(", ")}
        >
          <section className={styles["new-label-section"]}>
            <TextField
              type="text"
              name="label"
              id="due-date"
              variant="outlined"
              value={form.label}
              label="Nueva etiqueta"
              onChange={handleChange}
              sx={{
                flexGrow: 1
              }}
            />
            <Fab color="primary" aria-label="add" onClick={addLabel}>
              +
            </Fab>
          </section>
          {labelOptions.map((option) => (
            <MenuItem key={option} value={option}>
              <Checkbox checked={labels.indexOf(option as never) > -1} />
              <ListItemText primary={option} />
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <InputLabel id="due-date">Fecha de entrega</InputLabel>
      <TextField
        type="date"
        id="due-date"
        name="dueDate"
        variant="outlined"
        value={form.dueDate}
        onBlur={blurValidator}
        onChange={handleChange}
        helperText={errors.dueDate}
        error={Boolean(errors.dueDate)}
      />
      <TextField
        id="title"
        type="text"
        name="title"
        label="Título"
        value={form.title}
        variant="outlined"
        onBlur={blurValidator}
        onChange={handleChange}
        helperText={errors.title}
        error={Boolean(errors.title)}
      />
      <TextField
        rows={4}
        multiline
        type="text"
        id="description"
        name="description"
        variant="outlined"
        label="Descripción"
        onBlur={blurValidator}
        onChange={handleChange}
        value={form.description}
        helperText={errors.description}
        error={Boolean(errors.description)}
      />
      <Button
        fullWidth
        color="primary"
        variant="contained"
        onClick={handleSubmit}
        disabled={
          !form.title ||
          !form.status ||
          !form.dueDate ||
          !labels.length ||
          !form.description ||
          isLoading
        }
        startIcon={isLoading && <CircularProgress size={20} color="inherit" />}
      >
        {isLoading ? "Cargando..." : "Agregar"}
      </Button>
    </Box>
  );
};

export default NewTask;
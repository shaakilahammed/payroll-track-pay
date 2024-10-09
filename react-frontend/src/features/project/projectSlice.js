import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  id: '',
  name: '',
  start_date: '',
  due_date: '',
  budget: '',
  progress: '',
  employee_ids: [],
};

const projectSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    setProject: (state, action) => {
      const {
        id,
        name,
        start_date,
        due_date,
        budget,
        progress,
        employee_ids,
      } = action.payload;
      state.id = id;
      state.name = name;
      state.start_date = start_date;
      state.due_date = due_date;
      state.budget = budget;
      state.progress = progress;
      state.employee_ids = employee_ids;
    },
    resetProject: (state) => {
      state.id = '';
      state.name = '';
      state.start_date = '';
      state.due_date = '';
      state.budget = '';
      state.progress = '';
      state.employee_ids = '';
    },
  },
});

export const { setProject, resetProject } = projectSlice.actions;
export default projectSlice.reducer;

import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { PrimeReactProvider } from 'primereact/api'
import { Toaster } from 'react-hot-toast'
import { Courses, Dashboard, StudentAdm, Subjects } from './views'
import Registration from './views/Registration'
import Slug from './subviews/IndividualStudent'

const App = () => {
  return (
    <PrimeReactProvider>
      <Toaster position='top-right' />
      <BrowserRouter value={{ unstyled: false }} >
        <Routes>
          <Route path='/' element={<Registration />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/courses' element={<Courses />} />
          <Route path='/subjects' element={<Subjects />} />
          <Route path='/students' element={<StudentAdm />} />
          <Route path='/selection_place/:id' element={<Slug />} />

        </Routes>
      </BrowserRouter>
    </PrimeReactProvider>
  )
}

export default App
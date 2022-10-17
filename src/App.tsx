import React, { useEffect, useState } from 'react'
import { Routes, Route, HashRouter } from 'react-router-dom'

import './assets/sass/global.scss'
import { cursos as CoursesData } from './dummyData/cursos'
import Alunos from './pages/Alunos'
import Cursos from './pages/Cursos'
import CursosDetails from './pages/Cursos/cursos'
import Dashboard from './pages/Dashboard'
import Disciplinas from './pages/Disciplinas'
import Professores from './pages/Professores'
import { CourseProps } from './types/courses'

const url =
  process.env.NODE_ENV === 'development'
    ? '/'
    : 'https://michelmfreitas.github.io/magniuniversity.github.io/'

function App() {
  const [coursesRoutes, setCoursesRoutes] = useState([])
  useEffect(() => {
    // if exists localstorage data , load it
    // or load data from dummy data
    const DBCourses = localStorage.getItem('courses')
      ? JSON.parse(localStorage.getItem('courses') || '')
      : CoursesData

    const arr = DBCourses.map((item: { id: string; slug: string }) => {
      return item
    })

    setCoursesRoutes(arr)
  }, [])
  console.log(url)

  // const baseURL =
  //   process.env.NODE_ENV === 'development' ? '/' : process.env.PUBLIC_URL
  // console.log(process.env.PUBLIC_URL)
  // alert(process.env.PUBLIC_URL)

  return (
    <HashRouter basename="/">
      <Routes>
        <Route path={`/`} element={<Dashboard />} />
        <Route
          path={`https://michelmfreitas.github.io/magniuniversity.github.io/#/cursos`}
          element={<Cursos />}
        />
        <Route path={`${url}#/alunos`} element={<Alunos />} />
        <Route path={`${url}#/professores`} element={<Professores />} />
        <Route path={`${url}#/disciplinas`} element={<Disciplinas />} />
        {coursesRoutes.map((item: CourseProps) => {
          return (
            <Route
              key={item.id}
              path={`${url}/cursos/${item.slug}`}
              element={<CursosDetails course={item} />}
            />
          )
        })}
        <Route path="*" element={<h1>Error 404</h1>} />
      </Routes>
    </HashRouter>
  )
}

export default App

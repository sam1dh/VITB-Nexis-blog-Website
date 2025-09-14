import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './Pages/Home';
import Blog from './Pages/Blog';
import Layout from './Pages/admin/Layout'
import Dashboard from './Pages/admin/Dashboard'
// import AddBlog from './Pages/admin/AddBlog'
// import ListBlog from './Pages/admin/ListBlog'
// import Comments from './Pages/admin/Comments'
import Login from './Components/admin/Login';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='/admin' element={true ? <Layout/> : <Login />} >
          <Route index element={<Dashboard />} />
          {/* <Route path='addBlog' element={<AddBlog />} /> */}
          {/* <Route path='listBlog' element={<ListBlog />} /> */}
          {/* <Route path='comments' element={<Comments />} /> */}
        </Route>
      </Routes>
    </div>
  )
}

export default App
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';
import { BrowserRouter,Routes,Route, Navigate } from 'react-router-dom';
import SignUpPage from './pages/auth/SignUpPage';
import LogInPage from './pages/auth/loginPage';
import HomePage from './pages/home/HomePage';
import Sidebar from './components/common/Sidebar';
import RightPanel from './components/common/RightPanel';
import NotificationPage from './pages/Notifications/NotificationPage';
import ProfilePage from './pages/Profile/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { useQuery } from '@tanstack/react-query';
import LoadingSpinner from './components/common/LoadingSpinner';


function App() {
  const {data:authUser,isLoading,error,isError} = useQuery({
    queryKey:['authUser'],
    queryFn: async ()=>{
      try {
        const res = await fetch("http://localhost:8000/api/auth/me/", {
          method: 'GET',
          credentials: 'include', // Ensure credentials are included if needed
          headers: {
            'Content-Type': 'application/json'
          }
        });
        const data = await res.json();
        if(data.error) return null;
        if(!res.ok){
          throw new Error(data.error || "somethign went wrong ");
          
        }
        console.log("authUser is here: ",data);
     
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    retry:false,
  });
  
  if(isLoading){
    return (
      <div className='h-screen flex justify-center items-center'>
        <LoadingSpinner size='lg'/>
      </div>
    )
  }
  
 

  return (
   <div className='flex max-w-6xl mx-auto'>
    
    
    {authUser && <Sidebar/>}
    <Routes>
        
          <Route path='/' element={authUser ? <HomePage/> : <Navigate to={'/logIn'}/>}/>
          <Route path='/signUp' element={!authUser ?<SignUpPage/>:  <Navigate to={'/'}/>}/>
          <Route path='/logIn' element={!authUser ?<LogInPage/>:  <Navigate to={'/'}/>}/>
          <Route path='/notifications' element={authUser ?<NotificationPage/>: <Navigate to={'/logIn'}/>}/>
          <Route path='/profile/:username' element={authUser ?<ProfilePage/>: <Navigate to={'/logIn'}/>}/>

    </Routes>
    {authUser &&<RightPanel/>}
    <Toaster/>

   </div>
  )
}

export default App;

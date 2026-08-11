// import React from 'react'
// import { useDispatch } from 'react-redux'
// // import authSevice from '../../appwrite/auth'
// import { logout } from '../../store/authSlice'
// // import { useNavigate } from 'react-router-dom'

// //  const navigate = useNavigate()

// function Logoutbtn() {
//     const dispatch = useDispatch();
//     const handleLogout = () => {
//         authSevice.logout()
//             .then(() => {
//                 dispatch(logout());
//                 // navigate("/");

//             })
//             .catch((error) => {
//                 console.error('Logout failed:', error);
//             });
//     };
//   return (
//    <button
//     className='inline-bock px-6 py-2 duration-200 hover:bg-blue-100 rounded-full'
//     onClick={handleLogout}
//     >Logout</button>
//   )
// }

// export default Logoutbtn
import React from 'react'

function LogoutBtn() {
  return (
    <div>LogoutBtn</div>
  )
}

export default LogoutBtn
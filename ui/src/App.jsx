import React from 'react';
import Users from "./screens/admin/users";
import {Routes, Route, Navigate} from "react-router-dom";
import Roles from "./screens/admin/roles";
import Privileges from "./screens/admin/privileges";
import AuditTrail from './screens/audit/audit.trail.jsx';
import Home from "./screens/home.jsx";

function App() {



  return (
    <>


                <Routes>
                    <Route path="/home" element={<Navigate to={'/'} />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/roles" element={<Roles />} />
                    <Route path="/privileges" element={<Privileges />} />
                    <Route path="/audit-trail" element={<AuditTrail />} />
                    <Route path="/" element={<Home />} />
                </Routes>

    </>
  );
}

export default App;

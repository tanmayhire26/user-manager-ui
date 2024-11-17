import React, { useEffect } from 'react';

const Logout: React.FC = () => {

    useEffect(()=>{
        localStorage.removeItem('token');
        return()=>{}
    },[])
    return <h2>You are logged out</h2>;
};

export default Logout;

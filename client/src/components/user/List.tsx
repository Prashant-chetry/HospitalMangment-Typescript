import React, { useState, useEffect } from 'react';
import ReactTable from 'react-table';

const options: {
  method: string;
  headers: {
    'Content-Type': string;
    authorization: string;
  };
} = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    authorization: window.localStorage.getItem('accessToken-HM') || '',
  },
};
const columns = [
  {
    Headers: '',
    Cell: ({ original }: { original: any }) => {
      console.log(original);
      return '';
    },
  },
];
const UserList = function () {
  const [data, setData] = useState([]);
  useEffect(() => {
    const fetchData = async function () {
      const resp = await (await fetch('http://localhost:8080/api/user//allUser', options)).json();
      console.log(resp);
      setData(resp?.data);
    };
  }, []);
  return <>{/* <ReactTable columns={columns} data={data} /> */}</>;
};

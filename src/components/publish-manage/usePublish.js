import axios from "axios";
import { useEffect, useState } from "react";

function usePublish(publishState) {
  const { username } = JSON.parse(localStorage.getItem('token'));
  const [ dataSource, setDataSource ] = useState([]);
  useEffect(() => {
    axios(`/news?author=${username}&publishState=${publishState}&_expand=category`).then(res => {
      setDataSource(res.data);
    });
  }, [username]);
  const setHandleData = (id) => {
    setDataSource(dataSource.filter(item => item.id !== id));
  };
  return {
    dataSource,
    setHandleData
  }
};

export default usePublish
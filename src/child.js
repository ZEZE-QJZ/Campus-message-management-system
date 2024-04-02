import React, { useEffect } from "react";
import style from './child.module.scss';
import axios from 'axios';

export default function Child() {

  useEffect(() => {
    axios.get("/api/mmdb/movie/v3/list/hot.json?ct=%E5%8C%97%E4%BA%AC&ci=1&channelId=4").then(res => {
      console.log(res.data)
    })
  })

  return (
    <div className={style.item}>
      Child
    </div>
  )
}
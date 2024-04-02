import axios from 'axios';
import { store } from '../redux/store';

axios.defaults.baseURL = "http://localhost:607";

axios.interceptors.request.use(function(config) {
  // 显示loading
  store.dispatch({
    type: "change_loading",
    payload: true
  })
  return config;
}, function(error) {
  // 隐藏loading
  return Promise.reject(error);
});

axios.interceptors.response.use(function(config) {
  // 隐藏loading
  store.dispatch({
    type: "change_loading",
    payload: false
  })
  return config;
}, function(error) {
  // 隐藏loading
  store.dispatch({
    type: "change_loading",
    payload: false
  })
  return Promise.reject(error);
});
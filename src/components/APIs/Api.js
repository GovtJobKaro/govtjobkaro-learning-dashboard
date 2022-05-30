import axios from 'axios'

export default axios.create({
  baseURL: 'https://api.govtjobkaro.com/api/v1'
  // baseURL: "http://165.22.208.245/api/v1"
});

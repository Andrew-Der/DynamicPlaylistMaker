
import axios from 'axios';
import { getJwtToken } from "./router"

export const perform = async (method, resource, data, jwt_token) => {

  const jwt = getJwtToken()
  return axios({
     method,
     url: `${process.env.REACT_APP_BACKEND_SERVICE_URL}` + resource,
     data,
     headers: {
       Authorization: `Bearer ${jwt}`,
       Accept : "application/json",
     }
   }).then(resp => {
      return resp.data ? resp.data : [];
   }).catch(resp => {
    if (resp.status_code == 401 && resp.text.search(/Token has expired/)) {
      console.log("in error")
      //do some handling here to refresh token
      return "Token expired"
    }
    return resp 
  })
}

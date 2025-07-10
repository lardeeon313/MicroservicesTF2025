import axios from 'axios';
import { API_URL } from '@env';
import { IDENTITY_API } from '@env';
console.log('Usando la api url del depot: ',API_URL);
console.log('Usando la api url del identity: ' , IDENTITY_API);

//API para depot 
export const api = axios.create({
  baseURL: `${API_URL}/api`,
});


//API para service

export const identityApi = axios.create({
  baseURL: `${IDENTITY_API}/api`,
});
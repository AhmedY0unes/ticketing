import axios from 'axios';
//
export default ({ req }) => {
  if (typeof window === 'undefined') {
    // to ignore the sefl-signed cerificate error.
    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    //we are on  server!
    return axios.create({
      baseURL:
        'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local',
      headers: req.headers,
    });
  } else {
    //we are on the client

    return axios.create({
      baseUrl: '/',
    });
  }
};

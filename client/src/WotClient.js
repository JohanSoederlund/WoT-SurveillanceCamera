

/**
 * Login to api and recieve jwt
 * @param {string} url 
 * @param {string} method 
 * @param {object} headers 
 */
const getLoginData = async (url, method, headers) => {
    try {
      const body = {password: "qwe123"}
      const response = await fetch(url, {
        method: method,
        body:    JSON.stringify(body),
        headers: headers,
      })
      const json = await response.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  };
  
  /**
   * get links from model
   * @param {string} url 
   */
  const getEntryPointData = async (url) => {
    try {
      const response = await fetch(url)
      const json = await response.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  };
  
  /**
   * get properties (picture)
   * @param {string} url 
   * @param {object} headers 
   */
  const getProperties = async (url, headers) => {
    try {
      const response = await fetch(url, { headers: headers }) 
      const json = await response.json();
      return json;
    } catch (err) {
      console.log(err);
    }
  };


  module.exports = {
    getLoginData,
    getEntryPointData,
    getProperties
  }
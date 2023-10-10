export const getDate = ()=> {
    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    return `${month}/${date}/${year}`;
}

export const isLoggedIn = ()=>{
    const loginUserDetail = JSON.parse(localStorage.getItem("loginUserDetail"));
    const loginUserDetailQrData = JSON.parse(localStorage.getItem("QrData"));
    return {loginUserDetail, loginUserDetailQrData};
};


export const getTime=()=> {
    const time = new Date();
    const hour = time.getHours();
    const minute = time.getMinutes();
    const sec = time.getSeconds();
  
    return `${hour} : ${minute} : ${sec}`;
  }

 
  export const storedData = localStorage.getItem("loginUserDetail");
   export  const storeQr = localStorage.getItem("QrData");
  
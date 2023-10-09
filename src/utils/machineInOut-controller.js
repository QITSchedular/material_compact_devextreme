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
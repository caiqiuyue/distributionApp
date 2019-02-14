import ajax from 'axios';

//请求域名头
const urlTitle = 'https://39.105.201.251/distributor';


const clientApi = (type, url, data, resolve, reject) => {
    //console.log(global);
    //首先判断global里面有没有TOKEN
    if(global.TOKEN) {
        console.log(global.TOKEN,'global.TOKEN');
        //如果有则直接传入data
        // data.TOKEN = global.TOKEN;
        //发送Ajax
        let config = {
            method: type,
            url: `${urlTitle}${url}`,
            headers: {
                TOKEN: global.TOKEN
            }
        };

        if (data instanceof FormData) {
            config.headers = {
                'Content-Type': 'multipart/form-data',
                ...config.headers,
            };
        }

        if(type == 'post') {
            config.data = data;
        } else {
            config.params = data;
        }
        ajax(config).then(
            (response) => {
                if(response.data.code == 2) {

                    console.log(response,'response');

                    alert('登陆过期，请重新登陆');
                    storage.remove({
                        key: 'TOKEN'
                    });
                    storage.remove({
                        key: 'username'
                    });
                    // clearInterval(global.stopMsgTime);
                    global.TOKEN='';
                    global.roleStr = null;
                    global.getNavigate('Login',{ user: '' })
                    global.stopMsgTime && clearInterval(global.stopMsgTime);
                } else {
                    resolve(response);
                }
            }
        ).catch(
            (error) => {
                reject(error);
            }
        );
    } else {
        //如果没有则从本地storage中读取
        storage.load({ //读取TOKEN
            key: 'TOKEN',
            autoSync: false
        }).then(ret => {
            //成功获取TOKEN并将其存入global
            global.TOKEN = ret.TOKEN;
            // data.TOKEN = ret.TOKEN;
            console.log(ret.TOKEN,"ret.TOKEN");
            //发送Ajax
            let config = {
                method: type,
                url: `${urlTitle}${url}`,
                headers: {
                    TOKEN: global.TOKEN
                }
            };

            if (data instanceof FormData) {

                config.headers = {
                    'Content-Type': 'multipart/form-data',
                    ...config.headers,
                };

            }

            if(type == 'post') {
                config.data = data;
            } else {
                config.params = data;
            }
            ajax(config).then(
                (response) => {
                    if(response.data.code == 2) {
                        console.log(response,'response');
                        alert('登陆过期，请重新登陆');
                        storage.remove({
                            key: 'TOKEN'
                        });
                        storage.remove({
                            key: 'username'
                        });
                        global.stopMsgTime && clearInterval(global.stopMsgTime);
                        global.TOKEN='';
                        global.roleStr = null;
                        global.getNavigate('Login',{ user: '' })
                    } else {
                        resolve(response);
                    }
                }
            ).catch(
                (error) => {
                    reject(error);
                }
            );
        }).catch(err => {

            //如果获取不到TOKEN，则代表用户还未登入
            let config = {
                method: type,
                url: `${urlTitle}${url}`,
                headers: {
                    TOKEN: ''
                }
            };

            if (data instanceof FormData) {


                config.headers = {
                    'Content-Type': 'multipart/form-data',
                    ...config.headers,
                };

            }

            if(type == 'post') {
                config.data = data;
            } else {
                config.params = data;
            }
            ajax(config).then(
                (response) => {

                    console.log(response);

                    if(response.data.code == 2) {
                        console.log(response,'response');
                        alert('登陆过期，请重新登陆');
                        storage.remove({
                            key: 'TOKEN'
                        });
                        storage.remove({
                            key: 'username'
                        });
                        global.stopMsgTime && clearInterval(global.stopMsgTime);
                        global.TOKEN='';
                        global.roleStr = null;
                        global.getNavigate('Login',{ user: '' })
                        global.stopMsgTime && clearInterval(global.stopMsgTime);
                    } else {
                        resolve(response);
                    }
                }
            ).catch(
                (error) => {
                    reject(error);
                }
            );
        });

    }


}


//post请求
const post = (url, data) => {
    return new Promise((resolve, reject) => clientApi('post', url, data, resolve, reject));
};

//get请求
const get = (url, data) => {
    return new Promise((resolve, reject) => clientApi('get', url, data, resolve, reject));
};

//封装请求方法
const axios = {
    post,
    get
}

//暴露方法
export default axios;


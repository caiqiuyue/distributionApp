let aaa = [
    {uri:"file:///Users/useradmin/Library/Developer/CoreSimulator/Devices/8C8297DC-42A0-4F5F-8684-2FA83BDC1EEC/data/Containers/Data/Application/91F661A5-DC5D-4BC3-8213-60E76AD10AEA/Documents/583784DD-0402-4E03-90F1-6F8838BB3F55.jpg"},
    {uri:"file:///Users/useradmin/Library/Developer/CoreSimulator/Devices/8C8297DC-42A0-4F5F-8684-2FA83BDC1EEC/data/Containers/Data/Application/91F661A5-DC5D-4BC3-8213-60E76AD10AEA/Documents/0CB4F1D9-0775-4932-8E2C-6A3CB99074FA.jpg"},
]



uploadImage = (imgAry) => {

    let file = {}
    let files = []

    if(Array.isArray(imgAry)) {
        for(let i = 0; i < imgAry.length; i ++){
            //截取获取文件名
            let a = imgAry[i].uri;
            let arr = a.split('/');
            // 获取文件名end
            // 判断文件的类型(视频-图片等)end
            file = {uri: imgAry[i], type: imgAry[i].mime, name: arr[arr.length-1]}; //这里的key(uri和type和name)不能改变,
            //这里的files就是后台需要的key

            files.push(file)


        }


    } else {
        //截取获取文件名
        let a = imgAry[i].uri;
        let arr = a.split('/');
        // 获取文件名end
        // 判断文件的类型(视频-图片等)end
        file = {uri: imgAry[i], type: imgAry[i].mime, name: arr[arr.length-1]}; //这里的key(uri和type和name)不能改变,

        files.push(file)
        // console.log('file222', file);

        //这里的files就是后台需要的key
    }


    return files


}



console.log(uploadImage(aaa));
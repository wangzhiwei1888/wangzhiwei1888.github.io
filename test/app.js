document.getElementById('uploadButton').addEventListener('click', async () => {
    // const fileInput = document.getElementById('fileInput');
    // const file = fileInput.files[0];

    // if (!file) {
    //     alert('Please select an image file.');
    //     return;
    // }

    // const formData = new FormData();
    // formData.append('file', file);

    // try {
    //     const response = await fetch('http://127.0.0.1:1224/api/ocr', {
    //         method: 'POST',
    //         body: formData,
    //     });

    //     if (!response.ok) {
    //         throw new Error(`HTTP error! status: ${response.status}`);
    //     }

    //     const result = await response.json();
    //     document.getElementById('result').innerText = `OCR Result: ${result.text}`;
    // } catch (error) {
    //     console.error('Error during OCR request:', error);
    //     document.getElementById('result').innerText = `Error: ${error.message}`;
    // }


    const data = {
        base64: 'iVBORw0KGgoAAAANSUhEUgAAAC4AAAAXCAIAAAD7ruoFAAAACXBIWXMAABnWAAAZ1gEY0crtAAAAEXRFWHRTb2Z0d2FyZQBTbmlwYXN0ZV0Xzt0AAAHjSURBVEiJ7ZYrcsMwEEBXnR7FLuj0BPIJHJOi0DAZ2qSsMCxEgjYrDQqJdALrBJ2ASndRgeNI8ledutOCLrLl1e7T/mRkjIG/IXe/DWBldRTNEoQSpgNURe5puiiaJehrMuJSXSTgbaby0A1WzLrCCQCmyn0FwoN0V06QONWAt1nUxfnjHYA8p65GjhDKxcjedVH6JOejBPwYh21eE0Wzfe0tqIsEkGXcVcpoMH4CRZ+P0lsQp/pWJ4ripf1XFDFe8GHSHlYcSo9Es31t60RdFlN1RUmrma5oTzTVB8ZUaeeYEC9GmL6kNkDw9BANAQYo3xTNdqUkvHq+rYhDKW0Bj3RSEIpmyWyBaZaMTCrCK+tJ5Jsa07fs3E7esE66HzralRLgJKp0/BD6fJRSxvmDsb6joqkcFXGqMVVFFEHDL2gTxwCAaTabnkFUWhDCHTd9iYrGcAL1ZnqIp5Vpiqh7bCfua7FA4qN0INMcN1+cgCzj+UFxtbmvwdZvGIrI41JiqhZBWhhF8WxorkYPpQwJiWYJeA3rXE4hzcwJ+B96F9zCFHC0FcVegghvFul7oeEE8PvHeJqC0w0AUbbFIT8JnEwGbPKcS2OxU3HMTqD0r4wgEIuiKJ7i4MS16+og8/+bPZRPLa+6Ld2DSzcAAAAASUVORK5CYII=',
        // Paddle引擎插件格式
        // options: {
        //     cls: false,
        //     language: "models/config_chinese.txt",
        //     limit_side_len: 960
        // }
        // Rapid引擎插件格式
        options: {
            angle: false,
            language: "简体中文(V4)",
            maxSideLen: 1024
        }
    };

    const url = 'http://127.0.0.1:1224/api/ocr';



    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
    })
    .catch(error => {
        console.error(error);
    });

});
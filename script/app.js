let file_sign_accountant=document.getElementById("file_sign_accountant")
let accountant_sign_upld_img=document.getElementById("accountant_sign_upld_img")
let file_sign_accountant_btn=document.getElementById("file_sign_accountant_btn")

file_sign_accountant_btn.addEventListener('click',()=>{
    file_sign_accountant.click();
})

file_sign_accountant.addEventListener('change', function () {
    const chooseFile = this.files[0];

    if (chooseFile) {
        const reader = new FileReader();

        reader.addEventListener('load', () => {
            accountant_sign_upld_img.setAttribute('src', reader.result);
            // profile_pic_url = reader.result;
        });
        reader.readAsDataURL(chooseFile)
    }
})
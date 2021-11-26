//import file system
const { ipcRenderer } = require('electron');
const fs = require('fs');
let systemSetting, languageData, settingsData

let profile_pic_url = "../media/userphoto.png"


// ----------------------------------------------------------------------------------------
let bussiness_category_inpt, email_inpt, bussiness_name_inpt,
    address_inpt, mobile_inpt, bussiness_owner_name_inpt,
    continue_btn_regPage, FAQbtn, T_and_C_btn, Privacy_btn,
    FAQ_to_register,
    TC_to_register, register_right_section, T_and_C_page,
    FAQpage
// ----------------------------------------------------------------------------------------


//this event runs when html content is loaded
window.addEventListener("DOMContentLoaded", () => {

    //read a json file using fs
    fs.readFile("./settings/welcome_screen_language.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        languageData = JSON.parse(data)

    })

    fs.readFile("./settings/system_settings.json", (err, data) => {
        // if error occurs
        if (err) throw err
        // parse the data
        systemSetting = JSON.parse(data)
        applySetting()
    })

    fs.readFile("./settings/usersettings.json", (err, data) => {
        if (err) throw err
        settingsData = JSON.parse(data)
        console.log(settingsData)
    });

    // ----------------------
    let imgDiv = document.getElementById('dpContainer');
    let img = document.getElementById('photo');
    let file = document.getElementById('file');
    let uploadBtn = document.getElementById('uploadBtn');
    let CamUpl_btn = document.getElementById("Cam_btn");

    imgDiv.addEventListener('mouseenter', () => {
        uploadBtn.style.display = "block";
    });


    imgDiv.addEventListener('mouseleave', () => {
        uploadBtn.style.display = "none";
    });
    file.addEventListener('change', function () {
        const chooseFile = this.files[0];

        if (chooseFile) {
            const reader = new FileReader();

            reader.addEventListener('load', () => {
                img.setAttribute('src', reader.result);
                profile_pic_url = reader.result;
            });
            reader.readAsDataURL(chooseFile)
        }
    })
    // ----------------------
    // CamUpl_btn.addEventListener('click',()=>{
    //     file.click()
    // })
    // ----------------------

    // --------------------Validate fn ----------------------------
    bussiness_category_inpt = document.getElementById("bussiness_type_regPage")
    email_inpt = document.getElementById("email_regPage")
    bussiness_name_inpt = document.getElementById("bussiness_name_regPage")
    address_inpt = document.getElementById("address_userinput")
    mobile_inpt = document.getElementById("mobile_regPage")
    bussiness_owner_name_inpt = document.getElementById("bussiness_owner_name_regPage")

    continue_btn_regPage = document.getElementById("continue_btn")

    continue_btn_regPage.addEventListener('click', () => {
        if (validate(bussiness_name_inpt, bussiness_owner_name_inpt, email_inpt, mobile_inpt)) {
            alert("Validated");
            // write function to register user
            bussiness_name = bussiness_name_inpt.value
            bussiness_category = bussiness_category_inpt.value
            email = email_inpt.value
            address = address_inpt.value
            mobile = mobile_inpt.value
            bussiness_owner_name = bussiness_owner_name_inpt.value

            registerUser(bussiness_name, bussiness_category, email, mobile, address, bussiness_owner_name, profile_pic_url);


            ipcRenderer.send('welcome:register');
        }
        else
            console.log("Not Validated");

    })
    // ------------------Validate fn ----------------------------

    // -----------------switch pges on register page---------
    register_right_section = document.getElementById("right_section")

    FAQbtn = document.getElementById("questionmark_icon")
    FAQ_to_register = document.getElementById("backarrow_2")
    FAQpage = document.getElementById("documentation_page")

    T_and_C_btn = document.getElementById("registertext_2")
    T_and_C_page = document.getElementById("privacy_policy")
    TC_to_register = document.getElementById("backarrow")
    Privacy_btn = document.getElementById("registertext_4")

    T_and_C_btn.addEventListener('click', () => {
        register_right_section.style.display = "none"
        T_and_C_page.style.display = "block"
    })

    Privacy_btn.addEventListener('click', () => {
        register_right_section.style.display = "none"
        T_and_C_page.style.display = "block"
    })

    TC_to_register.addEventListener('click', () => {
        register_right_section.style.display = "flex"
        T_and_C_page.style.display = "none"
    })

    FAQbtn.addEventListener('click', () => {
        if (register_right_section.style.display === "flex") {
            register_right_section.style.display = "none"
            FAQpage.style.display = "block"
        }
        else if (T_and_C_page.style.display === "block") {
            T_and_C_page.style.display = "none"
            FAQpage.style.display = "block"
        }
        else {
            register_right_section.style.display = "flex"
            FAQpage.style.display = "none"
        }
    })

    FAQ_to_register.addEventListener('click', () => {
        register_right_section.style.display = "flex"
        FAQpage.style.display = "none"
    })

    // -----------------switch pges on register page---------

    document.getElementById("language_select")
    .addEventListener("change" , () => {
        systemSetting.language = document.getElementById("language_select").value
        changeLanguage(systemSetting.language)
    })

    document.getElementById("close_btn")
    .addEventListener("click" , () => {
        ipcRenderer.send("welcome_screen:close")
    })

    document.getElementById("minimize_btn")
    .addEventListener("click" , () => {
        ipcRenderer.send("welcome_screen:minimize")
    })


})

function applySetting() {
    changeLanguage(systemSetting.language)
}
// --------------------- Validate fn ----------------------------
function validate(bussiness_name, bussiness_user, email, mobile) {
    flag = true;
    if (!checkBussinessName(bussiness_name.value)) {
        bussiness_name_inpt.style.border = "1px solid #aa0000"
        flag = false;
    }
    if (!checkEmail(email.value)) {
        email_inpt.style.border = "1px solid #aa0000"
        flag = false;
    }
    if (!checkBussinessOwnerName(bussiness_user.value)) {
        bussiness_user.style.border = "1px solid #aa0000"
        flag = false;
    }
    if (!checkMobile(mobile.value)) {
        mobile.style.border = "1px solid #aa0000"
        flag = false;
    }
    return flag;
}

// --------------------- Validate fn ----------------------------

function changeLanguage(languageName) {
    // loop all the key 
    for (let key in languageData) {
        document.getElementById(key).innerHTML = languageData[key][languageName]
    }
    fs.writeFile("./settings/system_settings.json", JSON.stringify(systemSetting),(err)=>{
        console.log(err)
    })
}

// function to register user
function registerUser(bussiness_name, bussiness_category, email, mobile, address, bussiness_owner_name, profile_pic_url) {
    settingsData.bussiness_name = bussiness_name
    settingsData.bussiness_category = bussiness_category
    settingsData.email = email
    settingsData.mobile = mobile
    settingsData.address = address
    settingsData.bussiness_owner_name = bussiness_owner_name
    settingsData.profile_pic_url = profile_pic_url
    settingsData.registered = "true"

    // write the usersettings to json file
    fs.writeFile("./settings/usersettings.json", JSON.stringify(settingsData), (err) => {
        if (err) throw err
        console.log("The file has been saved!")
    })
}

// function to check sanity of the user email
function checkEmail(email) {
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    return emailRegex.test(email)
}

//function check sanity of the mobile number
function checkMobile(mobile) {
    let mobileRegex = /^[0-9]{10}$/
    return mobileRegex.test(mobile)
}

//function check sanity of the bussiness name
function checkBussinessName(bussiness_name) {
    return bussiness_name.length >= 3
}

// function check sanity of the bussiness owner name
function checkBussinessOwnerName(bussiness_owner_name) {
    return bussiness_owner_name.length >= 3
}
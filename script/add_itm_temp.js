let add_itm_main, add_itm_PopUp, updateStockBtn, NoBtn_popUp

add_itm_main = document.getElementById("add_itm_subpage");
add_itm_PopUp = document.getElementById("popUp_screen_cnfrm_addItm")

updateStockBtn = document.getElementById("updateStockBtn")

NoBtn_popUp =document.getElementById("no_btn_cnfrm_addItm")

updateStockBtn.addEventListener('click',()=>{
    add_itm_PopUp.style.display="grid";
})

NoBtn_popUp.addEventListener('click',()=>{
    add_itm_PopUp.style.display="none";
})
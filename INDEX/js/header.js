//当页面已经向下滚动时,将header置为半透明
document.addEventListener('DOMContentLoaded', function(){
    var header = document.querySelector('header');
    function toggleHeaderTransparency(){
        if(window.scrollY > 0){
            header.style.opacity = '0.75';
        }
        else{
            header.style.opacity = '1';
        }
    }

    toggleHeaderTransparency();
    window.addEventListener('scroll', toggleHeaderTransparency);
});

//当页面横向像素小于720px时,使用此脚本操控目录
var menu = document.getElementById('menu');
var menuToggle = document.getElementById('menu-toggle');
function toggleMenu(){
    menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
}
window.onclick = function(event){
    if (!menu.contains(event.target) && !menuToggle.contains(event.target)) {
        if (menu.style.display === 'block') {
            toggleMenu();
        }
    }
};
menuToggle.onclick = toggleMenu;
function handleScreenSizeChange(){
    var menu = document.getElementById('menu');
    if (window.matchMedia("(min-width: 1081px)").matches) {
        // 如果屏幕宽度大于1080px，则显示横向菜单
        menu.style.display = 'flex';
    }
    else{
        // 如果屏幕宽度小于或等于1080px，则隐藏菜单
        menu.style.display = 'none';
    }
}
window.addEventListener('resize', handleScreenSizeChange);
handleScreenSizeChange();
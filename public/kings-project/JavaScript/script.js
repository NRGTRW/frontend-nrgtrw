function changeClass() {
  var element = document.querySelector("#myDiv");
  if (element) {
    element.classList.replace("visible", "hidden");
  } else {
    console.error('Element with ID "myDiv" not found.');
  }

  var menu = document.getElementById("myMenu");
  if (menu) {
    menu.classList.replace("hidden", "visible");
  } else {
    console.error('Element with ID "myMenu" not found.');
  }

  console.log("change");
}
let currentContent = "";

function showIframe(content) {
  const iframe = document.getElementById("contentIframe");
  const mainContent = document.getElementById("mainContent");
  const checker = document.getElementById("checker");

  if (currentContent !== content) {
    currentContent = "";
    iframe.src = content;
    checker.classList.add("hidden");
    mainContent.classList.add("hidden");
    iframe.classList.add("showIframe");
    iframe.classList.remove("hideIframe");
    iframe.classList.remove("hidden");
    currentContent = content;
  } else {
    mainContent.classList.remove("hidden");
    checker.classList.remove("hidden");
    iframe.classList.remove("showIframe");
    iframe.classList.add("hideIframe");
    iframe.classList.add("hidden");

    currentContent = "";
  }

  console.log("Content changed to:", content);
}
function hideIframe() {
  const iframe = document.getElementById("contentIframe");
  const mainContent = document.getElementById("mainContent");
    const checker = document.getElementById("checker");

  iframe.classList.remove("showIframe");
  iframe.classList.add("hideIframe");
  iframe.classList.add("hidden");
  mainContent.classList.remove("hidden");
  checker.classList.remove("hidden");

  console.log("Iframe hidden");
}
function togglePl() {
  const pl = document.getElementById("mainContent");
  pl.classList.toggle("pl__keep__size__override");
  console.log("Keep pl-size");
}

document.addEventListener("DOMContentLoaded", function () {
  const navbar = document.querySelector(".navbar");
  const navbarClose = document.querySelector("#navbar-close");
  const UseMenu = document.querySelector("#mainContent");
  const menu = document.querySelector(".menu-content");
  const menuItems = document.querySelectorAll(".submenu-item");
  const subMenuTitles = document.querySelectorAll(".submenu .menu-title");
  const kingLink = document.querySelector("a[href='../HTML/home_page.html']");

  if (navbarClose || UseMenu) {
    navbarClose.addEventListener("click", () => {
      navbar.classList.toggle("close");
      UseMenu.classList.toggle("pl__keep__size");
    });
    UseMenu.addEventListener("click", () => {
      navbar.classList.toggle("close");
      UseMenu.classList.toggle("pl__keep__size");
    });
  }

  if (menuItems.length > 0) {
    menuItems.forEach((item, index) => {
      item.addEventListener("click", () => {
        menu.classList.add("submenu-active");
        item.classList.add("show-submenu");
        menuItems.forEach((item2, index2) => {
          if (index !== index2) {
            item2.classList.remove("show-submenu");
          }
        });
      });
    });
  }

  if (subMenuTitles.length > 0) {
    subMenuTitles.forEach((title) => {
      title.addEventListener("click", () => {
        menu.classList.remove("submenu-active");
      });
    });
  }

  if (kingLink) {
    kingLink.addEventListener("click", () => {
      console.log("NRG'S link clicked");
    });
  }
});
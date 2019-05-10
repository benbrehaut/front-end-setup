  export default function siteHeader() {
    const menuBtn = document.querySelector('.js-toggle-menu'),
    mobileMenu = document.querySelector('.js-site-nav-mobile');

    menuBtn.addEventListener('click', openMenu);

    function openMenu(e) {
      e.preventDefault();

      this.classList.toggle('is-active');
      mobileMenu.classList.toggle('is-active');
    }

    const mobileSecondaryAction = document.querySelectorAll('.js-site-nav-mobile-open-secondary');

    mobileSecondaryAction.forEach(btn => {
      btn.addEventListener('click', function (e) {
        e.preventDefault();

        this.classList.toggle('is-active');
        this.nextElementSibling.classList.toggle('is-active');
      })
    });
  }
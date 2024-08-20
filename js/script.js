window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.pageYOffset > 200) {
        header.classList.add('header__bg');
    } else {
        header.classList.remove('header__bg');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const galleries = document.querySelectorAll('.gallery');

    if (window.innerWidth > 1152) {
        galleries.forEach(gallery => {
            const galleryWrapper = gallery.querySelector('.gallery__wrapper');
            const leftButton = gallery.querySelector('.gallery__button_left');
            const rightButton = gallery.querySelector('.gallery__button_right');

            const slideWidth = galleryWrapper.querySelector('.gallery__item').offsetWidth + 32;
            const galleryListWidth = gallery.querySelector('.gallery__list').offsetWidth;
            const totalSlidesCount = galleryWrapper.children.length;
            let currentIndex = 0;

            const calculateTotalWidth = () => {
                let totalWidth = 0;
                galleryWrapper.querySelectorAll('.gallery__item').forEach(item => {
                    totalWidth += item.offsetWidth + 32;
                });
                return totalWidth - 32;
            };

            let totalWidth = calculateTotalWidth();

            const updateButtons = () => {
                if (totalWidth <= galleryListWidth) {
                    leftButton.disabled = true;
                    rightButton.disabled = true;
                } else {
                    leftButton.disabled = currentIndex === 0;
                    rightButton.disabled = galleryWrapper.scrollLeft + galleryListWidth >= totalWidth;
                }
            };

            leftButton.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    const newScrollLeft = currentIndex * slideWidth;
                    galleryWrapper.style.transform = `translateX(-${newScrollLeft}px)`;
                    updateButtons();
                }
            });

            rightButton.addEventListener('click', () => {
                const maxScrollIndex = Math.ceil((totalWidth - galleryListWidth) / slideWidth);
                if (currentIndex < maxScrollIndex) {
                    currentIndex++;
                    const newScrollLeft = currentIndex * slideWidth;
                    const maxScrollLeft = totalWidth - galleryListWidth;
                    galleryWrapper.style.transform = `translateX(-${Math.min(newScrollLeft, maxScrollLeft)}px)`;
                    updateButtons();
                }
            });

            window.addEventListener('resize', updateButtons);

            updateButtons();
        });
    }

    const hideBlock = (block, wrapper) => {
        const calendarChevron = wrapper.querySelector('.chevron-down');
        document.addEventListener('click', event => {
            if (!wrapper.contains(event.target)) {
                block.classList.remove('shown');
                if (calendarChevron) {
                    calendarChevron.classList.remove('rotate');
                }
            }
        });
    };

    //селект выбора количества человек
    const customSelect = document.querySelectorAll('.custom-select');
    customSelect.forEach(select => {
        const selectInput = select.querySelector('.custom-select__field');
        const selectList = select.querySelector('.custom-select__list');
        const selectItems = selectList.querySelectorAll('.custom-select__item');
        const calendarChevron = selectInput.nextElementSibling;

        selectInput.addEventListener('focus', () => {
            selectList.classList.add('shown');
            calendarChevron.classList.add('rotate');
        });

        selectItems.forEach(item => {
            item.addEventListener('click', () => {
                selectItems.forEach(i => i.classList.remove('custom-select__item_selected'));
                selectInput.value = item.innerHTML;
                item.classList.add('custom-select__item_selected');
            });
        });

        hideBlock(selectList, select);
    });

    const calendars = document.querySelectorAll('.calendar');
    calendars.forEach(calendar => {
        const calendarChevron = calendar.nextElementSibling;
        new AirDatepicker(calendar, {
            dateFormat: 'E, dd MMM yyyy',
            classes: 'calendar-body',
            onShow() {
                calendarChevron.classList.add('rotate');
            },
            onHide() {
                calendarChevron.classList.remove('rotate');
            }
        });
    });

    //поиск-фильтрация
    const list = ['Amsterdam', 'Athens', 'Barcelona', 'Belgrade', 'Berlin', 'Bern', 'Brussels', 'Budapest', 'Bucharest', 'Copenhagen', 'Dublin', 'Helsinki', 'Lisbon', 'London', 'Madrid', 'Monaco', 'Moscow', 'Oslo', 'Paris', 'Prague', 'Reykjavik', 'Riga', 'Rome', 'Stockholm', 'Tallinn', 'Vein', 'Vilnius', 'Warsaw', 'Zagreb'];
    const results = document.querySelector('.results');
    const searchField = document.querySelector('.input-search');
    const searchWrapper = document.querySelector('.search-wrapper');

    const createItems = (list, resultBlock) => {
        resultBlock.innerHTML = '';
        list.forEach(item => {
            const newItem = document.createElement('li');
            newItem.innerHTML = item;
            resultBlock.append(newItem);
            newItem.addEventListener('click', () => chooseItem(newItem));
        });

        const selectedItem = sessionStorage.getItem('selectedCity');
        if (selectedItem) {
            const selectedElement = Array.from(resultBlock.children).find(li => li.innerHTML === selectedItem);
            if (selectedElement) {
                selectedElement.classList.add('selected');
            }
        }
    };

    const chooseItem = item => {
        document.querySelectorAll('.results li').forEach(li => {
            li.classList.remove('selected');
        });
        searchField.value = item.innerHTML;
        item.classList.add('selected');
        sessionStorage.setItem('selectedCity', item.innerHTML);
    };

    if (searchField) {
        searchField.addEventListener('focus', () => {
            results.classList.add('shown');
            createItems(list, results);
        });
        searchField.addEventListener('input', () => {
            const searchText = searchField.value.toLowerCase();
            const filteredList = list.filter(city => city.toLowerCase().includes(searchText));
            createItems(filteredList, results);
        });
    }

    hideBlock(results, searchWrapper);
    window.addEventListener('unload', () => {
        sessionStorage.clear();
    });

    //автоматический слайдер на главной
    const mainImages = document.querySelectorAll('.main-block__img');
    let imageIndex = 0;
    if (mainImages.length > 0) {
        const showNextImage = () => {
            mainImages[imageIndex].classList.remove('show');
            imageIndex = (imageIndex + 1) % mainImages.length;
            mainImages[imageIndex].classList.add('show');
        };

        setInterval(showNextImage, 6000);
    }

    //мобильное меню
    const burgerBtn = document.querySelector('.burger-menu');
    const mobileMenu = document.querySelector('.mobile-menu');
    if (burgerBtn) {
        burgerBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('show');
            burgerBtn.classList.toggle('active');
        });
    }

//    плавный скролл
    const menuLinks = document.querySelectorAll('.menu__link[href^="#"]');
    const sections = document.querySelectorAll('.section');
    let isScrolling = false;

    function onScroll() {
        if (isScrolling) return;

        let scrollPos = window.scrollY + window.innerHeight / 2;

        sections.forEach((section, index) => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;

            if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
                menuLinks.forEach(link => link.classList.remove('menu__link_active'));

                menuLinks[index].classList.add('menu__link_active');
            }
        });
    }

    window.addEventListener('scroll', onScroll);

    if (menuLinks.length > 0) {
        menuLinks.forEach(link => {
            link.addEventListener('click', function (event) {
                event.preventDefault();

                isScrolling = true;

                menuLinks.forEach(link => link.classList.remove('menu__link_active'));
                this.classList.add('menu__link_active');

                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);

                if (this.classList.contains('mobile-menu__link')) {
                    mobileMenu.classList.remove('show');
                    burgerBtn.classList.remove('active');

                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                        });
                        setTimeout(() => {
                            isScrolling = false;
                        }, 500);
                    }
                } else {
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                        });
                        setTimeout(() => {
                            isScrolling = false;
                        }, 500);
                    }
                }
            })
        })
    }
    onScroll();

    function validatePhoneNumber(input) {
        const errorElement = document.getElementById('error');
        let value = input.value;

        // Allow only digits after the initial +
        if (value.length > 0 && (value[0] !== '+' || !/^\+?\d*$/.test(value))) {
            input.value = '+' + value.replace(/[^\d]/g, '');
            errorElement.textContent = 'Phone number must start with + and contain only numbers.';
        } else {
            errorElement.textContent = '';
        }

        // Limit to 11 digits after the +
        if (value.startsWith('+') && value.length > 12) {
            input.value = value.slice(0, 12);
            errorElement.textContent = 'Phone number can only contain 11 digits after +.';
        }
    }

    document.getElementById('phone').addEventListener('input', function() {
        validatePhoneNumber(this);
    });

    const modal = document.getElementById('modal');
    const closeModalBtn = modal.querySelector('.offers-modal__close');
    const detailBtn = document.querySelectorAll('.offers__button');
    if (detailBtn.length > 0){
        detailBtn.forEach(btn => {
            btn.addEventListener('click', function (){
                modal.classList.add('show');
            })
        })
    }

    if(closeModalBtn){
        closeModalBtn.addEventListener('click', function (){
            modal.classList.remove('show');
        })
    }


});

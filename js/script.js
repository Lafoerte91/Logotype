window.addEventListener('DOMContentLoaded', function() {
  // Tabs
  const tabs = document.querySelectorAll('.tabheader__item') // запоминаем все табы
  const tabsContent = document.querySelectorAll('.tabcontent') // запоминаем все содержимое табов
  const tabsParent = document.querySelector('.tabheader__items') // запоминаем родительский таб

  function hideTabContent() {
    tabsContent.forEach(item => {
      item.classList.add('hide') // скрываем все содержимое табов
      item.classList.remove('show', 'fade') // скрываем все содержимое табов
    }) 

    tabs.forEach(item => {
      item.classList.remove('tabheader__item_active') // убираем активные табы
    })
  }

  function showTabContent(i=0) {
    tabsContent[i].classList.add('show', 'fade') // показываем нужное содержимое
    tabsContent[i].classList.remove('hide') 
    tabs[i].classList.add('tabheader__item_active') // делаем активным нужный таб
  }

  hideTabContent() // скрываем все содержимое
  showTabContent() // показываем первое содержимое

  tabsParent.addEventListener('click', (event) => {
    const target = event.target // получаем элемент, на котором произошло событие
    if(target.classList.contains('tabheader__item')) {
      const index = Array.from(tabsParent.children).indexOf(target) // получаем индекс активного таба
      hideTabContent() // скрываем все содержимое
      showTabContent(index) // показываем нужное содержимое
    }
  })

  // Timer
  const deadline = '2024-06-11' // дата окончания

  function getTimerRemaining(endtime) { // получаем разницу между датами
    let days 
    let hours
    let minutes
    let seconds
    const t = Date.parse(endtime) - Date.parse(new Date()) // разница между датами
    if(t <= 0) { // если время закончилось
      days = 0
      hours = 0
      minutes = 0
      seconds = 0
    } else {
      days = Math.floor(t / (1000 * 60 * 60 * 24)) // дни
      hours = Math.floor((t / 1000 * 60 * 60) % 24) // часы
      minutes  = Math.floor((t / 1000 / 60) % 60) // минуты
      seconds  = Math.floor((t / 1000) % 60) // секунды
    }

    return {
      'total': t ,
      'days': days , 
      'hours': hours ,
      'minutes': minutes ,
      'seconds': seconds 
    }
  }

  function getZero(num) { // приводим число к двухзначному виду
    if (num >= 0 && num < 10) {
      return `0${num}`
    } else {
      return num
    }
  }

  function setClock(selector, endtime) { // устанавливаем таймер
    const timer = document.querySelector(selector) // получаем таймер
    const days = timer.querySelector('#days') 
    const hours = timer.querySelector('#hours') 
    const minutes  = timer.querySelector('#minutes') 
    const seconds  = timer.querySelector('#seconds')

    let timeInterval = setInterval(updateClock, 1000) // устанавливаем интервал обновления
    updateClock() // обновляем таймер

    function updateClock() { // функция обновления таймера
      const t = getTimerRemaining(endtime) // получаем разницу между датами
      days.textContent = getZero(t.days) // показываем дни
      hours.textContent = getZero(t.hours) // показываем часы
      minutes.textContent = getZero(t.minutes) // показываем минуты
      seconds.textContent = getZero(t.seconds) // показываем секунды

      if(t.total <= 0) { // если время закончилось
        clearInterval(timeInterval) // останавливаем интервал обновления
      }
    }
  }

  setClock('.timer', deadline) // устанавливаем таймер

  // Modal
  const modalTrigger = document.querySelectorAll('[data-modal]') // запоминаем все модальные окна
  const modal = document.querySelector('.modal') // запоминаем модальное окно
  function openModal() {
    modal.classList.add('show') // показываем модальное окно
    modal.classList.remove('hide') // убираем скрытие модального окна
    document.body.style.overflow = 'hidden' // запрещаем прокрутку страницы
    clearInterval(modalTimerId) // если пользователь открыл модальное окно, то не показываем его снова 
  }

  modalTrigger.forEach(btn => {
    btn.addEventListener('click', openModal) // открываем модальное окно при нажатии на кнопку
  })

  function closeModal() {
    modal.classList.remove('show') // убираем показ модального окна
    modal.classList.add('hide') // скрываем модальное окно
    document.body.style.overflow = '' // разрешаем прокрутку страницы
  }


  modal.addEventListener('click', function(e) {
    if(e.target == modal || e.target.hasAttribute('data-close')) { // если нажали на крестик или на модальное окно
      closeModal() // закрываем модальное окно при клике вне окна
    }
  })

  this.document.addEventListener('keydown', function(e) {
    if(e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal() // закрываем модальное окно при нажатии на Escape
    }
  })

  const modalTimerId = setTimeout(openModal, 50000); // открываем модальное окно через 5 секунд

  function showModalByScroll() {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal() // открываем модальное окно при прокрутке до конца страницы
      window.removeEventListener('scroll', showModalByScroll) // отключаем отслеживание прокрутки
    }
  }

  window.addEventListener('scroll', showModalByScroll) // открываем модальное окно при прокрутке до конца страницы
  
  // async/await
  const getResource = async (url) => { // функция для получения данных
    const res = await fetch(url) // получаем данные
    if(!res.ok) {
      throw new Error(`Could not fetch ${url}, status: ${res.status}`) // если произошла ошибка
    }
    return await res.json() // преобразуем данные
  }

  axios.get('http://localhost:3000/menu') // получаем данные
    .then(data => createCard(data.data)) // выводим данные

  function createCard(data) {
    data.forEach(({img, altimg, title, descr, price}) => { // перебираем полученные данные
      price *= 89 // пересчитываем цену с учетом курса
      const element = document.createElement('div') // создаем элемент
      element.classList.add('menu__item') // добавляем класс
      element.innerHTML = `
      <img src="${img}" alt="${altimg}">
      <h3 class="menu__item-subtitle">${title}</h3>
      <div class="menu__item-descr">${descr}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
        <div class="menu__item-cost">Цена:</div>
        <div class="menu__item-total"><span>${price}</span> руб/день</div>
      </div>
      `
      document.querySelector('.menu .container').append(element) // добавляем элемент в контейнер
    })
  }

  // Forms
  const forms = document.querySelectorAll('form') // получаем все формы
  const prevModalDialog = document.querySelector('.modal__dialog') // получаем модальное окно
  const message = {
    loading: 'img/form/spinner.svg',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  }

  forms.forEach(item => bindPostData(item)) // отправляем данные

  const postData = async (url, data) => {
    const res = await fetch(url, {
      method: 'POST', // метод отправки
      headers: {
        'Content-type': 'application/json' // тип данных
      },
      body: data // данные
    })
    return await res.json() // получаем данные
  }

  function bindPostData(form) {
    form.addEventListener('submit', function(e) { // при отправке формы 
      e.preventDefault() // отменяем стандартное поведение формы

      const statusMessage = document.createElement('img') // создаем элемент
      statusMessage.src = message.loading // задаем содержимое
      statusMessage.textContent = message.loading // задаем содержимое
      statusMessage.style.cssText = 'display: block; margin: 0 auto' // задаем стили
      form.insertAdjacentElement('afterend', statusMessage) // добавляем элемент после формы
            
      const formData = new FormData(form) // получаем данные формы
      
      const json = JSON.stringify(Object.fromEntries(formData.entries())) // получаем данные формы

      postData('http://localhost:3000/requests', json) // отправляем данные формы
        .then((data) => {
            console.log(data)
            showThanksModal(message.success) // выводим сообщение об успехе
            statusMessage.remove() // удаляем сообщение об успехе
          }).catch(() => {
            showThanksModal(message.failure) // выводим сообщение об ошибке
          }).finally(() => {
            form.reset() // очищаем форму
          })
    })
    function showThanksModal(message) { 
      prevModalDialog.classList.add('hide') // скрываем модальное окно
      const thanksModal = document.createElement('div') // создаем элемент
      thanksModal.classList.add('modal__dialog') // добавляем ему класс
      thanksModal.innerHTML = `
        <div class="modal__content">
          <div data-close="" class="modal__close">×</div>
          <div class="modal__title">${message}</div>
        </div>
      `
      document.querySelector('.modal').append(thanksModal) // добавляем элемент в конец модального окна
      openModal() // открываем модальное окно
      setTimeout(() => {
        thanksModal.remove() // удаляем модальное окно
        prevModalDialog.classList.remove('hide') // убираем скрытие модального окна
        closeModal() // закрываем модальное окно
      }, 4000);
    }
  }

  // Slider
  const slides = document.querySelectorAll('.offer__slide') // получаем все слайды
  console.log(slides)
  const prev = document.querySelector('.offer__slider-prev') // получаем кнопку "назад"
  const next = document.querySelector('.offer__slider-next') // получаем кнопку "вперед"
  const currentSlide = document.querySelector('#current') // получаем текущий слайд
  let slideIndex = 1 // текущий слайд

  showSlides(slideIndex) // показываем текущий слайд

  function showSlides(n) {
    if(n > slides.length) { // если текущий слайд больше количества слайдов
      slideIndex = 1 // устанавливаем текущий слайд в первый
    }
    if(n < 1) { // если текущий слайд меньше первого слайда
      slideIndex =  slides.length // устанавливаем текущий слайд в последний
    }
    slides.forEach(item => item.classList.add('hide')) // скрываем все слайды
    slides[slideIndex-1].classList.remove('hide') // показываем текущий слайд
    if(slides.length < 10) {
      currentSlide.textContent = `0${slideIndex}` // отображаем номер текущего слайда
    } else {
      currentSlide.textContent = slideIndex
    }
  }

  function plusSlides(n) {
    showSlides(slideIndex += n) // при нажатии "вперед" или "назад" показываем следующий или предыдущий слайд
  }

  prev.addEventListener('click', () => plusSlides(-1)) // при нажатии "назад" показываем предыдущий слайд 
  next.addEventListener('click', () => plusSlides(1)) // при нажатии "назад" показываем предыдущий слайд 
})



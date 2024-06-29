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
  const slider = document.querySelector('.offer__slider') // получаем слайдер
  const slides = document.querySelectorAll('.offer__slide') // получаем все слайды
  const prev = document.querySelector('.offer__slider-prev') // получаем кнопку "назад"
  const next = document.querySelector('.offer__slider-next') // получаем кнопку "вперед"
  const currentSlide = document.querySelector('#current') // получаем текущий слайд
  const total = document.querySelector('#total') // получаем общий слайд
  const slidesWrapper = document.querySelector('.offer__slider-wrapper') // получаем внешнюю обертку 
  slidesWrapper.style.overflow = 'hidden'
  const slidesField = document.querySelector('.offer__slider-inner') // получаем внутреннюю обертку 
  const width = window.getComputedStyle(slidesWrapper).width // получаем ширину внешней обертки
  slidesField.style.width = 100 * slides.length + '%' // задаем ширину внутренней обертки
  slidesField.style.display = 'flex'
  slidesField.style.transition = '0.5s all' // задаем время анимации
  let slideIndex = 1 // текущий слайд
  let offset = 0 // смещение слайда

  if(slides.length < 10) {
    total.textContent = `0${slides.length}` // отображаем число слайдов
    currentSlide.textContent = `0${slideIndex}` // отображаем текущий слайд
  } else {
    currentSlide.textContent = slideIndex
    total.textContent = slides.length
  }

  slides.forEach(slyde => slyde.style.width = width) // задаем ширину слайдов

  slider.style.position = 'relative' // позиционируем слайдер

  const indicators = document.createElement('ol') // создаем индикаторы
  const dots = []
  indicators.classList.add('carousel-indicators') 
  slider.append(indicators) // добавляем индикаторы в слайдер

  for(let i = 0; i < slides.length; i++) {
    const dot = document.createElement('li')
    dot.setAttribute('data-slide-to', i + 1) 
    dot.classList.add('dot') 
    if(i == 0) {
      dot.style.opacity = 1
    }
    indicators.append(dot)
    dots.push(dot)
  }

  next.addEventListener('click', () => {
    if(offset == +width.slice(0, width.length-2) * (slides.length - 1)) { // если смещение равно ширине последнего слайда
      offset = 0 // смещение равно нулю
    } else {
      offset += +width.slice(0, width.length-2) // смещение увеличивается на ширину слайда
    }
    slidesField.style.transform = `translateX(-${offset}px)` // смещаем слайды

    if(slideIndex == slides.length) { // если текущий слайд равен общему количеству слайдов
      slideIndex = 1
    } else {
      slideIndex++
    }

    if(slides.length < 10) {
      currentSlide.textContent = `0${slideIndex}` // отображаем текущий слайд
    } else {
      currentSlide.textContent = slideIndex
    }

    dots.forEach(dot => dot.style.opacity = '.5')
    dots[slideIndex - 1].style.opacity = 1
  })

  prev.addEventListener('click', () => {
    if(offset == 0) { // если смещение равно нулю
      offset = +width.slice(0, width.length-2) * (slides.length - 1) // смещение равно ширине последнего слайда
    } else {
      offset -= +width.slice(0, width.length-2) // смещение увеличивается на ширину слайда
    }
    slidesField.style.transform = `translateX(-${offset}px)` // смещаем слайды

    if(slideIndex == 1) { // если текущий слайд равен общему количеству слайдов
      slideIndex = slides.length
    } else {
      slideIndex--
    }
  
    if(slides.length < 10) {
      currentSlide.textContent = `0${slideIndex}` // отображаем текущий слайд
    } else {
      currentSlide.textContent = slideIndex
    }

    dots.forEach(dot => dot.style.opacity = '.5')
    dots[slideIndex - 1].style.opacity = 1
  })

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const slideTo = e.target.getAttribute('data-slide-to')
      slideIndex = slideTo

      offset =  +width.slice(0, width.length-2) * (slideTo - 1)
      slidesField.style.transform = `translateX(-${offset}px)`

      if(slides.length < 10) {
        currentSlide.textContent = `0${slideIndex}` // отображаем текущий слайд
      } else {
        currentSlide.textContent = slideIndex
      }

      dots.forEach(dot => dot.style.opacity = '.5')
      dots[slideIndex - 1].style.opacity = 1
    })
  })
})



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
  const modalCloseBtn = this.document.querySelector('[data-close]') // запоминаем кнопку закрытия модального окна
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

  modalCloseBtn.addEventListener('click', closeModal) // закрываем модальное окно при нажатии на крестик

  modal.addEventListener('click', function(e) {
    if(e.target == modal) {
      closeModal() // закрываем модальное окно при клике вне окна
    }
  })

  this.document.addEventListener('keydown', function(e) {
    if(e.code == 'Escape' && modal.classList.contains('show')) {
      closeModal() // закрываем модальное окно при нажатии на Escape
    }
  })

  const modalTimerId = setTimeout(openModal, 5000); // открываем модальное окно через 5 секунд

  function showModalByScroll() {
    if(window.pageYOffset + document.documentElement.clientHeight >= document.documentElement.scrollHeight - 1) {
      openModal() // открываем модальное окно при прокрутке до конца страницы
      window.removeEventListener('scroll', showModalByScroll) // отключаем отслеживание прокрутки
    }
  }

  window.addEventListener('scroll', showModalByScroll) // открываем модальное окно при прокрутке до конца страницы

  // Classes
  class MenuCard {
    constructor(src, alt, title, descr, price, parentSelector, ...classes) {
      this.src = src
      this.alt = alt
      this.title = title
      this.descr = descr
      this.price = +price
      this.classes = classes
      this.parent = document.querySelector(parentSelector)
      this.transfer = 91
      this.changeToRUB()
    }
    changeToRUB() {
      this.price *= this.transfer
    }
    render() {
      const element = document.createElement('div')
      if(this.classes.length === 0) {
        this.element = 'menu__item'
        element.classList.add(this.element)
      } else {
        this.classes.forEach(className => element.classList.add(className))
      }
      element.innerHTML = `
      <img src="${this.src}" alt="${this.alt}">
      <h3 class="menu__item-subtitle">${this.title}</h3>
      <div class="menu__item-descr">${this.descr}</div>
      <div class="menu__item-divider"></div>
      <div class="menu__item-price">
          <div class="menu__item-cost">Цена:</div>
          <div class="menu__item-total"><span>${this.price}</span> руб/день</div>
      </div>
      `
      this.parent.append(element)
    }
  }

  new MenuCard(
    'img/tabs/vegy.jpg',
    'vegy',
    'Меню "Фитнес"',
    'Меню "Фитнес" - это новый подход к приготовлению блюд: больше свежих овощей и фруктов. Продукт активных и здоровых людей. Это абсолютно новый продукт с оптимальной ценой и высоким качеством!',
    3,
    '.menu .container'
  ).render()

  new MenuCard(
    'img/tabs/elite.jpg',
    'elite',
    'Меню “Премиум”',
    'В меню “Премиум” мы используем не только красивый дизайн упаковки, но и качественное исполнение блюд. Красная рыба, морепродукты, фрукты - ресторанное меню без похода в ресторан!',
    6,
    '.menu .container',
    'menu__item'
  ).render()

  new MenuCard(
    'img/tabs/post.jpg',
    'post',
    'Меню "Постное"',
    'Меню “Постное” - это тщательный подбор ингредиентов: полное отсутствие продуктов животного происхождения, молоко из миндаля, овса, кокоса или гречки, правильное количество белков за счет тофу и импортных вегетарианских стейков.',
    4,
    '.menu .container',
    'menu__item'
  ).render()

  // Forms
  const forms = document.querySelectorAll('form') // получаем все формы
  const message = {
    loading: 'Загружаем',
    success: 'Спасибо! Скоро мы с вами свяжемся',
    failure: 'Что-то пошло не так...'
  }

  forms.forEach(item => postData(item)) // отправляем данные

  function postData(form) {
    form.addEventListener('submit', function(e) { // при отправке формы 
      e.preventDefault() // отменяем стандартное поведение формы

      const statusMessage = document.createElement('div') // создаем элемент
      statusMessage.classList.add('status') // добавляем ему класс
      statusMessage.textContent = message.loading // задаем содержимое
      form.append(statusMessage) // добавляем элемент в конец формы

      const request = new XMLHttpRequest() // создаем объект XMLHttpRequest
      request.open('POST', 'server.php') // открываем соединение с PHP-файлом
      request.setRequestHeader('Content-type', 'application/json; charset=utf-8') // указываем тип содержимого
      
      const formData = new FormData(form) // получаем данные формы
      const object = {} // создаем пустой объект
      formData.forEach(function(value, key) { // проходимяем по полученным данным
        object[key] = value // заполняем объект данными из формы
      })
      const json = JSON.stringify(object) // переводим объект в JSON
      request.send(json) // отправляем данные на PHP-файл

      request.addEventListener('load', function() { // при успешном получении данных
        if(request.status == 200) { // если данные получены
          console.log(request.response) // выводим их в консоль
          statusMessage.textContent = message.success // выводим сообщение об успехе
          form.reset() // очищаем форму
          setTimeout(() => {
            statusMessage.remove()
          }, 2000);
        } else {
          statusMessage.textContent = message.failure // выводим сообщение об ошибке
        }
      })
    })
  }
})



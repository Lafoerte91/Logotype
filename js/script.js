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
    const t = Date.parse(endtime) - Date.parse(new Date()) // разница между датами
    const days = Math.floor(t / (1000 * 60 * 60 * 24)) // дни
    const hours = Math.floor((t / 1000 * 60 * 60) % 24) // часы
    const minutes  = Math.floor((t / 1000 / 60) % 60) // минуты
    const seconds  = Math.floor((t / 1000) % 60) // секунды

    return {
      'total': t,
      'days': days,
      'hours': hours,
      'minutes': minutes,
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
})



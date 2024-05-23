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
})
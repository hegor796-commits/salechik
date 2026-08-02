/* ============================================================
   ДАННЫЕ КАТАЛОГА
   ============================================================
   Как редактировать:

   1. ФОТО: положите файлы в папку katalog/photos/ с именами
      по номерам: 600.jpg, 602.jpg и т.д.
      Подойдут расширения .jpg, .jpeg, .png, .webp — сайт сам
      найдёт файл. Пока файла нет — показывается серый
      placeholder с номером.

   2. ОПИСАНИЕ: впишите текст в поле description у нужного
      объявления (можно в несколько строк через \n).

   3. ЦЕНА: когда появится прайс, впишите цену в поле price,
      например price: "3500 ₽" — она автоматически появится
      на странице объявления. Пока price: null — цена не
      показывается.

   4. НОВЫЙ ОКРАС: скопируйте любой блок { id, name, photos,
      description, price } и поменяйте значения. id — латиницей,
      уникальный внутри породы (он попадает в адрес страницы).

   5. НОВАЯ ПОРОДА: скопируйте блок породы целиком.
   ============================================================ */

window.CATALOG_DATA = {
  siteTitle: "Каталог кур",
  photoDir: "katalog/photos/",

  breeds: [
    {
      id: "brama",
      name: "Брама",
      variants: [
        { id: "belaya",                 name: "Брама белая",                       photos: [600, 602, 378, 737],           description: "", price: null },
        { id: "belaya-serebro",         name: "Брама белая серебро каймлевая",     photos: [785, 788],                     description: "", price: null },
        { id: "chernaya",               name: "Брама чёрная",                      photos: [251, 384, 387],                description: "", price: null },
        { id: "farforovaya",            name: "Брама фарфоровая (парцелин)",       photos: [606, 676],                     description: "", price: null },
        { id: "splash",                 name: "Брама сплэш",                       photos: [367, 371, 395, 398],           description: "", price: null },
        { id: "zolotistaya",            name: "Брама золотистая каймлевая",        photos: [682, 705, 764],                description: "", price: null },
        { id: "lakensazhe",             name: "Брама лакенсаже",                   photos: [488, 780, 781, 802, 803],      description: "", price: null },
        { id: "izabella",               name: "Брама изабелла",                    photos: [511, 522],                     description: "", price: null },
        { id: "temnaya",                name: "Брама тёмная",                      photos: [499, 501],                     description: "", price: null },
        { id: "mehelenskaya-kukushka",  name: "Брама мехеленская кукушка",         photos: [362],                          description: "", price: null },
        { id: "pavanda",                name: "Брама паванда",                     photos: [495],                          description: "", price: null }
      ]
    },
    {
      id: "kohinhin",
      name: "Кохинхин карликовый",
      variants: [
        { id: "losos",     name: "Кохинхин карликовый лосось",   photos: [546, 571],                                        description: "", price: null },
        { id: "izabella",  name: "Кохинхин карликовый изабелла", photos: [259, 316, 322, 324, 405, 411, 446, 452, 475],     description: "", price: null },
        { id: "mramorny",  name: "Кохинхин мраморный",           photos: [255, 673],                                        description: "", price: null }
      ]
    },
    {
      id: "viandot",
      name: "Виандот карликовый",
      variants: [
        { id: "viandot", name: "Виандот карликовый", photos: [574, 576, 580, 583, 585, 588, 589], description: "", price: null }
      ]
    },
    {
      id: "shelkovaya",
      name: "Китайская шёлковая",
      variants: [
        { id: "shelkovaya",  name: "Китайская шёлковая",          photos: [612, 613, 270, 278, 280, 282, 291, 302], description: "", price: null },
        { id: "golosheyaya", name: "Китайская шёлковая голошеяя", photos: [313],                                    description: "", price: null }
      ]
    },
    {
      id: "lokenfelder",
      name: "Локенфельдер",
      variants: [
        { id: "zolotoy",   name: "Локенфельдер золотой",   photos: [616], description: "", price: null },
        { id: "shelkovy",  name: "Локенфельдер шёлковый",  photos: [617], description: "", price: null }
      ]
    },
    {
      id: "sultan",
      name: "Султан",
      variants: [
        { id: "izabella", name: "Султан изабелла", photos: [339],           description: "", price: null },
        { id: "pabanda",  name: "Султан пабанда",  photos: [346, 358, 348], description: "", price: null }
      ]
    },
    {
      id: "paduan",
      name: "Падуан",
      variants: [
        { id: "shamua", name: "Падуан шамуа", photos: [330, 335, 337], description: "", price: null }
      ]
    },
    {
      id: "brikel",
      name: "Брикель",
      variants: [
        { id: "serebristy", name: "Брикель серебристый", photos: [246, 467], description: "", price: null }
      ]
    },
    {
      id: "maram",
      name: "Марам",
      variants: [
        { id: "medny", name: "Марам медный", photos: [773], description: "", price: null }
      ]
    }
  ]
};

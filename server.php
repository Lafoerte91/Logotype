<?php

$_POST = json_decode(file_get_contents('php://input'), true); // json-декодируем данные

echo var_dump($_POST); // получаем данные из формы
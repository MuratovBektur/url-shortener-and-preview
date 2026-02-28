# Ошибка версии клиента Docker

## Описание
При попытке выполнить команду `docker-compose -f docker-compose.local.yml down -v` возникла ошибка: `Error response from daemon: client version 1.42 is too old. Minimum supported API version is 1.44, please upgrade your client to a newer version`.

## Причина
Версия клиента Docker (1.42) не соответствует минимально необходимой версии API Docker (1.44), требуемой демоном Docker.

## Решение
Необходимо обновить клиент Docker до версии 1.44 или выше. Это можно сделать, обновив Docker Desktop или установив последнюю версию Docker Engine.

## Статус
Не решено. Требуется ручное обновление клиента Docker пользователем.

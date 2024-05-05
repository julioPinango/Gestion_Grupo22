.PHONY: start

start:
	docker compose up -d --build

stop:
	docker compose down

create-users:
	docker exec -it billbudy_db bash -c 'psql -U billbudyUser -d billbudy -c "CREATE TABLE users (username VARCHAR(100) PRIMARY KEY, name VARCHAR(100), lastname VARCHAR(100), email VARCHAR(100) UNIQUE, password VARCHAR(100), date_of_birth DATE);"'

delete-db:
	docker volume rm gestion_db_data

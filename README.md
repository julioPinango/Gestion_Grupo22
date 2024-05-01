# Billbudy
A website that helps people keep track of shared expenses and split bills with friends, roommates, relatives or anyone else.


`make start` to start de app

`make create-users` Creates the table **users** in the db.

`make stop` to stop de containers.



`make delete-db` Deletes the volume used for the db.

# Endpoints

## Users
**Base URL**: localhost/users

### Create
**POST** localhost/users

```
{
  "name": "Gaston",
  "lastname": "Avila",
  "username": "avilagaston",
  "email": "gavila@fi.uba.ar",
  "password": "1234",
  "date_of_birth": "11/11/1111"
}
```

### Get user
**GET** localhost/users/avilagaston

### Get users
**GET** localhost/users

```
{
  "name": "Gaston",
  "lastname": "Avila",
  "username": "avilagaston",
  "email": "gavila@fi.uba.ar",
  "password": "1234",
  "date_of_birth": "11/11/1111"
}
```

### Login
**POST** localhost/users/login

```
{
  "email": "gavila@fi.uba.ar",
  "password": "1234"
}
```


## WIP...

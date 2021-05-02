# Auto Weekly
Pocketに保存されたURLを1週間分まとめてGrowiの記事にする

## Setup
```bash
$ cp .env.example .env
$ vi .env
$ docker-compose build
```

## Exec
```
$ docker-compose up
```
access http://localhost:8080/autoweekly

## Testing
```
$ docker-compose run --rm app npm run test
```

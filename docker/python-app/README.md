# Python Docker Application

Status: `EXECUTION PENDING`

This small Flask service satisfies the mandatory Python containerization exercise without changing the GyneCare MERN application.

## Endpoints

- `GET /` returns the demo message.
- `GET /health` returns a JSON health response.

## Build and run

From this directory:

```bash
docker build -t gynecare-python-demo:local .
docker run --rm --name gynecare-python-demo -p 8080:8080 gynecare-python-demo:local
```

Validate from another terminal:

```bash
curl http://localhost:8080/
curl http://localhost:8080/health
docker ps
docker logs gynecare-python-demo
docker inspect gynecare-python-demo
```

The image runs Gunicorn as the non-root `appuser` account and includes a Docker health check. Command output will be recorded in the evidence register only after actual execution.

## Lifecycle commands

```bash
docker stop gynecare-python-demo
docker start gynecare-python-demo
docker restart gynecare-python-demo
docker rm gynecare-python-demo
docker rmi gynecare-python-demo:local
```

Do not run removal commands against unrelated containers or images.

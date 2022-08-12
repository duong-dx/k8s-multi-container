docker build -t duong1200798/multi-client:latest -t duong1200798/multi-client:$SHA -f ./client/Dockerfile ./client
docker build -t duong1200798/multi-server:latest -t duong1200798/multi-server:$SHA -f ./server/Dockerfile ./server
docker build -t duong1200798/multi-worker:latest -t duong1200798/multi-worker:$SHA -f ./worker/Dockerfile ./worker

docker push duong1200798/multi-client:latest
docker push duong1200798/multi-server:latest
docker push duong1200798/multi-worker:latest

docker push duong1200798/multi-client:$SHA
docker push duong1200798/multi-server:$SHA
docker push duong1200798/multi-worker:$SHA

kubectl apply -f k8s
kubectl set deployments/server-deployment server=duong1200798/multi-server:$SHA
kubectl set deployments/client-deployment client=duong1200798/multi-client:$SHA
kubectl set deployments/worker-deployment worker=duong1200798/multi-worker:$SHA
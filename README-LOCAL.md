1. tạo secret env
> $ kubectl create secret generic postgres-password --from-literal POSTGRES_PASSWORD=password

2. apply
> $ kubectl apply -f k8s

3. In local
> $ minikube delete --all --purge
> $ minikube addons enable ingress

4. check  ingress enable
> $ minikube addons list

5. get env of POD
> $ kubectl exec -it <pod_name> -- env
> $ kubectl exec -it <pod_name> -- env


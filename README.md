1. Create new Project in GG cloud
2. Chọn Kubernetes Engine > Enable Kubernetes Engine API
3. Refresh lại sẽ thấy yêu cầu tạo kubernetes cluster > chọn tạo mới > GKE Standard
4. Điền thông Cluster basics:
   - name: k8s-multi-cluster
   - Location type: Zonal
   - zone-name: asia-southeast1-a
   - Control plane version: Release channel
   - Release channel: chọn default
   - Chọn NODE POOLS > default pool để tùy chỉnh cấu hình
   - Chọn Cluster > Network. Chọn private > 
       + Control plane IP range: 172.16.0.0/28
   - Bấm create chờ 5 phút
5. truy cập vào phần Service Account của gg cloud
   - SideBar -> IAM&Admin > Service Account > Create Service Account
   - fill 1 số thông tin:
       + Step 1: Service account name: travis-deployer
       + Step 2: Role of user: "Kubernetes Engine Admin"
       + step 3: continue > done
   - get manager key: options > manage keys
   ![img_2.png](img_2.png)
   - Chọn "Add Key" > "Create new key" > "Json"
   ![images-rm/img_1.png](img_1.png)
   ![img.png](img.png)
   - copy key.json vào folder dự án name "service-account.json"
6. config travis-ci để tránh lộ thông tin service-account.json vừa tải xuống

6.1
> $ docker-run -it -v $(pwd):/app ruby:2.4 sh (mac or linux)

6.2
> $ docker-run -it -v ${pwd}:/app ruby:2.4 sh (windows)

6.3
> $ cd app

6.4
> $ gem install travis

(login with github: follow theo https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

6.5. option 1

> $ travis login  --github-token YOUR_PERSONAL_TOKEN --com

> $ travis login  --github-token 2323232212121 --com

> $ travis encrypt-file service-account.json -r duong-dx/k8s-multi-container --com

6.5. option 2

> $ travis login  --github-token YOUR_PERSONAL_TOKEN --pro

> $ travis login  --github-token 2323232212121 --pro

> $ travis encrypt-file service-account.json -r duong-dx/k8s-multi-container --pro

6.6. Xóa file gốc "service-account.json" vì đã có file "service-account.json.enc"

6.7. Sau khi chạy 6.5 xong copy openssl response page to .travis.yml > before_install
![img_3.png](img_3.png)

6.8 Build docker image
> phân nhánh làm 2 trường hợp: 1. version docker latest 2. đánh số version

6.8.1 version docker latest
- Build docker image

> $ docker build -t [docker_id]/[image_name] -f [path/Dockerfile] [path]
> 
> $ docker build -t duong1200798/multi-client -f ./client/Dockerfile ./client

- Push image to docker hub
> $ docker push [docker_id]/[image_name]
> 
> $ docker push duong1200798/multi-client

- set image for container
> $ kubectl set [object]/[object_name] [container_name]=[docker_id]/[image_name]
> 
> $ kubectl set deployments/server-deployment server=duong1200798/multi-server

6.8.2 Build docker have tag version "theo commit id"
- Get $git_sha

> $ git rev-parse HEAD

> result: 745181d3604ebbd274bd311212121

- Build docker image

> $ docker build -t [docker_id]/[image_name]:[version] -f [path/Dockerfile] [path]
>
> $ docker build -t duong1200798/multi-client:745181d3 -f ./client/Dockerfile ./client

- Push image to docker hub
> $ docker push [docker_id]/[image_name]:[version]
>
> $ docker push duong1200798/multi-client:745181d3

- set image for container
> $ kubectl set [object]/[object_name] [container_name]=[docker_id]/[image_name]:[version]
>
> $ kubectl set deployments/server-deployment server=duong1200798/multi-server:745181d3

- cần sửa lại các image  trong k8s .yaml file với image name: version tương ứng

7. Create secret trên Google cloud K8s cluster

7.1 Option1: ssh to cluster và chạy 

> $ kubectl create secret generic postgres-password --from-literal POSTGRES_PASSWORD=password

7.2 Option1: ssh to cluster và chạy
- Chon GKE (Google Kubernetes Engine)
![img_4.png](img_4.png)
- set project
> $ gcloud config set project [project_id]
> 
> $ gcloud config set project k8s-multi-conatiner

- set zone
> $ gcloud config set compute/zone [zone]
>
> $ gcloud config set compute/zone asia-southeast1-a

- set container cluster
> $ gcloud container clusters get-credentials [cluster-id]
>
> $ gcloud container clusters get-credentials k8s-multi-cluster

- set secret
> $ kubectl create secret generic postgres-password --from-literal POSTGRES_PASSWORD=password

7.3 GKE (Google Kubernetes Engine) > chọn Cluster đã tạo > chọn configuration (để xem secret đã tạo)
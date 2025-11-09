# invoicepro360

| Stage | CodeBuild |
|-------|-----------|
| Production | [![](https://invoicepro360-codebuild-badges.s3.us-west-2.amazonaws.com/app-invoicepro360-com/prod/build.svg)](https://us-west-2.console.aws.amazon.com/codesuite/codebuild/054066508017/projects/cb-app-invoicepro360-com-prod-release/history?region=us-west-2) |
| Staging | [![](https://invoicepro360-codebuild-badges.s3.us-west-2.amazonaws.com/app-invoicepro360-com/stg/build.svg)](https://us-west-2.console.aws.amazon.com/codesuite/codebuild/054066508017/projects/cb-app-invoicepro360-com-stg-release/?region=us-west-2) |

latest image: `054066508017.dkr.ecr.us-west-2.amazonaws.com/app-invoicepro360-com:latest`

# Requirements
```
# Using nvm
Install nvm using https://github.com/nvm-sh/nvm#installing-and-updating

# install node
nvm install v18.20.5
nvm use v18.20.5
nvm list

node -v
v18.20.5

npm -v
10.8.2
```
## Project setup
```
pyenv global 2.7.18
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build

# test locally
npm install -g serve
serve -s dist
```

### Docker
```
https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html#Real-World-Example

docker build -t app.invoicepro360.com .
docker run -it -p 8080:80 --rm --name app-invoicepro360 app.invoicepro360.com
```

### Deployment AWS
```
make docker-push

# create git version tag for next docker-push
git tag -a v1.x.x -m 'Released x updates' -f
git push -f -v --tags origin main

cd kubernetes-deployments/eks-dev-us-west-2
# update auth-api tag
kubectl apply -f auth-api.yaml

```

### Documentation
- [NVM node version control management](https://github.com/nvm-sh/nvm)
- [Vue 3](https://v3.vuejs.org/guide/introduction.html)
- [Vue CLI](https://v3.vuejs.org/guide/introduction.html)
- [Vue Router](https://router.vuejs.org/guide/)
- [Vue Vuex](https://next.vuex.vuejs.org/)
- [Tailwindcss](https://tailwindcss.com/docs)
- [Headlessui](https://headlessui.com/v1/vue)


### Clover Improvement
- Before connectivity stop display order and welcome api
- show alert of clover connection 
- show alert of select device from pos setting   

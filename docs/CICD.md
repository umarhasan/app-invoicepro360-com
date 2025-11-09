# AWS CI/CD
Steps to add this repository to AWS CI/CD using work done in [test-service](https://github.com/invoicepro360/test-service) and [aws-cicd](https://github.com/invoicepro360/aws-cicd).

Follow steps in https://github.com/invoicepro360/aws-cicd/blob/main/README.md#steps-to-add-cicd

1. Create `develop` branch

TODO: Add branch protection ruleset on `main` and `develop` branches. Requires upgrade to Github Teams

```bash
# add VERSION file to main branch first
# we need it for project script to work
touch VERSION
```

```bash
git checkout -b develop main
git push origin develop

git checkout -b cicd develop
```

2. Copy files from other repo
```bash
cp -p ../clover-service/docs/CICD.md docs

# cp -p ../clover-service/VERSION .
cp -p ../clover-service/CODEOWNERS .
```

3. Update `Dockerfile` and test locally
```bash
docker buildx prune -f
docker buildx build --platform linux/arm64,linux/amd64 -f Dockerfile -t emadnajeeb/test-app-cicd:1.0.0 --load .

docker run -it --name my-cicd emadnajeeb/test-app-cicd:1.0.0

docker exec -it my-cicd bash
curl -v http://localhost/healthcheck

docker stop my-cicd && docker rm my-cicd
docker rmi emadnajeeb/test-app-cicd:1.0.0
```

4. Add submodule
```bash
git submodule add https://github.com/invoicepro360/aws-cicd.git

# refresh submodule
git submodule update --remote
```

5. Run script to create ecr, projects etc...
```bash
cd aws-cicd
sh ./run.sh app-invoicepro360-com
```

6. Update README to include badges
7. Do code review
8. other clean up
```bash
rm Makefile get_next_version.sh
```

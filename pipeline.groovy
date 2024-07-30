
pipeline {
    agent any
    environment{
        registry = "rpdharanidhar/devops-task03:latest"
        DOCKER_IMAGE = "rpdharanidhar/devops-task03:latest"
        KUBE_NAMESPACE = "jenkinsdemo-kube"
        DOCKER_PASSWORD = credentials('docker-password')
        DOCKER_USERNAME = credentials('docker-username')
        DOCKER_IMAGE_NAME = "rpdharanidhar/devops-task03"
        DOCKER_HUB_REPO = "rpdharanidhar"
        DOCKER_REGISTRY = "rpdharanidhar/devops-task01"
        MONGODB_SERVER = 'mongodb://localhost:27017'
        MONGODB_DATABASE = 'test'
        MONGODB_COLLECTION = 'people'
        MONGODB_URL = 'mongodb://dharani:dharani@localhost:27017/admin'
        
    }
    
    stages {
        stage('Checkout') {
            steps {
                git url: 'https://github.com/rpdharanidhar/devops-task03.git', branch: 'main', credentialsId: 'git-credentials'
            }
        }
        stage('Build Docker Image') {
            steps {
                bat "docker-compose build"
            }
        }
        stage('Run Docker Container') {
            steps {
                bat "docker-compose up -d"
            }
        }
        stage('Push Docker Image to Hub') {
            steps {
                bat "docker login -u ${DOCKER_USERNAME} -p ${DOCKER_PASSWORD} && docker-compose push nodejs"
            }
        }
        // stage('Cleaning up') {
        //     steps{
        //         bat "docker rmi $registry:$BUILD_NUMBER"
        //     }
        // }
    }
}

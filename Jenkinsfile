pipeline {
    agent any

    environment {
        CONTAINER_NAME = 'worldcup-frontend-jenkins'
        IMAGE_NAME = 'worldcup-frontend'
        NETWORK_NAME = 'app-net'
        PORT_MAPPING = '4205:80'
    }

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                bat "docker build --no-cache -t ${IMAGE_NAME}:latest -t ${IMAGE_NAME}:${BUILD_NUMBER} ."
            }
        }

        stage('Deploy Container') {
            steps {
                script {

                    bat "docker network create ${NETWORK_NAME} 2>nul || ver >nul"

                    bat "docker stop ${CONTAINER_NAME} 2>nul || ver >nul"
                    bat "docker rm ${CONTAINER_NAME} 2>nul || ver >nul"

                    bat """
                        docker run -d ^
                        --name ${CONTAINER_NAME} ^
                        --network ${NETWORK_NAME} ^
                        -p ${PORT_MAPPING} ^
                        ${IMAGE_NAME}:latest
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Frontend pipeline completed successfully!'
        }
        failure {
            echo 'Frontend pipeline failed. Please check the logs.'
        }
    }
}
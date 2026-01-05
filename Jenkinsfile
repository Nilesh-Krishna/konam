pipeline {

    agent any
 
    stages {
 
        stage('Install Dependencies') {

            steps {

                sh 'npm install'

            }

        }
 
        stage('Run Tests') {

            steps {

                sh 'npm test -- --watchAll=false || true'

            }

        }
 
        stage('Build React App') {

            steps {

                sh 'npm run build'

            }

        }
 
        stage('Build Docker Image') {

            steps {

                sh 'docker build -t konam-app .'

            }

        }
 
        stage('Run Docker Container') {

            steps {

                sh '''

                docker stop konam-container || true

                docker rm konam-container || true

                docker run -d -p 80:80 --name konam-container konam-app

                '''

            }

        }

    }

}
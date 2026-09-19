pipeline {
    agent any

    stages {
        stage('Build') {
            steps {
                bat '''
                    cd frontend
                    npm.cmd ci
                    npm.cmd run build
                '''
            }
        }

        stage('Test') {
            steps {
                bat 'node tests\\attendance.test.js'
            }
        }
    }
}
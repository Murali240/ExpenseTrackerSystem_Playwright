pipeline {

    agent any

    stages {

        stage('Checkout Source') {
            steps {
                checkout scm
            }
        }

        stage('Verify Node.js') {
            steps {
                bat 'node -v'
                bat 'npm -v'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                bat 'npx playwright install --with-deps'
            }
        }

        stage('Create .env File') {
            steps {
                writeFile file: '.env', text: '''
ETS_BASE_URL=https://expensestrackerdemo.issi-software.com

ETS_ADMIN_USERNAME=admin
ETS_ADMIN_PASSWORD=issi@1234

ETS_EMPLOYEE_USERNAME=kmkrishna
ETS_EMPLOYEE_PASSWORD=Gangamma@8

ETS_MANAGER_USERNAME=spilli
ETS_MANAGER_PASSWORD=$!V@p@V!@1916

ETS_ACCOUNTANT_USERNAME=mhemanth
ETS_ACCOUNTANT_PASSWORD=Bindu1986@

ETS_INVALID_USERNAME=invalidUser
ETS_INVALID_PASSWORD=invalidPassword

HEADLESS=true
DEBUG=false
'''
            }
        }

        stage('Run Playwright Tests') {
            steps {
                bat 'npx playwright test'
            }
        }

    }

    post {

        always {

            archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true

            archiveArtifacts artifacts: 'test-results/**', fingerprint: true

            archiveArtifacts artifacts: 'test-results/**/*.png', fingerprint: true

            archiveArtifacts artifacts: 'test-results/**/*.zip', fingerprint: true

            echo 'Playwright Pipeline Finished'
        }

        success {
            echo 'All Playwright Tests Passed'
        }

        failure {
            echo 'Some Playwright Tests Failed'
        }
    }
}
pipeline {
    agent any

    stages {

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }

        stage('Run Regression Tests') {
            steps {
                bat 'npx playwright test --project=chromium --grep "@regression"'
            }
        }

        stage('Publish HTML Report') {
            steps {
                archiveArtifacts artifacts: 'playwright-report/**', fingerprint: true
            }
        }
    }

    post {
        always {
            archiveArtifacts artifacts: 'test-results/**', allowEmptyArchive: true
            echo 'Pipeline Finished'
        }

        success {
            echo 'Regression Suite Executed Successfully'
        }

        failure {
            echo 'Regression Suite Failed'
        }
    }
}
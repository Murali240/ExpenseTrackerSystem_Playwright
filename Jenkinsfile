pipeline {
    agent any

    stages {

        // ============================================================
        // INSTALL DEPENDENCIES
        // ============================================================

        stage('Install Dependencies') {
            steps {
                bat 'npm ci'
            }
        }


        // ============================================================
        // CLEAN PREVIOUS REPORTS
        // ============================================================

        stage('Clean Previous Reports') {
            steps {
                bat 'if exist allure-results rmdir /S /Q allure-results'
                bat 'if exist allure-report rmdir /S /Q allure-report'
                bat 'if exist playwright-report rmdir /S /Q playwright-report'
                bat 'if exist test-results rmdir /S /Q test-results'
            }
        }


        // ============================================================
        // RUN ONLY REGRESSION TESTS
        // ============================================================

        stage('Run Regression Tests') {
            steps {
                bat 'npx playwright test --project=chromium --grep "@regression"'
            }
        }


        // ============================================================
        // PUBLISH PLAYWRIGHT HTML REPORT
        // ============================================================

        stage('Publish Playwright HTML Report') {
            steps {
                archiveArtifacts(
                    artifacts: 'playwright-report/**',
                    allowEmptyArchive: true,
                    fingerprint: true
                )
            }
        }
    }


    // ================================================================
    // POST BUILD ACTIONS
    // ================================================================

    post {

        always {

            // --------------------------------------------------------
            // Archive Playwright test results
            // --------------------------------------------------------

            archiveArtifacts(
                artifacts: 'test-results/**',
                allowEmptyArchive: true,
                fingerprint: true
            )


            // --------------------------------------------------------
            // Publish Allure Report in Jenkins
            // --------------------------------------------------------

            script {

                if (fileExists('allure-results')) {

                    allure(
                        includeProperties: false,
                        jdk: '',
                        results: [
                            [path: 'allure-results']
                        ]
                    )

                } else {

                    echo 'No allure-results directory found.'
                    echo 'Please check allure-playwright configuration.'
                }
            }


            echo '=============================================='
            echo ' UI PLAYWRIGHT REGRESSION PIPELINE FINISHED'
            echo '=============================================='
        }


        success {

            echo '=============================================='
            echo ' UI REGRESSION BUILD SUCCESSFUL'
            echo ' @regression tests executed successfully.'
            echo '=============================================='
        }


        failure {

            echo '=============================================='
            echo ' UI REGRESSION BUILD FAILED'
            echo ' Please check Jenkins Console Output.'
            echo '=============================================='
        }
    }
}
pipeline {
    agent any

    environment {
        MONGO_URL = 'mongodb://localhost:27017/cars24_clone'\n        PATH = "/opt/homebrew/bin:/usr/local/bin:${env.PATH}"
    }

    stages {
        stage('Diagnostics') {
            steps {
                echo '=== System Diagnostics ==='
                sh 'node -v || echo "Node not found"'
                sh 'npm -v || echo "npm not found"'
                sh 'java -version || echo "Java not found"'
                sh 'mvn -v || echo "Maven not found"'
                sh 'docker -v || echo "Docker not found"'
                sh 'chrome --version || google-chrome --version || echo "Chrome not found"'
            }
        }

        stage('Launch Services') {
            steps {
                echo '=== Setting up MongoDB Service ==='
                // Attempt to run MongoDB in Docker container if Docker is available
                // If it fails or is already running, continue
                sh '''
                    if command -v docker >/dev/null 2>&1; then
                        echo "Docker is installed. Attempting to start MongoDB container..."
                        docker run -d --name mongo-db-jenkins -p 27017:27017 mongo:latest || true
                    else
                        echo "Docker is not available. Relying on pre-existing host MongoDB instance."
                    fi
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Installing App & Test Dependencies ==='
                dir('Backend') {
                    sh 'npm install'
                }
                dir('frontend') {
                    sh 'npm install --legacy-peer-deps'
                }
                dir('test/selenium-java') {
                    sh 'mvn dependency:go-offline || mvn dependency:resolve'
                }
                dir('test/cypress') {
                    sh 'npm install'
                }
            }
        }

        stage('Database Seed') {
            steps {
                echo '=== Seeding MongoDB Database ==='
                dir('Backend') {
                    sh 'node seed/dealer.seed.js'
                    sh 'node seed/cars.seed.js'
                }
            }
        }

        stage('Start Application') {
            steps {
                echo '=== Launching Backend & Frontend Services ==='
                // Start Backend in background (using port 4000)
                dir('Backend') {
                    sh 'JENKINS_NODE_COOKIE=dontKillMe nohup node server.js > backend.log 2>&1 &'
                }
                // Start Frontend in background (using port 3000)
                dir('frontend') {
                    sh 'JENKINS_NODE_COOKIE=dontKillMe nohup npm run start > frontend.log 2>&1 &'
                }
                
                echo '=== Waiting for Services to become Responsive ==='
                sh '''
                    echo "Checking Backend port (4000)..."
                    for i in {1..20}; do
                        if curl -s -o /dev/null http://localhost:4000/user; then
                            echo "Backend is responsive!"
                            break
                        fi
                        echo "Retrying in 2 seconds..."
                        sleep 2
                    done
                    
                    echo "Checking Frontend port (3000)..."
                    for i in {1..20}; do
                        if curl -s -o /dev/null http://localhost:3000; then
                            echo "Frontend is responsive!"
                            break
                        fi
                        echo "Retrying in 2 seconds..."
                        sleep 2
                    done
                '''
            }
        }

        stage('Run E2E Tests') {
            steps {
                echo '=== Executing Selenium (Java) and Cypress Tests ==='
                dir('test') {
                    // This runs our custom script, which runs Java Maven tests & Cypress tests, then generates unified testng-results.xml
                    sh 'node run-tests.js'
                }
            }
        }
    }

    post {
        always {
            echo '=== Post-Build Actions: Cleanup & Publishing ==='
            
            // Clean up background processes
            sh 'kill $(lsof -t -i:3000) || kill -9 $(lsof -t -i:3000) || true'
            sh 'kill $(lsof -t -i:4000) || kill -9 $(lsof -t -i:4000) || true'
            
            // Stop MongoDB container if we spawned it via docker
            sh '''
                if command -v docker >/dev/null 2>&1; then
                    docker stop mongo-db-jenkins || true
                    docker rm mongo-db-jenkins || true
                fi
            '''
            
            // Archive backend/frontend server logs for debugging
            archiveArtifacts artifacts: 'Backend/backend.log, frontend/frontend.log', allowEmptyArchive: true

            // Publish TestNG XML Results
            testNG(reportFilenamePattern: '**/target/surefire-reports/testng-results.xml')
        }
    }
}

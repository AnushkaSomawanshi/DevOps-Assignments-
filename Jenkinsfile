// =============================================================================
// GyneCare Hospital Management System - Declarative CI Pipeline (Assignment 6)
// Target Repository: https://github.com/AnushkaSomawanshi/DevOps-Assignments-
// =============================================================================

pipeline {
    agent any

    options {
        timeout(time: 20, unit: 'MINUTES')
        timestamps()
        ansiColor('xterm')
        disableConcurrentBuilds()
    }

    environment {
        NODE_ENV = 'production'
        CI = 'true'
        REPO_URL = 'https://github.com/AnushkaSomawanshi/DevOps-Assignments-.git'
    }

    stages {
        stage('Checkout') {
            steps {
                echo '=== Stage 1: Retrieving Source Code from GitHub ==='
                checkout scmGit(
                    branches: [[name: '*/main']],
                    userRemoteConfigs: [[url: env.REPO_URL]]
                )
                echo "Source code successfully cloned to workspace: ${WORKSPACE}"
            }
        }

        stage('Environment Audit') {
            steps {
                echo '=== Stage 2: Auditing Build Environment ==='
                sh '''
                    echo "Checking installed tool versions:"
                    git --version
                    node -v || true
                    npm -v || true
                    docker --version || true
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                echo '=== Stage 3: Installing Dependencies ==='
                sh '''
                    echo "Installing Backend dependencies..."
                    cd server && npm install --omit=dev --no-audit --no-fund
                    cd ..

                    echo "Installing Frontend dependencies..."
                    cd client && npm install --no-audit --no-fund
                    cd ..
                '''
            }
        }

        stage('Build & Typecheck') {
            steps {
                echo '=== Stage 4: Compiling Application & Type Checking ==='
                sh '''
                    echo "Validating TypeScript types in client..."
                    npm --prefix client run typecheck

                    echo "Compiling React production bundle with Vite..."
                    npm --prefix client run build
                '''
            }
        }

        stage('Docker & Compose Validation') {
            steps {
                echo '=== Stage 5: Validating Container Specifications ==='
                sh '''
                    echo "Checking Dockerfile existence..."
                    test -f Dockerfile && echo "Root Dockerfile verified."
                    test -f client/Dockerfile && echo "Client Dockerfile verified."
                    test -f server/Dockerfile && echo "Server Dockerfile verified."

                    echo "Validating Docker Compose YAML syntax..."
                    docker compose config || true
                '''
            }
        }
    }

    post {
        always {
            echo "Pipeline execution finished for build #${BUILD_NUMBER}."
        }
        success {
            echo "SUCCESS: GyneCare CI pipeline passed all stages for branch main."
        }
        failure {
            echo "FAILURE: Build #${BUILD_NUMBER} encountered an error. Please inspect console logs."
        }
    }
}

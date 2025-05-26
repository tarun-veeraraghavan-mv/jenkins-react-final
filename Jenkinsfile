pipeline {
  agent any

  environment {
    NETLIFY_SITE_ID = '5a292c56-b5e1-44da-b51c-aa8a8d41a4a4'
    NETLIFY_AUTH_TOKEN = credentials('netlify-token')
  }

  stages {
    stage("Build") {
      agent {
        docker {
          image 'node:18-alpine'
          reuseNode true
        }
      }
      steps {
        sh '''
          ls -la
          node --version
          npm --version
          npm i
          npm run build
          ls -la
        '''
      }
    }
    stage("Unit testing") {
      agent {
        docker {
          image 'node:18-alpine'
          reuseNode true
        }
      }
      steps {
        sh '''
          test -f dist/index.html
          npm run test:unit
        '''
      }
    }
    stage("E2E testing") {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.52.0-jammy'
          reuseNode true
        }
      }
      steps {
        sh '''
          npm i serve
          node_modules/.bin/serve -s dist -p 5173 &
          npx playwright test 
        '''
      }
    }
    stage("Deploy staging") {
      agent {
        docker {
          image 'node:18-alpine'
          reuseNode true
          args '--network=host'
        }
      }
      steps {
        sh '''
          npm install netlify-cli
          ./node_modules/.bin/netlify --version
          echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
          ./node_modules/.bin/netlify status
          ./node_modules/.bin/netlify deploy --dir=dist
        '''
      }
    }

    stage("Approval") {
      steps {
        timeout(time: 15, unit: 'MINUTES') {
          input message: 'Do you wish to deploy to production?', ok: 'Yes, I am sure!'
        }
      }
    }

    stage("Deploy prod") {
      agent {
        docker {
          image 'node:18-alpine'
          reuseNode true
          args '--network=host'
        }
      }
      steps {
        sh '''
          npm install netlify-cli
          ./node_modules/.bin/netlify --version
          echo "Deploying to production. Site ID: $NETLIFY_SITE_ID"
          ./node_modules/.bin/netlify status
          ./node_modules/.bin/netlify deploy --dir=dist --prod
        '''
      }
    }
    stage("Prod E2E testing") {
      agent {
        docker {
          image 'mcr.microsoft.com/playwright:v1.52.0-jammy'
          reuseNode true
        }
      }

      environment {
        DEPLOY_URL = "https://shiny-duckanoo-51c471.netlify.app"
      }

      steps {
        script { // Use a script block to allow for more complex Groovy logic
          // Use withEnv to explicitly set the environment variable for the shell context
          // this makes it more reliable than just `ENV_VAR=value command`
          withEnv(["DEPLOY_URL=${DEPLOY_URL}"]) {
            sh '''
              # Optional: Add a debug print inside the shell to confirm the env var is visible
              echo "Inside Prod E2E shell, DEPLOY_URL is: $DEPLOY_URL"

              # Run Playwright tests. It should now pick up DEPLOY_URL from its process environment.
              npx playwright test
            '''
          }
        }
      }
    }
  }

  post {
    always {
      echo 'Pipeline completed'
    }
    success {
      echo 'Pipeline succeeded!'
    }
    failure {
      echo 'Pipeline failed!'
    }
  }
  
}
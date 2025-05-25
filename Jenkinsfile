pipeline {
  agent any

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
          npm run test
          ls -la
        '''
      }
    }
    stage("Test") {
      steps {
        sh '''
          test -f dist/index.html
        '''
      }
    }
  }
  
}
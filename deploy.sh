#!/bin/bash

# *************************************************************************** #
#
# This script is used to deploy the @global-website/frontend on a Jenkins 
# project.
# Add one of the following command to the "Execute Shell" textarea at 
# the build section of the project configuration.
#
# For "production" environment:
#     > sh deploy.sh
# For "staging" environment:
#     > NODE_ENV=staging sh deploy.sh
# For "test" environment:
#     > NODE_ENV=test sh deploy.sh
#
# *************************************************************************** #

exitWithMessageOnError () {
  if [ ! $? -eq 0 ]; then
    echo "An error has occurred during web site deployment."
    echo $1
    exit 1
  fi
}

# Set ENV variables
ENV_TEST="test"
ENV_STAGING="staging"

# START - Set the node environment variable # ******************************* #
NODE_ENV=$(printenv NODE_ENV)

if [ -z "$NODE_ENV" ]
  then
    NODE_ENV='production'
fi
# END # ********************************************************************* #

# START - Set the application port # **************************************** #
PORT="3000"

if [ "$NODE_ENV" = "$ENV_TEST" ]
 then
   PORT="3002"
elif [ "$NODE_ENV" = "$ENV_STAGING" ]
 then
   PORT="3001"
fi
# END # ********************************************************************* #

# START - Installing Yarn dependencies # ************************************* #
echo "";
echo "#### INSTALLING Yarn PACKAGES ####"
echo ">>> yarn install"
set x
yarn install
exitWithMessageOnError "Installation of Yarn packages failed"
set +x
# END # ********************************************************************* #

# START - Building the REACT application # ********************************** #
echo "";
echo "#### BUILDING THE APPLICATION ####"
echo ">>> yarn build"
set x
yarn build
exitWithMessageOnError "Build failed"
set +x
# END # ********************************************************************* #

# START - Starting the API application # ************************************ #
echo "";
echo "#### STARTING THE API INSTANCE ####"
set -x
yarn stop:api -- --name api-"$NODE_ENV" || echo "Process was not running."
set +x
set -x
yarn serve:api -- --name api-"$NODE_ENV"
set +x
# END # ********************************************************************* #

# START - Killig previously running applications # ************************** # 
echo "";
echo "#### KILLING PREVIOUS INSTANCE ####"
set -x
kill -9 $(cat .pidfile) || echo "Process was not running."
set +x
# END # ********************************************************************* #

# START - Starting the application # **************************************** #
echo "";
echo "#### STARTING THE APPLICATION ####"
set -x
export BUILD_ID=websiteFrontend_"$NODE_ENV"
yarn serve:frontend -- -p "$PORT" & sleep 1
echo $! > .pidfile
set +x
# END # ********************************************************************* #